const Hackathon = () => {
  return (
    <div className="py-10">
      <div className="h-[400px] w-full rounded-[32px] bg-[#FBBC04]">
        <div className="m-auto flex h-[400px] w-[90%] flex-col items-center justify-center gap-4 rounded-[24px] bg-black/90 bg-[url('/icons/wavy.svg')] px-10 text-white lg:flex-row lg:justify-between lg:px-20">
          <div className="font-inter w-full text-justify lg:w-[376px]">
            <h2 className="text-2xl font-bold">Hackathon</h2>
            <p className="pt-3 text-[16px] lg:pt-8">
              {`Whether you’re a coding pro or simply passionate about creating something amazing, this is your chance to shine and win big! Sign up for our hackathon and join us in developing innovative projects  that advance education. `}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <p className="underline underline-offset-4">
              <a
                href="https://forms.gle/CJgRwNRQu8binh2B7"
                target="_blank"
                rel="noopener noreferrer"
              >
                Register Here
              </a>
            </p>
            <img src="/icons/arrow.svg" alt="arrow" width={24} height={24}></img>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hackathon;
