'use client';

import CopyLink from '@/assets/play/tournament/copyTournamentLink.svg';
import { Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { XIcon } from 'public/assets/vector';
import { useTranslation } from 'react-i18next';
import QRCode from 'react-qr-code';
import { toast } from 'react-toastify';
import Modal from '../ui/modal/Modal';

interface Props {
  onClose: () => void;
  groupId: string;
}

const ModalShareGroup: React.FC<Props> = ({ onClose, groupId }) => {
  const { t } = useTranslation();
  const baseUrl =
    process.env.NEXT_PUBLIC_DOMAIN ?? 'https://user-dev-ali.seeds.finance';
  const handleCopyClick = async (): Promise<void> => {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const textToCopy = `${baseUrl}/chat/group/${groupId}`;
    await navigator.clipboard.writeText(textToCopy).then(() => {
      toast('Group link copied!');
    });
  };

  return (
    <Modal
      onClose={onClose}
      backdropClasses="z-40 fixed top-0 left-0 w-full h-screen bg-black/75 flex justify-start items-start"
      modalClasses="z-50 animate-slide-down fixed bottom-0 md:top-[50%] md:left-[20%] md:right-[-20%] xl:left-[35%] xl:right-[-35%] mt-[-11.35rem] w-full md:w-[375px] md:h-[325px] h-[445px] lg:rounded-2xl rounded-t-2xl shadow-[0 2px 8px rgba(0, 0, 0, 0.25)] bg-white p-5"
    >
      <div className="flex justify-between">
        <Typography className="font-bold text-lg text-black">
          {t('chat.shareGroup')}
        </Typography>
        <Image
          src={XIcon}
          alt="X"
          width={30}
          height={30}
          onClick={onClose}
          className="hover:scale-110 transition ease-out cursor-pointer"
        />
      </div>

      <div className="flex flex-col gap-3 justify-center px-4 lg:px-6 mt-3 items-center text-center">
        <div
          style={{ height: 'auto', margin: '0 auto' }}
          className="w-[80%] md:w-[50%]"
        >
          <QRCode
            style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            value={`${baseUrl}/chat/group/${groupId}`}
            viewBox={`0 0 256 256`}
          />
        </div>

        <Typography className="font-bold text-lg text-black">
          {t('quiz.shareLinks')}
        </Typography>

        <div className="w-full h-fit flex mb-4">
          <input
            id="search"
            type="text"
            name="search"
            placeholder=""
            readOnly={true}
            disabled={false}
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            value={`${baseUrl}/chat/group/${groupId}`}
            className="block w-full text-[#262626] h-11 leading-4 placeholder:text-[#BDBDBD] focus:outline-0 disabled:bg-[#E9E9E9] p-3 pl-4 rounded-xl border border-[#BDBDBD]"
          />
          <div
            onClick={handleCopyClick}
            className="w-[50px] cursor-pointer flex justify-center items-center"
          >
            <Image alt="" src={CopyLink} className="w-[20px]" />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModalShareGroup;
