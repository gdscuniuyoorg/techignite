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
        {`At Tech Ignite, you'll encounter professionals from diverse tech fields. `}       <br className="hidden lg:block" />Who knows? You might even meet your next employer.
      </p>
      <Hackathon />
      <div className="flex flex-col-reverse w-full gap-4 lg:flex-row justify-between lg:gap-20">
        <div className="w-full h-[622px] bg-[#4285F4] rounded-[32px] pt-[35px] lg:w-[40%]">
          <div className=" bg-black/90 bg-heroPattern w-[90%] h-[587px] m-auto rounded-[24px] text-white flex flex-col items-center justify-center">
            <div className="text-center font-inter">
              <h2 className="text-[20px] font-bold">There’s a lot to unpack</h2>
              <p className="text-[16px] py-5">
                {`We have an exciting lineup in store for you!`} <br />
                After an amazing event last year, we’re back with even bigger and better experiences. <br />
                Don’t miss out!
              </p>

              <a
                href="https://lu.ma/event/evt-UkQmzgDlFU4DNoy"
                // className="luma-checkout--button"
                data-luma-action="checkout"
                data-luma-event-id="evt-UkQmzgDlFU4DNoy"
              >
                <SecondButton>Register Now</SecondButton>
              </a>
              {/* <a href="https://gdsc.community.dev/e/m5hskb/" target="_blank">
                <SecondButton>Register Now</SecondButton>
              </a> */}

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
              <p>{`Join our interactive workshops to learn, connect, and grow with tech experts. Participate in practical sessions on the latest tools, trends, and best practices in the Tech industry. Whether you're sharpening your skills or expanding your knowledge, these workshops provide valuable insights and networking opportunities.`}</p>
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
              <p>{`Gain the tech skills that are driving the industry forward. Elevate your career by learning the tools and expertise that employers are looking for in today’s fast-paced tech world.`}</p>
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
              <p>{`Meet and connect with professionals from various tech fields. Engage with like-minded individuals, exchange ideas, and build lasting collaborations that can drive your career forward.`}</p>
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
              <p>{`Your next big career move could start here. Don’t miss out on the chance to uncover exciting opportunities and make valuable connections.`}</p>
            </div>
          </ExpectationBoxes>
        </div>
      </div>
    </div>
  );
};

export default Expectations;
