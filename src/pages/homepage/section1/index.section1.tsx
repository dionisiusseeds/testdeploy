import withAuth from '@/helpers/withAuth';
import { getBanner } from '@/repository/discover.repository';
import type { Banners } from '@/utils/interfaces/play.interface';
import { Typography } from '@material-tailwind/react';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import BannerComponent from './banner-hooks/Banner.Component';

const initialParamsBanner = {
  page: 1,
  type: 'main'
};
const Section1New: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [banner, setBanner] = useState<Banners[]>([]);
  const className = 'overflow-hidden md:h-full';
  useEffect(() => {
    const fetchBanner = async (): Promise<void> => {
      try {
        setIsLoading(true);
        const bannerResponse = await getBanner({ ...initialParamsBanner });
        setBanner(bannerResponse.data !== null ? bannerResponse.data : []);
      } catch (error) {
        toast.error(`error fetching data:${error as string}`);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBanner()
      .then()
      .catch(() => {});
  }, []);

  if (isLoading !== null) {
    <div className="flex items-center justify-center">
      <Typography className="text-base w-full font-semibold text-[#262626] text-center items-center">
        Loading...
      </Typography>
    </div>;
  }

  return (
    <div className="flex w-full bg-[#FFFFFF] items-center justify-center ">
      <BannerComponent
        BannerList={banner}
        loading={isLoading}
        className={className}
      />
    </div>
  );
};

export default withAuth(Section1New);
