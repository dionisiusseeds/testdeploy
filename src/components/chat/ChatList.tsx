import { type Chat } from '@/utils/interfaces/chat.interface';
import { Avatar, Typography } from '@material-tailwind/react';
import moment from 'moment';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { readChatIcon } from 'public/assets/chat';
import DefaultAvatar from '../../../public/assets/chat/default-avatar.svg';

interface props {
  data: Chat;
  userId: string;
  handleListClick: () => void;
}

const ChatList: React.FC<props> = ({ data, userId, handleListClick }) => {
  const router = useRouter();
  const { roomId } = router.query;
  return (
    <div
      key={data?.id}
      className={`flex w-full justify-start gap-2 py-2 px-2 border-b border-solid border-[#E9E9E9] cursor-pointer ${
        roomId !== undefined && roomId === data?.id
          ? 'bg-[#DCFCE4BF] rounded-xl'
          : 'bg-white hover:bg-[#f7f7f7] duration-300 rounded-sm'
      }`}
      onClick={() => {
        handleListClick();
        void router.replace(`/chat?roomId=${data?.id}`);
      }}
    >
      <div className="flex items-center shrink-0">
        <Avatar
          src={data?.avatar === '' ? DefaultAvatar.src : data?.avatar}
          alt="avatar"
          width={32}
          height={32}
          className="rounded-full w-8 h-8"
        />
      </div>
      <div className="flex flex-col w-full">
        <div className="flex justify-between">
          <Typography className="font-semibold text-sm text-black font-poppins max-w-[60%] shrink text-ellipsis overflow-hidden whitespace-nowrap">
            {data?.name.slice(0, 20)}
          </Typography>
          <Typography className="font-normal text-xs text-[#27A590] font-poppins">
            {moment(data?.created_at).isSame(moment(), 'day')
              ? moment(data?.created_at).format('HH:mm')
              : moment(data?.created_at).format('L')}
          </Typography>
        </div>
        <div className="w-full flex justify-between">
          <Typography className="font-normal text-sm text-[#7C7C7C] font-poppins max-w-[70%] max-h-[20px] text-ellipsis overflow-hidden">
            {(data?.content_text ?? '') !== ''
              ? data?.content_text.slice(0, 30)
              : ''}
          </Typography>
          <div className="flex gap-2">
            {data.total_unread > 0 && (
              <div className="rounded-full bg-[#FF6565] w-[24px] h-[24px] flex justify-center items-center">
                <Typography className="font-normal text-[10px] text-[#FFEBEB] font-poppins">
                  {data?.total_unread}
                </Typography>
              </div>
            )}
            {data?.read_at !== '0001-01-01T00:00:00Z' &&
              data?.last_sender_id === userId && (
                <div className="flex justify-center items-center w-[20px] h-auto">
                  <Image
                    src={readChatIcon}
                    alt="readChatIcon"
                    width={1000}
                    height={1000}
                    className="w-full h-auto"
                  />
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatList;
