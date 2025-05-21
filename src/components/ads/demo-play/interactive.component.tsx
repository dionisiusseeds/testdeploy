import Image from 'next/image';
import gift2 from 'public/assets/ads/gift2.svg';
import handclapping from 'public/assets/ads/handClapping.svg';
import phone2 from 'public/assets/ads/phone2.png';
import pinwheel from 'public/assets/ads/pinwheel.svg';
import React from 'react';
import { useTranslation } from 'react-i18next';

const Interactive = (): React.ReactElement => {
  const { t } = useTranslation();

  const data = [
    { img: handclapping, text: t('demo.text15') },
    { img: pinwheel, text: t('demo.text16') },
    { img: gift2, text: t('demo.text17') }
  ];
  return (
    <div className="flex flex-col md:flex-row justify-center items-center gap-5 py-5 px-4 lg:px-20 h-screen text-neutral-medium">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <p className="font-semibold text-base sm:text-lg md:text-2xl lg:text-3xl">
            {t('demo.text18')}
          </p>
          <p className="text-sm sm:text-base">{t('demo.text19')}</p>
        </div>
        <div className="flex flex-col gap-4">
          {data.map((v, i) => (
            <div className="flex gap-4 items-center" key={i}>
              <div className="rounded-xl bg-[#5263F9] p-2">
                <Image src={v.img} alt="image" />
              </div>
              <p className="text-sm sm:text-base">{v.text}</p>
            </div>
          ))}
        </div>
      </div>
      <Image
        src={phone2}
        alt="phone2"
        className="h-2/3 sm:h-fit sm:w-1/2 xl:w-2/3"
      />
    </div>
  );
};

export default Interactive;
