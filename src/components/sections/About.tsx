export default function About() {
  return (
    <section id="About" className="container w-full py-[200px]">
      <div className="mx-auto flex max-w-[1200px] flex-col overflow-hidden rounded-2xl bg-[#130E09] lg:flex-row lg:items-end lg:rounded-[32px]">
        <div className="">
          <div className="px-6 pt-10 pb-8 text-white lg:pt-[72px] lg:pb-16 lg:pl-[72px]">
            <h2 className="mb-2 text-xl font-bold sm:text-2xl lg:mb-8 lg:text-5xl">
              About Tech Ignite
            </h2>
            <div className="flex flex-col text-xs sm:text-sm lg:w-[480px] lg:text-xl">
              <p>
                A tech conference held in collaboration with GDG On Campus UNIUYO
                community
              </p>
              <p className="mt-[1.5rem] font-bold text-[#FBBC04]">Featuring:</p>
              <p>10 speakers</p>
              <p>5 panelists</p>
              <p>500+ attendees</p>
            </div>
          </div>
          <div className="mr-8 mb-10 rounded-tr-full rounded-br-full bg-[#FBBC04] py-5 sm:mr-14 lg:mb-24">
            <div className="mx-auto flex w-max items-center space-x-2">
              <div className="h-4 w-4 lg:h-8 lg:w-8">
                <img src="/icons/Star.svg" alt="Star logo" width={31} height={31} />
              </div>
              <p className="text-xs text-[#130E09] sm:text-sm lg:text-xl">
                Innovative, Engaging, Inspiring, Collaborative, Transformative.{' '}
              </p>
              <div className="h-4 w-4 lg:h-8 lg:w-8">
                <img src="/icons/Star.svg" alt="Star logo" width={31} height={31} />
              </div>
            </div>
          </div>
        </div>
        <div className="px-6 lg:pr-[72px]">
          <div className="rounded-t-[20px] bg-[#FDDD81] p-4 lg:rounded-t-[32px] lg:px-6 lg:py-8">
            <div className="h-11 w-[72px] lg:h-20 lg:w-32">
              <img
                src="/icons/logo-2.svg"
                alt="Tech Ignite Logo"
                width={121}
                height={74}
              />
            </div>
            <p className="mt-3 text-xs text-[#130E09] sm:text-sm lg:text-lg">
              Join us for an exciting journey of discovery, networking, and learning as we
              bring together tech enthusiasts, developers, and creatives to explore the
              latest advancements in technology.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
