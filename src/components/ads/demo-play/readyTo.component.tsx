import { Button } from '@material-tailwind/react';
import Image from 'next/image';
import bottomPhone from 'public/assets/ads/bottomPhone.png';
import phone3 from 'public/assets/ads/phone3.png';
import React from 'react';
import { useTranslation } from 'react-i18next';

const ReadyTo = ({
  handleState
}: {
  handleState: () => void;
}): React.ReactElement => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col md:flex-row justify-between md:justify-center items-center gap-4 md:gap-10 p-4 lg:p-0 md:pb-0 lg:ps-28 h-screen text-white bg-[#5263F9]">
      <Image
        src={bottomPhone}
        alt="bottomPhone"
        className="md:hidden h-2/3 sm:h-fit sm:w-1/2"
      />
      <div className="flex flex-col gap-4 sm:gap-6">
        <p className="font-semibold text-base sm:text-lg md:text-2xl lg:text-4xl">
          {t('demo.text20')}
        </p>
        <p className="text-sm sm:text-base">
          {t('demo.text21')}{' '}
          <span className="font-semibold"> {t('demo.text22')}</span>{' '}
          {t('demo.text23')}
          <span className="font-semibold"> {t('demo.text24')}</span>{' '}
          {t('demo.text25')}
        </p>
        <Button
          onClick={handleState}
          className="w-fit bg-gradient-to-b rounded-full capitalize font-poppins font-semibold lg:text-xl text-base border-b-2 border-b-[#96F7C1] bg-[#3AC4A0] self-center md:self-auto"
        >
          Play Demo
        </Button>
      </div>
      <Image
        src={phone3}
        alt="phone3"
        className="self-end hidden lg:block w-1/2 xl:w-fit"
      />
      <Image
        src={bottomPhone}
        alt="bottomPhone"
        className="hidden md:block lg:hidden"
      />
    </div>
  );
};

export default ReadyTo;
