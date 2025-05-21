import Academy from '@/components/ads/event-s2/academy.component';
import Alumni from '@/components/ads/event-s2/alumni.component';
import Learn from '@/components/ads/event-s2/learn.component';
import PHK from '@/components/ads/event-s2/phk.component';
import Schedule from '@/components/ads/event-s2/schedule.component';
import Time from '@/components/ads/event-s2/time.component';
import Why from '@/components/ads/event-s2/why.component';
import Image from 'next/image';
import Link from 'next/link';
import banner from 'public/assets/ads/banner-aa.png';
import React from 'react';

const EventS2 = (): React.ReactElement => {
  return (
    <div className="flex flex-col font-poppins justify-center items-center">
      <div className="relative">
        <Image src={banner} alt="banner" className="w-screen" />
        <Link
          href="http://bit.ly/RSPVSEEDSACADEMY"
          target="_blank"
          className="w-[27%] h-[14.5%] absolute bottom-[7%] left-[7%] rounded-md sm:rounded-lg md:rounded-xl lg:rounded-2xl xl:rounded-3xl"
        />
      </div>
      {/* <Header /> */}
      <PHK />
      <div className="flex flex-col gap-6 justify-center items-center px-4 md:px-20 md:py-16 py-6">
        <Academy />
        <Why />
        <Learn />
      </div>
      <Schedule />
      <Alumni />
      <Time />
    </div>
  );
};

export default EventS2