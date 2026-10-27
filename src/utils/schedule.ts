/** One timed row of the agenda. */
export interface ScheduleSession {
  readonly time: string;
  readonly title: string;
}

/** One day block of the schedule section. */
export interface ScheduleDay {
  readonly label: string;
  readonly theme: string;
  readonly date: string;
  readonly sessions: readonly ScheduleSession[];
}

/** Agenda shown in the "Schedule" section: hackathon finale day plus the
 * conference day (see the hero's 20 November 2026 date). */
export const scheduleDays: readonly ScheduleDay[] = [
  {
    label: 'Day 1',
    theme: 'Hackathon',
    date: 'Nov 19, 2026',
    sessions: [
      { time: '09:00', title: 'Opening Ceremony & Team Check-in' },
      { time: '11:00', title: 'Hackathon Build Sprints' },
      { time: '14:00', title: 'Mentor Clinic: Ship What You Start' },
      { time: '16:00', title: 'Project Demos & Judging' },
    ],
  },
  {
    label: 'Day 2',
    theme: 'Conference',
    date: 'Nov 20, 2026',
    sessions: [
      { time: '09:00', title: 'Opening Ceremony & Keynote – Temitope Omolere' },
      { time: '11:00', title: "Panel: Building for Africa's Next Million Users" },
      { time: '14:00', title: 'Workshop: Motion & Interactive Design – Diego Costa' },
      { time: '16:00', title: 'Closing Remarks & Afterparty' },
    ],
  },
];
