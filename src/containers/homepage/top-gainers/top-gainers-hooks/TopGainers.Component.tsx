import { standartCurrency } from '@/helpers/currency';
import { Avatar, Card, CardBody, Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';
import GreenChart from 'src/assets/GreenChart.svg';
import Bearish from 'src/assets/play/tournament/bearish.svg';
import Bullish from 'src/assets/play/tournament/bullish.svg';
import RedChart from 'src/assets/RedChart.svg';
import { Swiper, SwiperSlide } from 'swiper/react';
import { type topgainers } from '../TopGainers.index';

interface props {
  data: topgainers[];
  loading: boolean;
  preferredCurrency: string;
}

const TopgainersAssetHomepage: React.FC<props> = ({
  data,
  loading,
  preferredCurrency
}) => {
  const router = useRouter();

  const breakpoints = {
    2466: { slidesPerView: 7 },
    1080: { slidesPerView: 7 },
    720: { slidesPerView: 5 },
    480: { slidesPerView: 5 },
    320: { slidesPerView: 1 }
  };

  return (
    <Swiper
      loop={true}
      autoplay={{ delay: 5000 }}
      slidesPerView={7}
      className="w-full h-full"
      breakpoints={breakpoints}
    >
      {data?.length !== 0
        ? data?.map((data, idx: number) => (
            <SwiperSlide key={idx}>
              <div className="flex flex-row w-full md:px-2 px-0">
                <Card
                  onClick={async () => {
                    await router.push(`homepage/assets/${data.asset_id}`);
                  }}
                  key={idx}
                  className="md:w-56 w-full h-full px-2 py-2 bg-[rgb(249,249,249)] cursor-pointer hover:bg-white hover:border duration-300"
                  shadow={false}
                >
                  <CardBody className="p-0 m-0 w-full flex flex-col gap-1 items-start">
                    <div className="flex w-full gap-1 items-center">
                      <Avatar
                        className="w-5 h-5"
                        variant="rounded"
                        src={
                          data.asset_icon === null &&
                          data.asset_icon === undefined &&
                          data.asset_icon === ''
                            ? 'https://dev-assets.seeds.finance/storage/cloud/5efa1141-9999-4341-958a-5ab97353ac42.png'
                            : data.asset_icon
                        }
                        alt={data.asset_name}
                      />
                      <Typography className="font-poppins font-semibold text-[10px] uppercase">
                        {data.asset_ticker} / {preferredCurrency}
                      </Typography>
                    </div>
                    <Typography className="font-semibold text-[rgb(38,38,38)] text-sm overflow-hidden">
                      {preferredCurrency ?? 'IDR'}
                      {standartCurrency(data?.asset_price ?? 0).replace(
                        'Rp',
                        ''
                      )}
                    </Typography>
                    <div className="flex w-full gap-1">
                      <Image
                        src={
                          data.regular_percentage > -0.1 &&
                          data.regular_percentage >= 0
                            ? Bullish
                            : Bearish
                        }
                        alt={data.asset_name}
                      />
                      {data.regular_percentage >= 0 &&
                      data.regular_percentage > -0.1 ? (
                        <Typography className="text-[#66C425] text-[10px] font-poppins">
                          {standartCurrency(data.regular_percentage)}
                        </Typography>
                      ) : (
                        <Typography className="text-[#DD2525] text-[10px] font-poppins">
                          {standartCurrency(data.regular_percentage)}
                        </Typography>
                      )}
                    </div>
                    <div className="flex py-2 px-1 h-full">
                      <Image
                        src={
                          data.regular_percentage > -0.1 &&
                          data.regular_percentage >= 0
                            ? GreenChart
                            : RedChart
                        }
                        alt={data.asset_name}
                        width={300}
                        height={300}
                        className="md:w-80 w-96"
                      />
                    </div>
                  </CardBody>
                </Card>
              </div>
            </SwiperSlide>
          ))
        : loading}
    </Swiper>
  );
};

export default TopgainersAssetHomepage;
