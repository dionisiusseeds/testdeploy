import Image from 'next/image';
import { newGroupIcon, newMessageIcon } from 'public/assets/chat';
import { useTranslation } from 'react-i18next';
import Modal from '../ui/modal/Modal';

interface props {
  onPersonalClick: () => void;
  onGroupClick: () => void;
  onClose: () => void;
}

const ModalNewChat: React.FC<props> = ({
  onPersonalClick,
  onGroupClick,
  onClose
}) => {
  const { t } = useTranslation();
  return (
    <Modal
      onClose={onClose}
      backdropClasses="z-40 fixed top-0 left-0 w-full h-screen bg-black/75 flex justify-start items-start"
      modalClasses="z-50 animate-slide-down fixed right-0 left-0 m-auto bottom-32 md:right-24 md:left-auto md:m-0 mt-[-12.35rem] w-[90%] md:w-fit h-fit p-4 rounded-3xl shadow-[0 2px 8px rgba(0, 0, 0, 0.25)] bg-white"
    >
      <div className="w-full flex flex-col justify-start items-start">
        <div
          onClick={onPersonalClick}
          className="w-full flex justify-start items-start rounded-t-lg gap-4 px-2 py-4 md:px-4 border-b-[1px] border-[#BDBDBD] pb-4 hover:bg-[#F2F2F2] duration-300 cursor-pointer"
        >
          <div className="flex justify-center items-center min-w-[45px] w-[50px] h-auto">
            <Image
              src={newMessageIcon}
              alt="newMessageIcon"
              width={1000}
              height={1000}
              className="w-full h-auto"
            />
          </div>
          <div className="text-black">
            <div className="font-semibold">{t('chat.newMessage')}</div>
            <div>{t('chat.newMessageDescription')}</div>
          </div>
        </div>
        <div
          onClick={onGroupClick}
          className="w-full flex justify-start items-start rounded-b-lg gap-4 px-2 py-4 md:px-4 hover:bg-[#F2F2F2] duration-300 cursor-pointer"
        >
          <div className="flex justify-center items-center min-w-[45px] w-[50px] h-auto">
            <Image
              src={newGroupIcon}
              alt="newGroupIcon"
              width={1000}
              height={1000}
              className="w-full h-auto"
            />
          </div>
          <div className="text-black">
            <div className="font-semibold">{t('chat.newGroup')}</div>
            <div>{t('chat.newGroupDescription')}</div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModalNewChat;
