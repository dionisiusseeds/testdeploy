import { Button } from '@material-tailwind/react';
import Image from 'next/image';
import adsPhone from 'public/assets/ads/ads-phone.png';
import ellipse from 'public/assets/ads/ellipse.svg';
import pattern from 'public/assets/ads/pattern.png';
import React from 'react';

const Header: React.FC<{
  scrollToSection: () => void;
}> = ({ scrollToSection }) => {
  return (
    <section>
      <div className="relative flex">
        <Image
          src={pattern}
          alt="pattern"
          className="absolute h-full brightness-[15]"
        />

        <div className="z-10 w-screen flex flex-col-reverse md:flex-row items-center justify-between bg-gradient-to-b from-[#5987CB]/90 to-[#66E3B6]/90">
          <Image
            src={ellipse}
            alt="ellipse"
            className="absolute top-0 left-0 w-2/3 hidden md:block"
          />
          <div className="z-20 font-poppins md:w-2/3 flex items-center md:items-start justify-center flex-col gap-6 lg:ps-20 lg:pe-0 px-4 pb-7">
            <p className="text-white font-semibold lg:text-4xl text-base">
              Tantang Dirimu &
            </p>
            <p className="font-bold lg:text-7xl text-4xl bg-gradient-to-r from-[#B798FF] from-0% via-[#E3D2E3] via-60% to-[#FFF7D2] to-70% text-transparent bg-clip-text text-center md:text-left">
              Raih Hadiah Fantastis
            </p>
            <div className="text-white text-sm lg:text-base text-center md:text-left">
              <p>Yakin punya keahlian jadi pro investasi?</p>
              <p> Uji pengetahuanmu dengan kuis seru dan penuh hadiah!</p>
              <p>
                Bersaing dengan yang lain, naik peringkat, dan menangkan hadiah
                jutaan rupiah!
              </p>
            </div>
            <Button
              className="w-fit bg-[#3AC4A0] rounded-full capitalize font-poppins"
              onClick={scrollToSection}
            >
              Play Now
            </Button>
          </div>
          <Image src={adsPhone} alt="ads-phone" className="md:w-1/3" />
        </div>
      </div>
    </section>
  );
};

export default Header;
