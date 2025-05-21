import Image from 'next/image';
import search from 'public/assets/ads/search.png';
import React from 'react';
import TagEvent from './tag.component';

const Academy = ():React.ReactElement => {
  return (
      <div className="flex flex-col justify-center items-center gap-4 lg:gap-6">
        <div className="flex flex-col justify-center items-center">
          <TagEvent text="Kolaborasi Hebat" />
          <div className="flex flex-col lg:flex-row justify-center items-center">
            <Image src={search} alt="search" className="lg:w-40 w-16" />
            <p className="font-semibold lg:text-4xl text-base text-neutral-medium text-center">
              Seeds Academy Web3 Innovators Program
            </p>
          </div>
        </div>
        <p className="font-semibold text-sm lg:text-2xl text-neutral-medium">
          Kenapa Harus Seeds Academy ??
        </p>
        <p className="text-sm lg:text-base text-neutral-soft text-left md:text-center">
          <span className="font-semibold text-[#3AC4A0]">
            Seeds Academy adalah
          </span>{' '}
          Platform edukasi digital Web3 yang mencetak talenta siap pakai global
          yang akan berkolaborasi dengan{' '}
          <span className="font-semibold text-[#3AC4A0]">
            mentor & lembaga Web3 yang expert di bidang nya
          </span>{' '}
          kelas dunia yang telah mencetak banyak praktisi blockchain unggul.
        </p>
      </div>
  );
}

export default Academy