import Image from 'next/image';
import bigTree from 'public/assets/ads/big-tree.png';
import seeds from 'public/assets/ads/seeds.png';
import sprout from 'public/assets/ads/sprout.png';
import tree from 'public/assets/ads/tree.png';
import React from 'react';

const grow = [
  {
    title: 'Seru & Edukatif',
    sub: 'Pelajari investasi dengan cara yang menyenangkan.',
    image: seeds
  },
  {
    title: 'Beragam Kategori',
    sub: 'Pilih topik investasi yang paling kamu minati',
    image: sprout
  },
  {
    title: 'Hadiah Menarik',
    sub: 'Semakin sering bermain, semakin besar peluang menang!',
    image: tree
  },
  {
    title: 'Tantang Temanmu',
    sub: 'Bersaing dan buktikan siapa ahli investasi sesungguhnya',
    image: bigTree
  }
];

const WhyPlay = (): React.ReactElement => {
  return (
    <div className="flex justify-center">
      <div className="py-4 flex flex-col gap-8 items-center w-2/3 sm:w-full">
        <p className="font-semibold text-base md:text-4xl text-center text-neutral-medium">
          Kenapa Harus Main?
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {grow.map((v, i) => (
            <div key={i} className="flex flex-col items-center gap-4">
              <Image src={v.image} alt={v.title} />
              <div className="flex flex-col items-center gap-2 lg:gap-4">
                <p className="font-semibold text-sm text-neutral-medium lg:text-lg">
                  {v.title}
                </p>
                <p className="font-normal text-neutral-soft text-xs lg:text-base text-center">
                  {v.sub}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhyPlay;
