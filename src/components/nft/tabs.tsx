import { type Data } from '@/repository/nft.repository';
import { useAppSelector } from '@/store/redux/store';
import { Button, Card } from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FiPlus } from 'react-icons/fi';
import { toast } from 'react-toastify';

const NFTTabs = ({ data }: { data: Data[] | undefined }): JSX.Element => {
  const { dataUser } = useAppSelector(state => state.user);

  const router = useRouter();
  return (
    <div>
      <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
        {data !== undefined && data !== null ? (
          data?.map((val, i) => (
            <Card className="h-[280px] bg-[#F3F4F8]" key={i}>
              <img
                src={val.image_url}
                alt={val.name}
                className="h-2/3 md:h-1/2 w-full object-cover rounded-t-xl"
              />
              <div className="h-1/3 md:h-1/2 flex flex-col gap-2 md:gap-3.5 justify-between p-2 md:p-3.5 bg-transparent font-semibold text-xs font-poppins rounded-b-xl">
                <div className="flex flex-col">
                  <p className="text-[#262626]">{val.name}</p>
                  <div className="flex gap-1">
                    <Image
                      src={val.owner.avatar}
                      alt={val.owner.name}
                      width={16}
                      height={16}
                      className="rounded-full"
                    />
                    <p className="text-[#3AC4A0]">{val.owner.name}</p>
                  </div>
                  <p className="text-[10px] leading-4 font-light text-[#262626]">
                    {val.price} DIAM
                  </p>
                </div>
                <Button
                  onClick={async () => {
                    if (sessionStorage.getItem('diamPublicKey') !== null) {
                      await router.push(`/nft/${val.id}`);
                    } else {
                      toast.info('Please connect the wallet first!');
                    }
                  }}
                  className={`p-1 md:p-1.5 text-[10px] leading-4 font-light text-white
                      bg-[#3AC4A0] rounded-full w-full`}
                >
                  {val.owner.id === dataUser.id ? 'DETAIL' : 'GET'}
                </Button>
              </div>
            </Card>
          ))
        ) : (
          <></>
        )}
      </div>
      <div
        className={`flex justify-center items-center gap-2 fixed bottom-10 right-10 md:right-16 z-10 normal-case font-poppins font-semibold text-lg rounded-full bg-[#3AC4A0] md:px-8 p-5 md:py-3.5 text-white cursor-pointer active:scale-95 transition-all`}
        onClick={async () => {
          if (sessionStorage.getItem('diamPublicKey') !== null) {
            await router.push('/nft/create');
          } else {
            toast.info('Please connect the wallet first!');
          }
        }}
      >
        <FiPlus className="w-5 md:w-8 h-5 md:h-8" />
        <p className="hidden md:block">Upload NFT</p>
      </div>
    </div>
  );
};

export default NFTTabs;
