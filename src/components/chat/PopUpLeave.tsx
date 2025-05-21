'use client';
import { Button, Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import ConfirmSeedy from '../../../public/assets/chat/confirm-seedy.svg';
import Modal from '../ui/modal/Modal';

interface Props {
  onClose: () => void;
  onClick: () => Promise<void>;
}

const LeaveCommunityPopUp: React.FC<Props> = ({ onClose, onClick }) => {
  const { t } = useTranslation();

  return (
    <Modal
      onClose={onClose}
      backdropClasses="z-40 fixed top-0 left-0 w-full h-screen bg-black/75 flex justify-start items-start"
      modalClasses="z-50 animate-slide-down fixed bottom-0 md:top-[50%] md:left-[20%] md:right-[-20%] xl:left-[35%] xl:right-[-35%] mt-[-14.35rem] w-full md:w-[375px] h-[440px] lg:rounded-2xl rounded-t-2xl shadow-[0 2px 8px rgba(0, 0, 0, 0.25)] bg-white"
    >
      <div className="flex flex-col items-center py-6 px-4 gap-6">
        <Image src={ConfirmSeedy} width={200} height={200} alt="SeedyAsk" />
        <div className="flex flex-col items-center gap-2">
          <Typography className="font-poppins font-semibold text-base">
            {t('chat.popUpLeave.Title')}
          </Typography>
          <Typography className="text-[#7C7C7C] font-poppins text-sm font-normal">
            {t('chat.popUpLeave.Description')}
          </Typography>
        </div>
        <div className="flex flex-col gap-2 w-full">
          <Button
            onClick={onClick}
            className="bg-seeds-button-green font-poppins font-semibold text-sm rounded-full"
          >
            {t('chat.btnYes')}
          </Button>
          <Button
            onClick={onClose}
            className="bg-white text-seeds-green font-poppins font-semibold text-sm rounded-full"
          >
            {t('chat.btnNo')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default LeaveCommunityPopUp;
