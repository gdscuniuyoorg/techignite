import React from "react";
import Image from "next/image";

const Hackathon = () => {
  return (
    <div className="py-10">
      <div className=" w-full h-[400px] bg-[#FBBC04] rounded-[32px]">
        <div className=" bg-black/90 bg-heroPattern w-[90%] h-[400px] m-auto rounded-[24px] text-white flex flex-col gap-4 lg:flex-row justify-center items-center lg:justify-between px-10 lg:px-20">
          <div className="text-justify font-inter lg:w-[376px] w-full">
            <h2 className="font-bold text-2xl">Hackathon</h2>
            <p className="lg:pt-8 pt-3 text-[16px]">
              {`Whether you’re a coding pro or simply passionate about creating something amazing, this is your chance to shine and win big! Sign up for our hackathon and join us in developing innovative projects  that advance education. `}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <p className="underline underline-offset-4">
              <a href="https://forms.gle/CJgRwNRQu8binh2B7" target="_blank">
                Register Here
              </a>
            </p>
            <Image
              src="icons/arrow.svg"
              alt="arrow"
              width={24}
              height={24}
            ></Image>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hackathon;
