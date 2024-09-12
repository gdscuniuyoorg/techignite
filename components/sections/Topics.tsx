import React from "react";
import TopicsContainer from "./buttons/TopicsContainerr";
import Image from "next/image";

const Topics = () => {
  return (
    <div className="flex flex-col px-5 bg-[#130E09] text-white gap-20 w-full lg:px-20 pt-20">
      <div className="lg:flex justify-center ">
        <div className="w-full lg:w-[55%]">
          <p className="text-[30px] lg:text-[50px] font-bold leading-tight font-product-sans">
            <span className="text-[#FBBC04] italic"> We listened,</span>
            <br />
            and now we are back <br className="hidden lg:block" /> with
            something more interesting for you.
          </p>
          <p className="pt-5">
            {`Whether you're a complete beginner or looking to take your`}{" "}
            <br className="hidden lg:block" />
            skills to the next level, Tech Ignite has something for you!
          </p>
        </div>
        <div className=" w-full px-2 pt-[5rem] lg:w-[481px] ">
          <div className="w-full bg-[#FDDD81] rounded-t-[20px] lg:rounded-t-[32px] p-4 lg:px-6 lg:py-8 lg:w-[481px]">
            <div className="">
              <Image
                src="/icons/circle.svg"
                alt=""
                width={56}
                height={56}
              ></Image>
              <h3 className="text-[20px] pt-3 font-semibold text-black lg:text-[30px]">
                We have prepared a wide range of topics for you
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[10px] pt-10 lg:gap-4 lg:text-[14px]">
              <div>
                <TopicsContainer className="flex items-center justify-between">
                  <Image
                    src="/icons/location.svg"
                    alt=""
                    width={24}
                    height={24}
                  ></Image>
                  <p>Career Growth</p>
                </TopicsContainer>
              </div>
              <div className="mt-6">
                <TopicsContainer className="flex items-center justify-between">
                  <Image
                    src="/icons/location.svg"
                    alt=""
                    width={24}
                    height={24}
                  ></Image>
                  <p>Artificial Intelligence</p>
                </TopicsContainer>
              </div>
              <div>
                <TopicsContainer className="flex items-center justify-between">
                  <Image
                    src="/icons/location.svg"
                    alt=""
                    width={24}
                    height={24}
                  ></Image>
                  <p>Multidisciplinary Design</p>
                </TopicsContainer>
              </div>
              <div className="mt-6">
                <TopicsContainer className="flex items-center justify-between">
                  <Image
                    src="/icons/location.svg"
                    alt=""
                    width={24}
                    height={24}
                  ></Image>
                  <p>Cybersecurity</p>
                </TopicsContainer>
              </div>
              <div>
                <TopicsContainer className="flex items-center justify-between">
                  <Image
                    src="/icons/location.svg"
                    alt=""
                    width={24}
                    height={24}
                  ></Image>
                  <p>Low and No Code</p>
                </TopicsContainer>
              </div>
              <div className="mt-6">
                <TopicsContainer className="flex items-center justify-between">
                  <Image
                    src="/icons/location.svg"
                    alt=""
                    width={24}
                    height={24}
                  ></Image>
                  <p>Digital Marketing</p>
                </TopicsContainer>
              </div>
              <div>
                <TopicsContainer className="flex items-center justify-between">
                  <Image
                    src="/icons/location.svg"
                    alt=""
                    width={24}
                    height={24}
                  ></Image>
                  <p>Software Engineering</p>
                </TopicsContainer>
              </div>
              <div className="mt-6">
                <TopicsContainer className="flex items-center justify-between">
                  <Image
                    src="/icons/location.svg"
                    alt=""
                    width={24}
                    height={24}
                  ></Image>
                  <p>Project Management</p>
                </TopicsContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topics;
