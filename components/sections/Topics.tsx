import React from "react";
import TopicsContainer from "./buttons/TopicsContainerr";
import Image from "next/image";

const topicItems = [
  "Virtual Assistant📋",
  "Content Writing📝",
  "Cloud Computing☁️",
  "Blockchain💎",
  "Cybersecurity🔒",
  "Digital Marketing💻",
  "Project Management💼",
  "AI and ML🤖",
  "Andriod Development📱",
  "Web Development🌐",
  "UI/UX Design🎨",
  "Data Science📊",
  "Game Development🎮",
  "DevOps🛠️",
];

const TopicItem = ({ text, index }: { text: string; index: number }) => (
  <div className={`${index % 2 !== 0 ? "mt-6" : ""}`}>
    <TopicsContainer className="flex items-center justify-start flex items-center justify-center">
      <p className="text-[1rem] whitespace-nowrap overflow-hidden text-ellipsis">
        {text}
      </p>
    </TopicsContainer>
  </div>
);

const Topics: React.FC = () => {
  return (
    <section className="flex flex-col px-5 bg-[#130E09] text-white gap-20 w-full lg:px-20 pt-20">
      <div className="lg:flex justify-center">
        <div className="w-full lg:w-[55%]">
          <h2 className="text-[30px] lg:text-[50px] font-bold leading-tight font-product-sans">
            <span className="text-[#FBBC04] italic">We listened,</span>
            <br />
            and now we are back <br className="hidden lg:block" /> with
            something more interesting for you.
          </h2>
          <p className="pt-5 text-lg">
            {`Whether you're a complete beginner or looking to take your`}
            <br className="hidden lg:block" />
            skills to the next level, Tech Ignite has something for you!
          </p>
        </div>
        <div className="w-full px-2 pt-[5rem] lg:w-[481px]">
          <div className="w-full bg-[#FDDD81] rounded-t-[20px] lg:rounded-t-[32px] p-4 lg:px-6 lg:py-8 lg:w-[481px]">
            <div className="">
              <Image
                src="/icons/circle.svg"
                alt="Decorative circle icon"
                width={56}
                height={56}
              />
              <h3 className="text-[20px] pt-3 font-semibold text-black lg:text-[30px]">
                We have prepared a wide range of topics for you
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[10px] pt-10 lg:gap-4 lg:text-[14px]">
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
