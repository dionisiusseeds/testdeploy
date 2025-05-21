import { standartCurrency } from '@/helpers/currency';
import { isGuest } from '@/helpers/guest';
import { getPlaySimulationDetail } from '@/repository/play.repository';
import { getUserInfo } from '@/repository/profile.repository';
import { getTransactionSummary } from '@/repository/seedscoin.repository';
import { type UserInfo } from '@/utils/interfaces/earning.interfaces';
import {
  Button,
  Card,
  CardBody,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Typography
} from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoIosInformation } from 'react-icons/io';
import { toast } from 'react-toastify';
import goldHome from '../../public/assets/images/goldHome.svg';
import userInfoBackGround from '../assets/userInfoBackground.svg';

interface UserDetails {
  play_id: string;
  user_detail: {
    asset: number;
    portofolio: number;
    return: number;
  };
  prize: number[];
}

interface SeedsCoin {
  total_available_coins: number;
  total_closest_expiring_coins: number;
  closest_expiration_date: number;
}

interface userInfo {
  preferredCurrency: string;
  seedsTag: string;
  id: string;
}

interface props {
  playerInfo: userInfo;
}
const UserInfoPlaySimulation: React.FC<props> = ({ playerInfo }) => {
  const router = useRouter();
  const { t } = useTranslation();
  const [playDetail, setPlayDetail] = useState<UserDetails>({
    play_id: '08e1bdf9-d618-408b-8a2e-9fe98f66de8e',
    user_detail: {
      portofolio: 0,
      asset: 0,
      return: 0
    },
    prize: [150000, 100000, 50000]
  });
  const [seedsCoins, setSeedsCoins] = useState<SeedsCoin>();
  const [userInfo, setUserInfo] = useState<UserInfo>();

  const fetchPlayerDetail = async (currency: string): Promise<any> => {
    try {
      const fetchDetailRes = await getPlaySimulationDetail(currency);
      setPlayDetail(fetchDetailRes.data);
    } catch (error) {
      toast.error(`fetch player detail error : ${error as string}`);
    }
  };

  useEffect(() => {
    if (!isGuest()) {
      if (playerInfo !== undefined) {
        void fetchPlayerDetail(playerInfo.preferredCurrency);
      }
    }
  }, []);

  useEffect(() => {
    const fetchUserInfo = async (): Promise<void> => {
      try {
        const userRes = await getUserInfo();
        setUserInfo(userRes);
      } catch (error) {
        toast.error(`fetching user error : ${error as string}`);
      }
    };
    fetchUserInfo()
      .then()
      .catch(() => {});
  }, []);

  useEffect(() => {
    const fetchSeedsCoins = async (): Promise<any> => {
      try {
        const seedsCoinsResp = await getTransactionSummary();
        setSeedsCoins(seedsCoinsResp.data);
      } catch (error) {
        toast.error(`fetching data error : ${error as string}`);
      }
    };

    fetchSeedsCoins()
      .then()
      .catch(() => {});
  }, []);

  return (
    <div className="flex flex-col w-full h-64 relative justify-around">
      <Image
        src={userInfoBackGround}
        alt={userInfoBackGround}
        width={300}
        height={300}
        className="w-full h-full object-cover"
      />
      {isGuest() || (
        <div className="flex flex-col gap-3 px-2 py-3 absolute bottom-0 w-full">
          <Typography className="capitalize text-[#FFFFFF] text-3xl font-semibold">
            {`Hi, ${userInfo?.name as string}!✌`}
          </Typography>
          <Typography className="capitalize text-[#FFFFFF] text-base font-normal">
            {t('homepage.section2.text18')}
          </Typography>
          <Card className="flex h-fit py-2 px-2 bg-[#fffcfc] rounded-[10px]">
            <CardBody className="p-0 m-0 flex flex-col justify-evenly">
              <div className="flex w-full gap-4">
                <div className="flex flex-col w-1/2 gap-0">
                  <div className="flex flex-row w-full gap-1 items-center">
                    <Typography className="text-xs font-poppins text-[#7C7C7C] capitalize">
                      {t('homepage.section2.text1')}
                    </Typography>
                    <div className="flex rounded-[75px] w-4 text-center border items-center justify-center">
                      <Menu placement="bottom-start">
                        <MenuHandler>
                          <div className="w-6 h-4 border-none rounded-[75px] items-center justify-center hover:cursor-pointer">
                            <IoIosInformation />
                          </div>
                        </MenuHandler>
                        <MenuList>
                          <MenuItem className="flex flex-wrap w-44 h-20">
                            <Typography className="font-normal text-xs font-poppins text-[#262626]">
                              {t('homepage.section2.text17')}
                            </Typography>
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </div>
                  </div>
                  <Typography className="text-[#392594] font-semibold md:text-base text-[14px]">
                    {standartCurrency(playDetail?.user_detail.asset).replace(
                      'Rp',
                      ''
                    )}{' '}
                    {userInfo?.preferredCurrency ?? 'IDR'}
                  </Typography>
                </div>
                <div className="flex w-0 h-10 border-[#E9E9E9] border" />
                <div className="flex flex-col w-1/2 gap-0">
                  <div className="flex gap-1 items-center">
                    <Image
                      src={goldHome}
                      alt="goldCoins"
                      width={24}
                      height={24}
                    />
                    <Typography className="text-sm font-poppins text-[#7C7C7C] capitalize">
                      {t('homepage.section2.text3')}
                    </Typography>
                  </div>
                  <Typography className="text-[#392594] font-semibold md:text-base text-[14px]">
                    {seedsCoins?.total_available_coins}
                  </Typography>
                </div>
              </div>
              <div className="flex flex-col w-full">
                <Button
                  className="border-none rounded-[75px]"
                  color="deep-purple"
                  onClick={async () => {
                    await router
                      .push(`homepage/play/${playDetail?.play_id}`)
                      .catch(err => {
                        toast(err, { type: 'error' });
                      });
                  }}
                >
                  play now
                </Button>
                <div className="flex w-full justify-between">
                  <Typography className="font-poppins text-xs capitalize text-[#7C7C7C]">
                    {t('homepage.section2.text19')}
                  </Typography>
                  <Typography className="text-[#392594] font-poppins font-medium md:text-base text-[14px]">
                    {standartCurrency(
                      playDetail.prize.reduce((acc, num) => acc + num, 0)
                    )}
                  </Typography>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
};

export default UserInfoPlaySimulation;
