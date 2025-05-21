import { Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { XIcon } from 'public/assets/vector';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from '../ui/modal/Modal';
import WebcamVideo from '../webcam/WebcamVideo';

interface Props {
  onClose: () => void;
  onCapture: (video: File, text?: string) => void;
  isInputMessage?: boolean;
}

const ModalRecordVideo: React.FC<Props> = ({
  onClose,
  onCapture,
  isInputMessage
}) => {
  const { t } = useTranslation();
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);

  useEffect(() => {
    const updateIsMobile = (): void => {
      setIsMobile(window.innerWidth <= 768);
    };

    updateIsMobile();

    window.addEventListener('resize', updateIsMobile);

    return () => {
      window.removeEventListener('resize', updateIsMobile);
    };
  }, []);

  const handleWebcamCapture = (video: File, text?: string): void => {
    onCapture(video, text);
    onClose();
  };

  return (
    <Modal
      backdropClasses="z-40 fixed top-0 left-0 w-full h-screen bg-black/75 flex justify-center items-center"
      modalClasses={`z-50 fixed bottom-0 md:top-[10%] md:left-[18%] lg:rounded-2xl shadow-lg bg-white ${
        isMobile ? 'overflow-y-auto w-full h-full' : 'w-[940px] h-[500px]'
      }`}
    >
      {!isSending && (
        <div className="flex items-center gap-3 p-4 border-b border-gray-200">
          <Image
            className="cursor-pointer hover:scale-110 duration-150"
            src={XIcon}
            alt="close"
            onClick={onClose}
            width={24}
            height={24}
          />
          <Typography className="font-poppins font-semibold text-lg">
            {t('chat.modalRecordVideoTitle')}
          </Typography>
        </div>
      )}
      <WebcamVideo
        onCapture={handleWebcamCapture}
        type={isMobile}
        isInputMessage={isInputMessage}
        setIsSending={setIsSending}
        isSending={isSending}
      />
    </Modal>
  );
};

export default ModalRecordVideo;
