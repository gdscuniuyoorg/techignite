import Button from './buttons/Button';

export default function Hero() {
  return (
    <div className="container flex w-full flex-col items-center justify-center py-20 font-product-sans">
      <div className="flex w-full items-center justify-center px-0 py-5">
        <img src="/icons/hero.svg" alt="Tech Ignite Hero" width={429} height={180}></img>
      </div>
      <div className="pb-10">
        <p className="text-center text-[20px] leading-[28px] text-[#495057]">
          Join us this october for a one-day tech conference held in collaboration with
          GDG On Campus UNIUYO community, designed to spark{' '}
          <br className="hidden lg:block" />
          your interest in the ever-evolving world of tech.
        </p>
      </div>
      <div className="pb-5">
        <a
          href="https://lu.ma/event/evt-UkQmzgDlFU4DNoy"
          // className="luma-checkout--button"
          data-luma-action="checkout"
          data-luma-event-id="evt-UkQmzgDlFU4DNoy"
        >
          <Button className="!p-[10px_32px]">Register Now</Button>
        </a>
        {/* <a href="https://gdsc.community.dev/e/m5hskb/" target="_blank"></a> */}
      </div>
      <p>Registration is free</p>
      <img
        src="/icons/lightening.svg"
        alt="Tech Ignite Lightening"
        width={167.5}
        height={21.5}
      ></img>

      <div className="hidden px-5 pt-5 lg:block lg:px-0">
        <img
          src="/icons/venue.svg"
          alt="Tech Ignite Lightening"
          width={789}
          height={357.19}
        ></img>
      </div>

      <div className="block px-5 pt-5 lg:hidden lg:px-0">
        <img
          src="/icons/smallvenue.svg"
          alt="Tech Ignite Lightening"
          width={380}
          height={287}
        ></img>
      </div>
    </div>
  );
}
