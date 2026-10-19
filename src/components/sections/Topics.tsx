import React from 'react';
import TopicsContainer from './buttons/TopicsContainerr';

const topicItems = [
  'Virtual Assistant📋',
  'Content Writing📝',
  'Cloud Computing☁️',
  'Blockchain💎',
  'Cybersecurity🔒',
  'Digital Marketing💻',
  'Project Management💼',
  'AI and ML🤖',
  'Andriod Development📱',
  'Web Development🌐',
  'UI/UX Design🎨',
  'Data Science📊',
  'Game Development🎮',
  'DevOps🛠️',
];

const TopicItem = ({ text, index }: { text: string; index: number }) => (
  <div className={index % 2 !== 0 ? 'mt-6' : ''}>
    <TopicsContainer className="flex items-center justify-center justify-start">
      <p className="overflow-hidden text-[1rem] text-ellipsis whitespace-nowrap">
        {text}
      </p>
    </TopicsContainer>
  </div>
);

const Topics: React.FC = () => {
  return (
    <section className="flex w-full flex-col gap-20 bg-[#130E09] px-5 pt-20 text-white lg:px-20">
      <div className="justify-center lg:flex">
        <div className="w-full lg:w-[55%]">
          <h2 className="font-product-sans text-[30px] leading-tight font-bold lg:text-[50px]">
            <span className="text-[#FBBC04] italic">We listened,</span>
            <br />
            and now we are back <br className="hidden lg:block" /> with something more
            interesting for you.
          </h2>
          <p className="pt-5 text-lg">
            {`Whether you're a complete beginner or looking to take your`}
            <br className="hidden lg:block" />
            skills to the next level, Tech Ignite has something for you!
          </p>
        </div>
        <div className="w-full px-2 pt-[5rem] lg:w-[481px]">
          <div className="w-full rounded-t-[20px] bg-[#FDDD81] p-4 lg:w-[481px] lg:rounded-t-[32px] lg:px-6 lg:py-8">
            <div className="">
              <img
                src="/icons/circle.svg"
                alt="Decorative circle icon"
                width={56}
                height={56}
              />
              <h3 className="pt-3 text-[20px] font-semibold text-black lg:text-[30px]">
                We have prepared a wide range of topics for you
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-10 text-[10px] lg:gap-4 lg:text-[14px]">
              {topicItems.map((item, index) => (
                <TopicItem key={item} text={item} index={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Topics;
