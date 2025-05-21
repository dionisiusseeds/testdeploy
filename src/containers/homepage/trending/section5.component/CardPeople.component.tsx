import FollowButton from '@/components/FollowButton';
import {
  Avatar,
  Card,
  CardBody,
  CardFooter,
  Typography
} from '@material-tailwind/react';
import { useEffect, useState } from 'react';
import { type Swiper as SwiperInstance } from 'swiper';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { people } from '../../Section5New';

interface props {
  data: people[];
}
interface custompaginationpeople {
  totalSlides: number;
  activeSlides: number;
  onClick: (idx: number) => void;
}

const CustomPaginationPeopleCard: React.FC<custompaginationpeople> = ({
  totalSlides,
  activeSlides,
  onClick
}) => {
  return (
    <div className="flex w-full justify-center items-center gap-4">
      {totalSlides !== 0 && totalSlides !== null
        ? Array.from({ length: totalSlides }).map((_, idx: number) => {
            return (
              <div
                onClick={() => {
                  onClick(idx);
                }}
                key={idx}
                className={`md:hidden flex cursor-pointer ${
                  activeSlides !== idx
                    ? 'rounded-[75px] h-2 w-2 bg-[#E9E9E9]'
                    : 'rounded-[75px] w-10 h-2 bg-[#3AC4A0]'
                }`}
              />
            );
          })
        : null}
    </div>
  );
};

const CardPeople: React.FC<props> = ({ data }) => {
  const [activeSlides, setActiveSlides] = useState<number>(0);
  const [swiperInstance, setSwiperInstance] = useState<SwiperInstance | null>(
    null
  );

  useEffect(() => {
    if (swiperInstance !== null) {
      swiperInstance.on('slideChange', () => {
        setActiveSlides(swiperInstance.realIndex);
      });
    }
  }, [swiperInstance]);

  const handlePaginationClicked = (idx: number): void => {
    setActiveSlides(idx);
    if (swiperInstance !== null) {
      swiperInstance.slideToLoop(idx);
    }

    if (swiperInstance !== null) {
      swiperInstance.autoplay.start();
    }
  };

  const breakpoints = {
    1280: { slidesPerView: 6 },
    1080: { slidesPerView: 5 },
    720: { slidesPerView: 3 },
    480: { slidesPerView: 3 },
    320: { slidesPerView: 1, centeredSlide: true }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full gap-2">
      <Swiper
        slidesPerView={6}
        autoplay={{ delay: 3000 }}
        breakpoints={breakpoints}
        loop={true}
        className="w-full flex justify-around md:gap-2"
        modules={[Autoplay]}
        onSwiper={swiper => {
          setSwiperInstance(swiper);
        }}
      >
        {data?.map((data, idx: number) => (
          <SwiperSlide key={idx}>
            <Card
              key={idx}
              className="md:w-40 h-52 w-full flex flex-col gap-2 justify-center items-center rounded-[15px] bg-[#F3F4F8]"
            >
              <Avatar src={data.avatar} alt={data.id} className="w-20 h-16" />
              <CardBody className="flex flex-col py-3 px-2 justify-evenly">
                <div className="flex">
                  <Typography className="font-poppins font-semibold text-xs text-[#262626]">
                    {`${data.name.slice(0, 10)}...`}
                  </Typography>
                </div>
                <div className="flex flex-col gap-1">
                  <Typography className="font-poppins text-base text-[#7C7C7C] capitalize">
                    {data.label ?? data.verified}
                  </Typography>
                  <Typography className="font-poppins text-[#BDBDBD] text-sm capitalize">
                    {`${data.followers} followers`}
                  </Typography>
                </div>
              </CardBody>
              <CardFooter className="flex m-0 p-0">
                <FollowButton
                  userId={data.id}
                  isFollowed={data.is_followed}
                  customClass="font-semibold text-xs rounded-2xl text-white"
                />
              </CardFooter>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>
      <CustomPaginationPeopleCard
        activeSlides={activeSlides}
        onClick={handlePaginationClicked}
        totalSlides={data?.length}
      />
    </div>
  );
};

export default CardPeople;
