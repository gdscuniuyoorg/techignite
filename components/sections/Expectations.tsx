import React from "react";
import SecondButton from "./buttons/SecondButton";
import Image from "next/image";
import ExpectationBoxes from "./buttons/ExpectationBoxes";
import Hackathon from "./Hackathon";

const Expectations = () => {
  return (
    <div className="container w-full py-10 ">
      <h2 className="font-bold text-2xl text-[#101828] mb-3 lg:text-5xl text-center">
        What you should expect
      </h2>
      <p className="text-[#475467] pt-5 text-sm lg:text-xl text-center mx-auto mb-16">
        Whether you&apos;re a complete beginner or looking to{" "}
        <br className="hidden lg:block" />
        take your skills to the next level.
      </p>
      <Hackathon />
      <div className="flex flex-col-reverse w-full gap-4 lg:flex-row justify-between lg:gap-20">
        <div className="w-full h-[622px] bg-[#4285F4] rounded-[32px] pt-[35px] lg:w-[40%]">
          <div className=" bg-black/90 bg-heroPattern w-[90%] h-[587px] m-auto rounded-[24px] text-white flex flex-col items-center justify-center">
            <div className="text-center font-inter">
              <h2 className="text-[20px] font-bold">There’s a lot to unpack</h2>
              <p className="text-[16px] py-5">
                {`Whether you're a complete`} <br />
                beginner or looking to take your skills <br />
                to the next level.
              </p>
              <a href="https://gdsc.community.dev/e/m5hskb/" target="_blank">
                <SecondButton>Register Now</SecondButton>
              </a>

              <p className="pt-5">Registration is free</p>
              <div className=" flex items-center justify-center pt-3">
                <Image
                  src="/icons/lightening.svg"
                  alt="Tech Ignite Lightening"
                  width={167.5}
                  height={21.5}
                ></Image>
              </div>
            </div>
          </div>
        </div>
        <div className="[w-60%] pt-2 grid grid-cols-1 gap-4 lg:grid-cols-2 lg:pt-5">
          <ExpectationBoxes>
            <div className="flex flex-col items-center justify-center text-center">
              <Image
                src="/icons/third.svg"
                alt=""
                width={113}
                height={113}
              ></Image>
              <h3 className="text-[20px] font-bold py-3">
                Interactive Workshops
              </h3>
              <p>{`Whether you're a complete beginner or looking to take your`}</p>
            </div>
          </ExpectationBoxes>
          <ExpectationBoxes>
            <div className="flex flex-col items-center justify-center text-center">
              <Image
                src="/icons/second.svg"
                alt=""
                width={113}
                height={113}
              ></Image>
              <h3 className="text-[20px] font-bold py-3">
                Learn in-demand Tech skills
              </h3>
              <p>{`Whether you're a complete beginner or looking to take your`}</p>
            </div>
          </ExpectationBoxes>
          <ExpectationBoxes>
            <div className="flex flex-col items-center justify-center text-center">
              <Image
                src="/icons/first.svg"
                alt=""
                width={113}
                height={113}
              ></Image>
              <h3 className="text-[20px] font-bold py-3">
                Network with people
              </h3>
              <p>{`Whether you're a complete beginner or looking to take your`}</p>
            </div>
          </ExpectationBoxes>
          <ExpectationBoxes>
            {" "}
            <div className="flex flex-col items-center justify-center text-center">
              <Image
                src="/icons/fourth.svg"
                alt=""
                width={113}
                height={113}
              ></Image>
              <h3 className="text-[20px] font-bold py-3">
                Discover opportunities
              </h3>
              <p>{`Whether you're a complete beginner or looking to take your`}</p>
            </div>
          </ExpectationBoxes>
        </div>
      </div>
    </div>
  );
};

export default Expectations;
