import Image from 'next/image';
import image1 from 'public/assets/ads/image-1.png';
import image2 from 'public/assets/ads/image-2.png';
import image3 from 'public/assets/ads/image-3.png';
import image4 from 'public/assets/ads/image-4.png';
import image5 from 'public/assets/ads/image-5.png';
import image6 from 'public/assets/ads/image-6.png';
import image7 from 'public/assets/ads/image-7.png';
import image from 'public/assets/ads/image.png';
import React from 'react';

const categoryQuiz = [
  { name: 'US Stocks', image },
  { name: 'Indo Stocks', image: image1 },
  { name: 'Web3', image: image2 },
  { name: 'Mutual Funds', image: image3 },
  { name: 'Forex', image: image4 },
  { name: 'Bonds', image: image5 },
  { name: 'Finance', image: image6 },
  { name: 'Commodities (Gold / Oil)', image: image7 }
];
const ExploreQuiz = (): React.ReactElement => {
  return (
    <div className="flex flex-col gap-8 md:gap-10 items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-4">
        <p className="font-semibold text-base md:text-4xl text-center text-neutral-medium">
          Jelajahi & Mainkan Kategori Kuis Favoritmu!
        </p>
        <p className="font-normal text-neutral-soft text-xs md:text-base text-center">
          Uji pengetahuan investasimu, asah keterampilan, dan menangkan hadiah
          menarik. Pilih kategori favoritmu dan mulai petualangan sekarang!
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 lg:gap-x-16">
        {categoryQuiz.map((v, i) => (
          <div
            key={i}
            className="flex flex-col md:gap-2 justify-center items-center"
          >
            <Image src={v.image} alt={v.name} />
            <p className="font-semibold text-neutral-medium text-sm md:text-xl text-center">
              {v.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExploreQuiz;
