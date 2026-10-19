import React from 'react';
import SecondButton from './buttons/SecondButton';
import ExpectationBoxes from './buttons/ExpectationBoxes';
import Hackathon from './Hackathon';

const expectationItems = [
  {
    icon: '/icons/third.svg',
    title: 'Interactive Workshops',
    description:
      'Join our interactive workshops to learn, connect, and grow with tech experts. Participate in practical sessions on the latest tools, trends, and best practices in the Tech industry.',
  },
  {
    icon: '/icons/second.svg',
    title: 'Learn in-demand Tech skills',
    description:
      "Gain the tech skills that are driving the industry forward. Elevate your career by learning the tools and expertise that employers are looking for in today's fast-paced tech world.",
  },
  {
    icon: '/icons/first.svg',
    title: 'Network with people',
    description:
      'Meet and connect with professionals from various tech fields. Engage with like-minded individuals, exchange ideas, and build lasting collaborations that can drive your career forward.',
  },
  {
    icon: '/icons/fourth.svg',
    title: 'Discover opportunities',
    description:
      "Your next big career move could start here. Don't miss out on the chance to uncover exciting opportunities and make valuable connections.",
  },
];

const Expectations: React.FC = () => {
  return (
    <section className="container w-full px-4 py-10 md:px-8">
      <h2 className="mb-3 text-center text-2xl font-bold text-[#101828] lg:text-5xl">
        What you should expect
      </h2>
      <p className="mx-auto mb-16 max-w-3xl pt-5 text-center text-base text-[#475467] lg:text-xl">
        {`At Tech Ignite, you'll encounter professionals from diverse tech fields.`}
        <br className="hidden lg:block" />
        {`Who knows? You might even meet your next employer.`}
      </p>
      <Hackathon />
      <div className="flex flex-col-reverse justify-between gap-8 lg:flex-row lg:gap-20">
        <div className="w-full rounded-3xl bg-[#4285F4] p-4 lg:w-2/5">
          <div className="flex h-full w-full flex-col items-center justify-center rounded-2xl bg-black/90 bg-[url('/icons/wavy.svg')] p-8 text-white">
            <h2 className="mb-4 text-2xl font-bold">{`There's a lot to unpack`}</h2>
            <p className="mb-6 text-center text-lg">
              {`We have an exciting lineup in store for you! After an amazing
              event last year, we're back with even bigger and better
              experiences. Don't miss out!`}
            </p>
            <a
              href="https://lu.ma/event/evt-UkQmzgDlFU4DNoy"
              data-luma-action="checkout"
              data-luma-event-id="evt-UkQmzgDlFU4DNoy"
              className="mb-6"
            >
              <SecondButton>Register Now</SecondButton>
            </a>
            <p className="mb-4 text-lg">Registration is free</p>
            <img
              src="/icons/lightening.svg"
              alt="Tech Ignite Lightening"
              width={167.5}
              height={21.5}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:w-3/5">
          {expectationItems.map((item, index) => (
            <ExpectationBoxes key={index}>
              <div className="flex flex-col items-center text-center">
                <img src={item.icon} alt="" width={113} height={113} />
                <h3 className="py-3 text-xl font-bold">{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </ExpectationBoxes>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Expectations;
