import { Button } from '@material-tailwind/react';
import Image from 'next/image';
import Link from 'next/link';
import blink from 'public/assets/ads/blink.png';
import React from 'react';
import CountdownTimer from './countdown.component';

const Time = (): React.ReactElement => {
  return (
    <div className="w-full flex flex-col md:flex-row justify-evenly items-center px-4 py-10 lg:px-20 lg:py-11 bg-gradient-to-b from-[#67E3B6] to-[#19AEAE]">
      <Image src={blink} alt="blink" />
      <div className="flex flex-col gap-10 justify-center items-center">
        <div className="flex flex-col gap-4 text-center">
          <p className="font-semibold text-2xl lg:text-3xl xl:text-5xl text-white">
            Siap Wujudkan karier impian kamu di industri Web3?
          </p>
          <p className="text-sm lg:text-base xl:text-2xl text-white">
            Daftarkan dirimu sekarang juga!
          </p>
        </div>
        <CountdownTimer targetDate={new Date('2025-05-24').toISOString()} />
        <Link href="http://bit.ly/RSPVSEEDSACADEMY" target="_blank">
          <Button className="w-fit bg-gradient-to-b rounded-full capitalize font-poppins font-semibold lg:text-xl text-base border-b-2 border-b-[#96F7C1]">
            Daftar Sekarang
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Time;
