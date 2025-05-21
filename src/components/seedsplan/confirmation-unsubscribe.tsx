import { Button, Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { XIcon } from 'public/assets/vector';
import React from 'react';
import { useTranslation } from 'react-i18next';
import SeedyAlert from '../../assets/seedsplan/seedy-alert.svg';
import Modal from '../ui/modal/Modal';

interface TncProps {
  onClose: () => void;
  handleStopSubscription: () => void;
}

const ConfirmationUnsubscribe: React.FC<TncProps> = ({
  onClose,
  handleStopSubscription
}) => {
  const { t } = useTranslation();
  return (
    <Modal
      backdropClasses="z-40 fixed top-0 left-0 w-full h-screen bg-black/75 flex justify-start items-start"
      modalClasses="z-50 animate-slide-down fixed bottom-0 md:top-[50%] md:left-[35%] md:right-[-35%] mt-[-14.35rem] w-full md:w-[376px] h-[390px] lg:rounded-2xl rounded-t-2xl shadow-[0 2px 8px rgba(0, 0, 0, 0.25)] bg-white"
    >
      <div className="flex flex-col items-center gap-5 p-6 relative">
        <Image
          className="cursor-pointer hover:scale-105 absolute right-6"
          onClick={onClose}
          src={XIcon}
          alt="X-Icon"
          width={20}
          height={20}
        />
        <Image src={SeedyAlert} alt={'Seedy-Alert'} width={160} height={181} />
        <div className="flex flex-col items-center text-center">
          <Typography className="font-poppins font-semibold text-base text-[#262626]">
            {`${t('seedsPlan.button9')}?`}
          </Typography>
          <Typography className="font-poppins font-normal text-sm text-[#262626]">
            {t('seedsPlan.stopPlanDesc')}
          </Typography>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={onClose}
            className="md:w-[165px] w-full h-[42px] rounded-full bg-[#DD2525] text-white font-poppins font-semibold text-sm"
          >
            {t('seedsPlan.no')}
          </Button>
          <Button
            onClick={handleStopSubscription}
            className="md:w-[165px] w-full h-[42px] rounded-full bg-[#3AC4A0] text-white font-poppins font-semibold text-sm"
          >
            {t('seedsPlan.yes')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationUnsubscribe;
