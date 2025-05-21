import { Button } from '@material-tailwind/react';
import Image from 'next/image';
import ellipse from 'public/assets/ads/ellipse.svg';
import event from 'public/assets/ads/event.png';
import pattern from 'public/assets/ads/pattern.png';
import React from 'react';

const Header: React.FC = () => {
  return (
    <section>
      <div className="relative flex">
        <Image
          src={pattern}
          alt="pattern"
          className="absolute h-full brightness-[15]"
        />
        <div className="z-10 w-screen flex flex-col-reverse md:flex-row items-center justify-between bg-gradient-to-b from-[#67E3B6]/90 to-[#19AEAE]/90 px-3 py-10 lg:px-10 xl:p-20 gap-7">
          <Image
            src={ellipse}
            alt="ellipse"
            className="absolute top-0 left-0 w-2/3 hidden md:block"
          />
          <div className="z-20 font-poppins md:w-1/2 flex items-center md:items-start justify-center flex-col gap-6">
            <p className="text-white lg:font-bold font-semibold lg:text-4xl text-2xl">
              Dari Pemula Jadi Pro: Investasi Jadi Lebih Mudah & Seru!
            </p>
            <div className="text-white text-sm lg:text-base flex-col flex gap-4 lg:gap-6">
              <p>
                Dengan materi lengkap, trading virtual, dan komunitas suportif,
                kamu bisa kuasai dunia investasi dengan cara yang menyenangkan &
                tanpa risiko.
              </p>
              <p>Yuk, mulai perjalanan investasimu sekarang!</p>
            </div>
            <Button className="w-fit bg-gradient-to-b rounded-full capitalize font-poppins font-semibold lg:text-xl text-base border-b-2 border-b-[#96F7C1]">
              Daftar Sekarang
            </Button>
          </div>
          <Image src={event} alt="ads-phone" className="md:w-1/2" />
        </div>
      </div>
    </section>
  );
};

export default Header;
