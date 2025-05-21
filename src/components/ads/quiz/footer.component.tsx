import { Button } from '@material-tailwind/react';
import Image from 'next/image';
import blink from 'public/assets/ads/blink.png';
import React from 'react';


const FooterQuiz :React.FC<{
  scrollToSection: () => void;
}> = ({ scrollToSection }) => {
  return (
    <section className="bg-[#eff6f9] flex flex-col md:flex-row gap-6 md:gap-9 items-center justify-between py-10 px-4 md:py-11 lg:ps-9 lg:pe-20">
      <Image src={blink} alt="blink" />
      <div className="flex flex-col gap-2 md:gap-6">
        <p className="font-semibold text-neutral-medium text-xl md:text-3xl lg:text-5xl text-center md:text-left">
          Berani Uji Pengetahuan Investasimu?
        </p>
        <p className="font-normal text-neutral-medium text-xs md:text-base lg:text-2xl text-center md:text-left">
          Main sekarang, taklukkan kuis, kalahkan rivalmu, dan raih hadiah
          jutaan rupiah! 🏆🔥
        </p>

        <Button
          className="mt-4 md:mt-0 capitalize rounded-full bg-[#3AC4A0] font-semibold font-poppins text-xl w-[237px] self-center md:self-start"
          onClick={scrollToSection}
        >
          Play Now
        </Button>
      </div>
    </section>
  );
}

export default FooterQuiz