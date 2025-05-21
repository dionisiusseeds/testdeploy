import category from '@/assets/homepage/category.svg';
import fee from '@/assets/homepage/fee.svg';
import nodata from '@/assets/homepage/nodata.svg';
import share from '@/assets/homepage/share.svg';
import user from '@/assets/homepage/users.svg';
import { standartCurrency } from '@/helpers/currency';
import { type TeamBattle } from '@/utils/interfaces/play.interface';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Typography
} from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { type Swiper as SwiperType } from 'swiper';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

interface props {
  data: TeamBattle[];
  loading: boolean;
}

interface propsteambattle {
  activeIndex: number;
  totalSlides: number;
  onClick: (index: number) => void;
}

const CustomPaginationTeamBattle: React.FC<propsteambattle> = ({
  activeIndex,
  totalSlides,
  onClick
}) => {
  return (
    <div className="w-full items-center flex justify-center gap-3">
      {totalSlides !== 0
        ? Array.from({ length: totalSlides }).map((_, index) => (
            <div
              key={index}
              onClick={() => {
                onClick(index);
              }}
              className={`cursor-pointer ${
                activeIndex !== index
                  ? 'rounded-[75px] h-2 w-2 bg-[#E9E9E9]'
                  : 'rounded-[75px] w-10 h-2 bg-[#3AC4A0]'
              }`}
            />
          ))
        : null}
    </div>
  );
};

const CardTeamBattle: React.FC<props> = ({ data, loading = true }) => {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const router = useRouter();
  const breakPoints = {
    1024: { slidesPerView: 3 },
    720: { slidesPerView: 2 },
    320: { slidesPerView: 1 }
  };

  const handlePaginationClicked = (index: number): void => {
    setActiveIndex(index);
    if (swiperInstance !== null) {
      swiperInstance.slideToLoop(index);
    }
  };

  useEffect(() => {
    if (swiperInstance !== null) {
      swiperInstance.on('slideChange', () => {
        setActiveIndex(swiperInstance.realIndex);
      });
    }
  }, [swiperInstance]);

  return (
    <div className="flex flex-col w-full gap-2 items-center justify-center">
      {!loading ? (
        <Swiper
          autoplay={{ delay: 5000 }}
          speed={1000}
          loop={true}
          slidesPerView={3}
          centeredSlides={false}
          className="w-full !flex !flex-col gap-3"
          draggable={true}
          modules={[Autoplay]}
          onSwiper={setSwiperInstance}
          breakpoints={breakPoints}
        >
          {data?.length > 0 && data !== null ? (
            data?.map((item, idx: number) => (
              <SwiperSlide key={idx}>
                <Card
                  key={idx}
                  shadow={false}
                  className="md:w-80 w-full h-full bg-gradient-to-br from-[#106B6E] to-[#553BB8] rounded-t-[18px] rounded-b-none"
                >
                  <CardHeader
                    floated={false}
                    className="p-0 flex w-full border-none justify-center m-0 rounded-t-[18px] rounded-b-none"
                  >
                    <Image
                      src={
                        item.banner !== undefined && item.banner !== ''
                          ? item.banner
                          : 'https://dev-assets.seeds.finance/storage/cloud/0ac00be5-98a3-40cf-b1c7-22d88a4affde.png'
                      }
                      alt={item.banner}
                      width={1000}
                      height={1000}
                      className="w-full"
                    />
                  </CardHeader>
                  <CardBody className="w-full flex flex-col items-center gap-2 bg-gradient-to-br from-[#106B6E] to-[#553BB8] py-2 px-3">
                    <div className="flex">
                      <Typography className="font-poppins font-semibold text-white md:text-sm  text-[13px]">
                        {item.name}
                      </Typography>
                    </div>
                    <div className="w-full flex justify-around items-center">
                      <div className="flex w-full flex-col gap-1 items-center justify-center">
                        <Image
                          src={category}
                          alt={category}
                          width={15}
                          height={15}
                        />
                        <Typography className="font-poppins md:text-base text-[13px] text-white">
                          {item.category}
                        </Typography>
                      </div>
                      <div className="flex w-full flex-col gap-1 items-center justify-center border-x-2">
                        <Image src={user} alt={user} width={15} height={15} />
                        <Typography className="font-poppins md:text-base text-[13px] text-white">
                          {`${item.joined_participants} Joined`}
                        </Typography>
                      </div>
                      <div className="flex w-full flex-col gap-1 items-center justify-center">
                        <Image src={fee} alt={fee} width={15} height={15} />
                        <Typography className="font-poppins md:text-base text-[13px] text-white">
                          {item.admission_fee === 0
                            ? 'free'
                            : standartCurrency(item.admission_fee)}
                        </Typography>
                      </div>
                    </div>
                    <div className="w-full flex justify-between items-center py-1 px-2">
                      <div
                        className="flex gap-1 items-center"
                        onClick={() => {
                          toast.success(
                            `${item.name} Successful Copied to Clipboard`,
                            {
                              position: 'bottom-center',
                              autoClose: 2000,
                              draggable: true
                            }
                          );
                        }}
                      >
                        <Button className="w-7 flex rounded-full justify-center items-center py-2 px-2 bg-purple-900 border border-white">
                          <Image
                            src={share}
                            alt={share}
                            width={15}
                            height={15}
                            color="white"
                          />
                        </Button>
                        <Typography className="font-poppins font-normal text-base text-white">
                          Share
                        </Typography>
                      </div>
                      <Button
                        className="py-3 px-2 w-20 h-6 bg-[#2934B2] text-md font-normal flex items-center justify-center border text-base text-[10px] border-white rounded-[15px] hover:cursor-pointer"
                        onClick={async () => {
                          await router.push(`play/team-battle/${item.play_id}`);
                        }}
                      >
                        Play
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              </SwiperSlide>
            ))
          ) : (
            <div className="w-full flex items-center justify-center">
              <div className="flex flex-col items-center gap-2 h-36">
                <Image src={nodata} alt={nodata} width={60} height={60} />
                <Typography className="font-semibold font-poppins text-base">
                  Opps, There’s No Play Yet
                </Typography>
                <Typography className="font-normal text-sm text-[#7C7C7C]">
                  Let’s join the play and win a prize!
                </Typography>
              </div>
            </div>
          )}
        </Swiper>
      ) : (
        <div className="w-full flex items-center justify-center">
          <Typography>Loading...</Typography>
        </div>
      )}
      <CustomPaginationTeamBattle
        activeIndex={activeIndex}
        onClick={handlePaginationClicked}
        totalSlides={data?.length}
      />
    </div>
  );
};

export default CardTeamBattle;
