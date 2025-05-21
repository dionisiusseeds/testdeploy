import Connect from '@/assets/event/connect.svg';
import Event from '@/assets/event/event.svg';
import MyEarningWallet from '@/assets/event/myearningwalletbg.svg';
import OpenTrading from '@/assets/event/openTradingAccount.svg';
import Referral from '@/assets/event/referral.svg';
import withAuth from '@/helpers/withAuth';
import { Typography } from '@material-tailwind/react';
import Image from 'next/image';
// import SeedsAcademy from '@/assets/event/seeds-academy-icon.svg';
import { useRouter } from 'next/router';

const features = [
  {
    images: Event,
    title: 'Events',
    event: '/homepage/event'
  },
  {
    images: OpenTrading,
    title: 'Open Account',
    event: '/play/open-account'
  },
  {
    images: Connect,
    title: 'Cicle',
    event: '/connect'
  },
  {
    images: Referral,
    title: 'Referral',
    event: 'my-profile/referralCode?referralHistory=true'
  },
  {
    images: MyEarningWallet,
    title: 'My Earning',
    event: '/my-profile/my-earnings'
  }
];

const FeatureSection: React.FC = (): React.ReactElement => {
  const router = useRouter();

  return (
    <div className="flex justify-between w-full gap-2 px-4 py-2">
      {features.map((feature, index: number) => (
        <div
          onClick={async () => {
            await router.push(feature.event);
          }}
          key={index}
          className="flex flex-col w-44 overflow-hidden md:w-60 h-fit justify-center items-center border-none border-[#E9E9E9] rounded-lg px-2 py-2 hover:shadow-lg duration-300 cursor-pointer gap-2 md:gap-0"
        >
          <Image
            src={feature.images}
            alt={feature.title}
            width={300}
            height={300}
            className="h-10 w-10"
          />
          <div className="flex w-full pt-0 md:pt-3 items-center justify-center text-center">
            <Typography className="font-poppins text-[#262626] text-xs md:text-base">
              {feature.title}
            </Typography>
          </div>
        </div>
      ))}
    </div>
  );
};

export default withAuth(FeatureSection);
