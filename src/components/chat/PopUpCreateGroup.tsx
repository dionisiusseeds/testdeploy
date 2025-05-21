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

const CreateGroupPopUp: React.FC<Props> = ({ onClose, onClick }) => {
  const { t } = useTranslation();

  return (
    <Modal
      backdropClasses="z-40 fixed top-0 left-0 w-full h-screen bg-black/75 flex justify-start items-start"
      modalClasses="z-50 animate-slide-down fixed bottom-0 md:top-[45%] md:left-[35%] md:right-[-35%] mt-[-12.35rem] w-full md:w-[30%] h-[435px] p-4 lg:rounded-2xl rounded-t-2xl shadow-[0 2px 8px rgba(0, 0, 0, 0.25)] bg-white"
    >
      <div className="flex flex-col justify-center items-center py-3 gap-6">
        <Image
          src={ConfirmSeedy}
          alt="ConfirmSeedy"
          width={200}
          height={200}
          className="w-[200px] h-[200px]"
        />
        <div className="flex flex-col gap-2 items-center">
          <Typography className="font-poppins font-semibold text-base">
            {t('chat.createGroupPopUpText1')}
          </Typography>
          <Typography className="font-poppins font-normal text-sm text-[#7C7C7C]">
            {t('chat.createGroupPopUpText2')}
          </Typography>
        </div>
        <div className="flex flex-col gap-2 w-full">
          <Button
            onClick={onClick}
            className="bg-seeds-button-green font-poppins font-semibold text-sm rounded-full shadow-md"
          >
            {t('chat.btnYes')}
          </Button>
          <Button
            onClick={onClose}
            className="bg-white text-seeds-green font-poppins font-semibold text-sm rounded-full shadow-md"
          >
            {t('chat.btnNo')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CreateGroupPopUp;
