import { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import Button from './buttons/Button';

const Navbar = ({ isTicketSubdomain }: { isTicketSubdomain?: boolean }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="sticky top-0 z-30 w-full bg-white">
      <div className="container flex w-full items-center justify-between bg-white py-5">
        <div className="flex items-center">
          <a href="https://www.techignite.live/">
            <img
              src="/icons/logo.svg"
              alt="Tech Ignite Logo"
              width={55}
              height={34}
              className="mr-3"
            />
          </a>
          <div className="h-[34px] rounded-full border border-[#DEE2E6] bg-black"></div>
          <img
            src="/icons/gdsc.svg"
            alt="Tech Ignite Logo"
            width={200.54}
            height={34}
            className="ml-3"
          />
        </div>

        <button
          type="button"
          className="z-40 md:hidden"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={toggleMenu}
        >
          {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>

        <div
          id="primary-navigation"
          className={`${
            menuOpen ? 'flex' : 'hidden'
          } fixed top-0 left-0 h-full w-full flex-col gap-10 bg-white p-10 text-[#344363] md:relative md:flex md:h-auto md:w-auto md:flex-row md:items-center md:p-0`}
        >
          {!isTicketSubdomain && (
            <a href="#About" onClick={toggleMenu}>
              About Tech Ignite
            </a>
          )}
          {/* {!isTicketSubdomain && (
            <a href="#Schedule" onClick={toggleMenu}>
              Schedule
            </a>
          )} */}
          {!isTicketSubdomain && (
            <a href="#Speakers" onClick={toggleMenu}>
              Speakers
            </a>
          )}
          {!isTicketSubdomain && (
            <a href="#Sponsors" onClick={toggleMenu}>
              Sponsors
            </a>
          )}
          {/* {!isTicketSubdomain && (
            <a href="#Faqs" onClick={toggleMenu}>
              FAQs
            </a>
          )} */}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://gdsc.community.dev/university-of-uyo-uyo-nigeria/"
            onClick={toggleMenu}
          >
            Contact
          </a>

          <a
            href="https://lu.ma/event/evt-UkQmzgDlFU4DNoy"
            // className="luma-checkout--button"
            data-luma-action="checkout"
            data-luma-event-id="evt-UkQmzgDlFU4DNoy"
          >
            <Button onClick={toggleMenu}>Register Now</Button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
