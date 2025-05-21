import PageGradient from '@/components/ui/page-gradient/PageGradient';
import withAuth from '@/helpers/withAuth';
import { searchUser } from '@/repository/people.repository';
import { type SearchUserChat } from '@/utils/interfaces/chat.interface';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Avatar, Button, Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ArrowBackwardIconWhite } from 'public/assets/vector';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const CreateMessage: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useState<{
    search: string;
    page: number;
    limit: number;
    sortBy: string;
  }>({
    search: ' ',
    page: 1,
    limit: 10,
    sortBy: ''
  });
  const [userList, setUserList] = useState<SearchUserChat[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');

  const fetchSearchUser = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await searchUser(searchParams);
      setUserList(response.result);
    } catch (error) {
      toast.error(`Error fetching data following: ${error as string}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchSearchUser();
  }, [searchParams.search]);

  const handleTypeUser = (searchName: string): void => {
    setSearchParams({
      ...searchParams,
      page: 1,
      limit: 10,
      search: searchName !== '' ? searchName : ' '
    });
  };

  return (
    <PageGradient defaultGradient className="w-full">
      <div className={`w-full bg-white`}>
        <div
          style={{ backgroundImage: "url('/assets/chat/bg-chat.svg')" }}
          className="w-full bg-cover rounded-t-xl lg:h-[150px] h-[130px] flex items-center"
        >
          <div className="w-full flex justify-between items-center mx-[18px]">
            <Image
              src={ArrowBackwardIconWhite}
              alt="icon"
              width={24}
              height={24}
              className="text-white cursor-pointer hover:scale-110 duration-150"
              onClick={() => {
                router.back();
              }}
            />
            <Typography className="flex-1 text-center font-poppins font-semibold text-lg text-white">
              {t('chat.newChat')}
            </Typography>
          </div>
        </div>
        <div className="bg-white w-full lg:h-[660px] h-[490px] mt-[-20px] rounded-t-3xl mb-5">
          <div className="py-5 px-6">
            <div className="relative w-full">
              <input
                onChange={e => {
                  handleTypeUser(e.target.value);
                }}
                id="search"
                type="text"
                name="search"
                placeholder={t('chat.search') ?? ''}
                className="block w-full text-[#262626] text-sm h-10 placeholder:text-[#BDBDBD] focus:outline-0 disabled:bg-[#E9E9E9] p-2 pl-4 rounded-xl border border-[#BDBDBD]"
              />
              <MagnifyingGlassIcon className="absolute right-6 top-1/2 transform -translate-y-1/2 w-5 h-5" />
            </div>
          </div>
          {isLoading ? (
            <div className="flex items-center justify-center my-4">
              <div className="animate-spinner w-14 h-14 border-8 border-gray-200 border-t-seeds-button-green rounded-full" />
            </div>
          ) : (
            <div className="md:h-[475px] h-[360px] overflow-y-auto">
              {userList?.length > 0 &&
                userList?.map(user => (
                  <div
                    key={user?.id}
                    onClick={() => {
                      setSelectedUser(user?.id);
                    }}
                    className={`${
                      selectedUser === user?.id
                        ? 'border-2 border-seeds-green'
                        : 'border-b border-b-[#E9E9E9]'
                    } flex justify-between items-center mx-[22px] py-4 px-2 hover:bg-[#efefef] cursor-pointer rounded-lg`}
                  >
                    <div className="flex flex-row items-center gap-[6px]">
                      <Avatar src={user?.avatar} width={32} height={32} />
                      <div className="flex flex-col gap-2">
                        <Typography className="font-semibold font-poppins text-black text-sm">
                          {user?.name}
                        </Typography>
                        <Typography className="font-normal font-poppins text-black text-xs">
                          {user?.seedsTag !== undefined &&
                          user?.seedsTag.length > 15
                            ? `@${user.seedsTag.slice(0, 15)}...`
                            : `@${user.seedsTag}`}
                        </Typography>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
          <div className="flex justify-center py-2 bottom-0">
            <Button
              disabled={selectedUser === ''}
              onClick={async () => {
                await router.push(
                  `/chat?roomId=${selectedUser}&newPersonalChat=true`
                );
              }}
              className="font-semibold font-poppins text-sm bg-seeds-button-green text-white md:w-[340px] w-full mx-2 rounded-full"
            >
              {t('chat.next')}
            </Button>
          </div>
        </div>
      </div>
    </PageGradient>
  );
};

export default withAuth(CreateMessage);
