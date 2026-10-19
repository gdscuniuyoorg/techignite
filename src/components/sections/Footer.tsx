import { FaFacebook, FaLinkedin } from 'react-icons/fa6';
import { RiInstagramFill } from 'react-icons/ri';
import { BsTwitterX } from 'react-icons/bs';
import { MdMail } from 'react-icons/md';

export default function Footer() {
  return (
    <footer className="w-full bg-white py-10">
      <div className="container flex flex-col-reverse items-center justify-between gap-6 md:flex-row">
        <div className="hidden items-center lg:flex">
          <img
            src="/icons/logo.svg"
            alt="Tech Ignite Logo"
            width={55}
            height={34}
            className="mr-3"
          />
          <div className="h-[34px] rounded-full border border-[#DEE2E6] bg-black"></div>
          <img
            src="/icons/gdsc.svg"
            alt="Tech Ignite Logo"
            width={255.54}
            height={34}
            className="ml-3"
          />
        </div>
        <div className="flex items-center lg:hidden">
          <img
            src="/icons/logo.svg"
            alt="Tech Ignite Logo"
            width={55}
            height={34}
            className="mr-3"
          />
          <div className="h-[34px] rounded-full border border-[#DEE2E6] bg-black"></div>
          <img
            src="/icons/gdsc.svg"
            alt="Tech Ignite Logo"
            width={200.54}
            height={34}
            className="ml-3"
          />
        </div>

        <div className="flex items-center gap-6">
          <a href="https://web.facebook.com/gdscuniuyo">
            <FaFacebook className="h-6 w-6 cursor-pointer md:h-8 md:w-8" />
          </a>
          <a href="https://www.instagram.com/gdscuniuyo">
            <RiInstagramFill className="h-6 w-6 cursor-pointer md:h-8 md:w-8" />
          </a>
          <a href="https://www.twitter.com/gdscuniuyo">
            <BsTwitterX className="h-6 w-6 cursor-pointer md:h-8 md:w-8" />
          </a>
          <a href="https://gdsc.community.dev/university-of-uyo-uyo-nigeria/ ">
            <MdMail className="h-6 w-6 cursor-pointer md:h-8 md:w-8" />
          </a>

          <a href="https://www.linkedin.com/company/gdscuniuyo">
            <FaLinkedin className="h-6 w-6 cursor-pointer md:h-8 md:w-8" />
          </a>
        </div>
      </div>
    </footer>
  );
}
