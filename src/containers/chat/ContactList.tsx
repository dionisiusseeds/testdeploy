import ChatList from '@/components/chat/ChatList';
import type { Chat } from '@/utils/interfaces/chat.interface';
import { Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { filterSearch } from 'public/assets/chat';
import { SearchMember } from 'public/assets/circle';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface props {
  data: Chat[];
  userId: string;
  handleFilterUnreadChange: () => void;
  handleListClick: (status: boolean) => void;
  handleChangeTab: (value: 'PERSONAL' | 'COMMUNITY' | 'REQUEST') => void;
  activeTab: string;
  isLoading: boolean;
  chatRequest?: number;
}

const ContactList: React.FC<props> = ({
  data,
  userId,
  handleListClick,
  handleChangeTab,
  activeTab,
  handleFilterUnreadChange,
  chatRequest
}) => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<string>('');
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFilter(e.target.value);
  };
  const filteredChats = data.filter(chat =>
    chat.name.toLowerCase().includes(filter.toLowerCase())
  );
  return (
    <div className="flex flex-col">
      <div className="flex justify-start gap-2">
        <div className="flex justify-center flex-col absolute left-2 pt-2">
          <Image
            alt="Search"
            src={SearchMember}
            className="h-6 w-6 object-cover"
          />
        </div>
        <input
          type="text"
          value={filter}
          onChange={handleFormChange}
          className="h-10 pl-10 focus:outline-none placeholder:text-neutral-soft rounded-xl w-full border border-neutral-ultrasoft text-xs"
          placeholder="search"
        />
        <div
          onClick={handleFilterUnreadChange}
          className="flex items-center cursor-pointer"
        >
          <Image alt="Search" src={filterSearch} width={24} height={24} />
        </div>
      </div>
      <div className="flex justify-between items-center mt-4">
        <Typography className="font-poppins font-normal text-[#201B1C]">
          {activeTab === 'REQUEST'
            ? `${t('chat.chatRequest')} ${
                data?.length !== 0 ? `(${data?.length})` : ''
              }`
            : `${t('chat.allMessages')} ${
                data?.length !== 0 ? `(${data?.length})` : ''
              }`}
        </Typography>
        <div
          onClick={() => {
            handleChangeTab(activeTab === 'REQUEST' ? 'PERSONAL' : 'REQUEST');
          }}
          className="flex justify-center items-center cursor-pointer"
        >
          <Typography className="font-poppins font-normal text-seeds-button-green cursor-pointer hover:text-[#38aa8c] duration-300">
            {activeTab === 'REQUEST'
              ? `${t('chat.chat')}`
              : `${t('chat.request')}`}
          </Typography>
          {activeTab !== 'REQUEST' && chatRequest !== 0 && (
            <div className="rounded-full bg-[#FF6565] text-[#FFEBEB] w-[24px] h-[24px] flex justify-center items-center ml-2">
              {chatRequest}
            </div>
          )}
        </div>
      </div>
      <div
        className={`flex flex-col max-h-[40vh] p-4 overflow-x-hidden mt-4 w-full`}
      >
        {filteredChats?.map((el: Chat) => {
          return (
            <ChatList
              data={el}
              key={el.id}
              userId={userId}
              handleListClick={() => {
                handleListClick(el?.status_joined);
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ContactList;
