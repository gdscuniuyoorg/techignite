import { formText } from '@/lib/form';
import { createFileRoute } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { type SyntheticEvent } from 'react';
import { TicketPercent, Plus, CheckCircle2, Info } from 'lucide-react';
import {
  listCouponInventory,
  createCouponInventory,
  allocateCoupon,
  markCouponUsed,
  adminErrorMessage,
  type CouponAllocation,
} from '@/lib/admin-api';
import { noindexHead } from '@/lib/seo';

export const Route = createFileRoute('/admin/coupons')({
  head: () => noindexHead('Sponsor coupons — Tech Ignite Admin'),
  component: AdminCoupons,
});

function AdminCoupons() {
  const queryClient = useQueryClient();
  const inventory = useQuery({
    queryKey: ['admin', 'coupon-inventory'],
    queryFn: () => listCouponInventory({ limit: 50, offset: 0 }),
  });

  const invalidateInventory = () =>
    void queryClient.invalidateQueries({ queryKey: ['admin', 'coupon-inventory'] });

  const createMutation = useMutation({
    mutationFn: async (input: { totalSlots: number; provider?: string }) => {
      try {
        return await createCouponInventory(input);
      } catch (error) {
        throw new Error(await adminErrorMessage(error), { cause: error });
      }
    },
    onSuccess: invalidateInventory,
  });

  const allocateMutation = useMutation({
    mutationFn: async (input: {
      inventoryId: string;
      teamId: string;
      couponCode: string;
    }) => {
      try {
        return await allocateCoupon(input);
      } catch (error) {
        throw new Error(await adminErrorMessage(error), { cause: error });
      }
    },
    onSuccess: invalidateInventory,
  });

  const useMutationCoupon = useMutation({
    mutationFn: async (allocationId: string) => {
      try {
        await markCouponUsed(allocationId);
      } catch (error) {
        throw new Error(await adminErrorMessage(error), { cause: error });
      }
    },
  });

  const handleCreate = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const totalSlots = Number(data.get('totalSlots') ?? 20);
    const provider = formText(data, 'provider').trim();
    createMutation.mutate({
      totalSlots,
      ...(provider ? { provider } : {}),
    });
    form.reset();
  };

  const handleAllocate = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const inventoryId = formText(data, 'inventoryId');
    const teamId = formText(data, 'teamId').trim();
    const couponCode = formText(data, 'couponCode').trim();
    if (inventoryId && teamId && couponCode) {
      allocateMutation.mutate({ inventoryId, teamId, couponCode });
      form.reset();
    }
  };

  const handleMarkUsed = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const allocationId = formText(data, 'allocationId').trim();
    if (allocationId) {
      useMutationCoupon.mutate(allocationId);
      form.reset();
    }
  };

  const inventories = inventory.data?.items ?? [];
  const allocatable = inventories.filter((item) => item.availableSlots > 0);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-eyebrow text-brand-blue-soft uppercase">
          LiteHosting × Tech Ignite
        </p>
        <h1 className="mt-1 text-heading font-medium text-white">Sponsor coupons</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Twenty hosting coupons for the best teams. Inventory is created once, allocated
          to teams by their platform team ID, and marked used when a team redeems it.
          Allocations are final and audited.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-5">
        {/* Inventory table + create */}
        <section className="flex flex-col gap-4 xl:col-span-3">
          <div className="rounded-card border border-line bg-ink-raised p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="flex items-center gap-2 text-label text-white">
                <TicketPercent
                  size={18}
                  strokeWidth={1.75}
                  className="text-brand-blue-soft"
                  aria-hidden="true"
                />
                Inventory
              </h2>
            </div>

            {inventory.isPending ? (
              <div className="mt-4 flex flex-col gap-2" aria-busy="true">
                {Array.from({ length: 3 }, (_, i) => (
                  <div key={i} className="h-12 animate-pulse rounded-xs bg-ink-soft" />
                ))}
                <span className="sr-only">Loading inventory…</span>
              </div>
            ) : inventory.error ? (
              <div className="mt-4">
                <p className="text-sm text-[#ff9d91]">Couldn’t load inventory.</p>
                <button
                  type="button"
                  onClick={() => void inventory.refetch()}
                  className="mt-2 flex h-11 items-center rounded-xs bg-brand-blue px-4 text-button text-white hover:bg-brand-blue-strong"
                >
                  Retry
                </button>
              </div>
            ) : inventories.length === 0 ? (
              <p className="mt-4 text-sm text-muted">
                No inventory yet. Create the first batch of slots below.
              </p>
            ) : (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[36rem] text-left text-sm">
                  <thead>
                    <tr className="border-b border-line text-muted">
                      <th className="py-2 pr-4 font-normal">Provider</th>
                      <th className="py-2 pr-4 font-normal">Slots</th>
                      <th className="py-2 pr-4 font-normal">Allocated</th>
                      <th className="py-2 pr-4 font-normal">Available</th>
                      <th className="py-2 font-normal">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventories.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b border-line/50 text-white/85 last:border-0"
                      >
                        <td className="py-2 pr-4">{item.provider ?? 'LiteHosting'}</td>
                        <td className="py-2 pr-4 tabular-nums">{item.totalSlots}</td>
                        <td className="py-2 pr-4 tabular-nums">{item.allocatedSlots}</td>
                        <td className="py-2 pr-4">
                          <span
                            className={`tabular-nums ${item.availableSlots === 0 ? 'text-[#ff9d91]' : 'text-brand-green-bright'}`}
                          >
                            {item.availableSlots}
                          </span>
                        </td>
                        <td className="py-2 text-muted">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <form
              onSubmit={handleCreate}
              className="mt-5 flex flex-wrap items-end gap-3 border-t border-line pt-4"
            >
              <label className="flex w-28 flex-col gap-2 text-sm text-white/80">
                Slots (max 20)
                <input
                  name="totalSlots"
                  type="number"
                  min={1}
                  max={20}
                  defaultValue={20}
                  required
                  className="h-11 rounded-xs border border-line bg-ink px-3 text-paper outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue"
                />
              </label>
              <label className="flex min-w-44 flex-1 flex-col gap-2 text-sm text-white/80">
                Provider <span className="text-muted">(optional)</span>
                <input
                  name="provider"
                  type="text"
                  placeholder="LiteHosting"
                  className="h-11 rounded-xs border border-line bg-ink px-3 text-paper outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue"
                />
              </label>
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="flex h-11 items-center gap-2 rounded-xs bg-brand-blue px-5 text-button text-white transition-colors hover:bg-brand-blue-strong disabled:opacity-50"
              >
                <Plus size={16} strokeWidth={2} aria-hidden="true" />
                {createMutation.isPending ? 'Creating…' : 'Create inventory'}
              </button>
              {createMutation.error && (
                <p role="alert" className="w-full text-sm text-[#ff9d91]">
                  {createMutation.error.message}
                </p>
              )}
              {createMutation.isSuccess && (
                <p role="status" className="w-full text-sm text-brand-green-bright">
                  Inventory created with {createMutation.data.totalSlots} slots.
                </p>
              )}
            </form>
          </div>
        </section>

        {/* Allocate */}
        <section className="flex flex-col gap-4 xl:col-span-2">
          <form
            onSubmit={handleAllocate}
            className="flex flex-col gap-3 rounded-card border border-line bg-ink-raised p-5"
          >
            <h2 className="text-label text-white">Allocate to a team</h2>
            <label className="flex flex-col gap-2 text-sm text-white/80">
              Inventory
              <select
                name="inventoryId"
                required
                defaultValue=""
                className="h-11 rounded-xs border border-line bg-ink px-3 text-paper outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue"
              >
                <option value="" disabled>
                  Select inventory…
                </option>
                {allocatable.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.provider ?? 'LiteHosting'} — {item.availableSlots} slots left
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-2 text-sm text-white/80">
              Team ID <span className="text-muted">(platform UUID)</span>
              <input
                name="teamId"
                type="text"
                required
                pattern="[0-9a-fA-F-]{36}"
                placeholder="e.g. 3f6b1c2a-…"
                className="h-11 rounded-xs border border-line bg-ink px-3 font-mono text-sm text-paper outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm text-white/80">
              Coupon code
              <input
                name="couponCode"
                type="text"
                required
                placeholder="LITEHOST-XXXX"
                className="h-11 rounded-xs border border-line bg-ink px-3 font-mono text-sm text-paper outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue"
              />
            </label>
            {allocateMutation.error && (
              <p role="alert" className="text-sm text-[#ff9d91]">
                {allocateMutation.error.message}
              </p>
            )}
            <button
              type="submit"
              disabled={allocateMutation.isPending || allocatable.length === 0}
              className="flex h-11 items-center justify-center rounded-xs bg-brand-blue px-5 text-button text-white transition-colors hover:bg-brand-blue-strong disabled:cursor-not-allowed disabled:opacity-50"
            >
              {allocateMutation.isPending ? 'Allocating…' : 'Allocate coupon'}
            </button>
            {allocatable.length === 0 && (
              <p className="text-sm text-muted">
                No inventory with free slots. Create one first.
              </p>
            )}
          </form>

          {allocateMutation.data && (
            <AllocationReceipt allocation={allocateMutation.data} />
          )}

          {/* Mark used */}
          <form
            onSubmit={handleMarkUsed}
            className="flex flex-col gap-3 rounded-card border border-line bg-ink-raised p-5"
          >
            <h2 className="text-label text-white">Mark an allocation as used</h2>
            <p className="flex items-start gap-2 text-sm text-muted">
              <Info size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
              Paste the allocation ID (shown right after allocation, or in the audit log).
              There is no list endpoint for allocations, so it can’t be picked from a
              dropdown.
            </p>
            <label className="flex flex-col gap-2 text-sm text-white/80">
              Allocation ID
              <input
                name="allocationId"
                type="text"
                required
                placeholder="allocation uuid"
                className="h-11 rounded-xs border border-line bg-ink px-3 font-mono text-sm text-paper outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue"
              />
            </label>
            {useMutationCoupon.error && (
              <p role="alert" className="text-sm text-[#ff9d91]">
                {useMutationCoupon.error.message}
              </p>
            )}
            {useMutationCoupon.isSuccess && (
              <p
                role="status"
                className="flex items-center gap-2 text-sm text-brand-green-bright"
              >
                <CheckCircle2 size={16} aria-hidden="true" /> Marked as used.
              </p>
            )}
            <button
              type="submit"
              disabled={useMutationCoupon.isPending}
              className="flex h-11 items-center justify-center rounded-xs border border-line bg-ink px-5 text-button text-white/85 transition-colors hover:border-brand-blue hover:text-white disabled:opacity-50"
            >
              {useMutationCoupon.isPending ? 'Updating…' : 'Mark used'}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}

function AllocationReceipt({ allocation }: { readonly allocation: CouponAllocation }) {
  return (
    <div className="rounded-card border border-brand-green-bright/30 bg-brand-green-bright/5 p-5">
      <p className="flex items-center gap-2 text-label text-brand-green-bright">
        <CheckCircle2 size={18} aria-hidden="true" /> Coupon allocated
      </p>
      <dl className="mt-3 grid grid-cols-1 gap-1 text-sm text-white/80">
        <div className="flex gap-2">
          <dt className="w-24 text-muted">Code</dt>
          <dd className="font-mono">{allocation.couponCode}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="w-24 text-muted">Team</dt>
          <dd className="font-mono">{allocation.teamId}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="w-24 text-muted">Allocation</dt>
          <dd className="font-mono break-all">{allocation.id}</dd>
        </div>
      </dl>
    </div>
  );
}
