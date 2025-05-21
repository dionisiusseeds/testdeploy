import withAuth from '@/helpers/withAuth';
import { getPlayAssetTrending } from '@/repository/play.repository';
import { getUserInfo } from '@/repository/profile.repository';
import { type UserInfo } from '@/utils/interfaces/tournament.interface';
import { Typography } from '@material-tailwind/react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import TopgainersAssetHomepage from './top-gainers-hooks/TopGainers.Component';
export interface topgainers {
  asset_id: string;
  asset_name: string;
  asset_icon: string;
  asset_ticker: string;
  asset_exchange: string;
  asset_type: string;
  asset_price: number;
  regular_percentage: number;
  volume: number;
}

export interface Metadata {
  total: number;
  current_page: number;
  limit: number;
  total_page: number;
}

const topgainersparams = {
  sortBY: 'top_gainers',
  page: 1,
  limit: 7
};

const TopGainers: React.FC = () => {
  const { t } = useTranslation();
  const [topGainers, setTopGainers] = useState<topgainers[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<UserInfo>();

  const fetchTopGainers = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const topResponse = await getPlayAssetTrending({ ...topgainersparams });
      setTopGainers(topResponse.data.data);
    } catch (error) {
      toast.error(`failed to fetch data: ${error as string}`);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchData = async (): Promise<void> => {
    try {
      const dataInfo = await getUserInfo();
      setUserInfo(dataInfo);
    } catch (error) {
      toast.error(`Error fetching data: ${error as string}`);
    }
  };

  useEffect(() => {
    fetchTopGainers()
      .then()
      .catch(() => {});
    fetchData()
      .then()
      .catch(() => {});
  }, []);

  if (isLoading) {
    return (
      <Typography className="text-base w-full font-semibold text-[#262626] text-center items-center ">
        Loading...
      </Typography>
    );
  }

  return (
    <div className="w-full h-auto">
      <div className="flex flex-col gap-3 w-full">
        <div className="flex flex-col gap-3">
          <Typography className="font-semibold text-3xl font-poppins text-[#262626]">
            {t(`homepage.section3.text7`)}
          </Typography>
          <Typography className="font-light text-sm font-poppins text-[#7C7C7C] capitalize">
            {t('homepage.section4.text1')}
          </Typography>
        </div>
        <TopgainersAssetHomepage
          data={topGainers}
          loading={isLoading}
          preferredCurrency={userInfo?.preferredCurrency ?? 'IDR'}
        />
      </div>
    </div>
  );
};

export default withAuth(TopGainers);
