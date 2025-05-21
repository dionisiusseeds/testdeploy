import { chrownCirclePremium } from '@/constants/assets/icons';
import { type CircleInterface } from '@/pages/connect';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Typography
} from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { type Swiper as SwiperInstance } from 'swiper';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

interface props {
  data: CircleInterface[];
}

interface custompaginationcircle {
  totalSlides: number;
  activeSlides: number;
  onClick: (idx: number) => void;
}

const CustomPaginationCircleCard: React.FC<custompaginationcircle> = ({
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
        : ''}
    </div>
  );
};

interface MyStyle extends React.CSSProperties {
  '--image-url': string;
}

const CardCircle: React.FC<props> = ({ data }) => {
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
    if (swiperInstance !== null) {
      swiperInstance.autoplay.start();
    }
  }, [swiperInstance]);

  const handlePaginationClicked = (idx: number): void => {
    setActiveSlides(idx);
    if (swiperInstance !== null) {
      swiperInstance.slideToLoop(idx);
    }
  };
  const router = useRouter();
  const breakpoints = {
    320: { slidesPerView: 1, spaceBetween: 8 },
    480: { slidesPerView: 2, spaceBetween: 12 },
    720: { slidesPerView: 3, spaceBetween: 12 },
    1080: { slidesPerView: 4, spaceBetween: 16 },
    1280: { slidesPerView: 5, spaceBetween: 16 },
    1536: { slidesPerView: 6, spaceBetween: 20 }
  };
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center gap-2 w-full">
      <Swiper
        className="w-full flex"
        loop={true}
        autoplay={{ delay: 3000 }}
        modules={[Autoplay]}
        slidesPerView={6}
        spaceBetween={16}
        breakpoints={breakpoints}
        centeredSlides={false}
        onSwiper={swiper => {
          setSwiperInstance(swiper);
        }}
      >
        {data?.map((data, idx: number) => {
          const myStyle: MyStyle = {
            '--image-url': `url(${
              data.cover.split('.')[0] === 'https://seeds-bucket-new'
                ? 'https://res.cloudinary.com/dafjb9vn7/image/upload/v1702374211/defaultBannerCircle_kp04b9.svg'
                : data.cover
            })`
          };
          return (
            <SwiperSlide key={idx}>
              <Card className="w-full md:w-40 h-64 flex flex-col gap-0">
                <CardHeader
                  className="p-0 m-0 rounded-b-none relative h-36 overflow-hidden"
                  shadow={false}
                  floated={false}
                  style={myStyle}
                >
                  <Image
                    src={data.cover}
                    alt={data.cover}
                    layout="fill"
                    objectFit="cover"
                    className="w-full h-full"
                  />
                  {data.type !== 'free' ? (
                    <div className="absolute top-1 right-1 bg-white px-2 py-1 rounded-full flex items-center shadow-sm">
                      <Image
                        src={chrownCirclePremium.src}
                        alt="crown"
                        width={15}
                        height={15}
                      />
                      <Typography className="text-xs text-[#3AC4A0] font-semibold ml-1">
                        Premium
                      </Typography>
                    </div>
                  ) : null}
                </CardHeader>
                <CardBody className="w-full bg-[#F3F4F8] py-3 px-2">
                  <Typography className="font-poppins font-semibold text-xs text-[#000000]">
                    {data.name}
                  </Typography>
                  <Typography className="font-poppins text-xs text-[#7C7C7C]">
                    {`${data.total_member} ${t(
                      'homepage.section5.cardcircletext1'
                    )}`}
                  </Typography>
                  <Button
                    className="mt-2 bg-[#3AC4A0] w-full py-1 text-xs text-white rounded-[25px] hover:font-semibold"
                    onClick={async () => {
                      await router.push(`/connect/post/${data.id}`);
                    }}
                  >
                    Join
                  </Button>
                </CardBody>
              </Card>
            </SwiperSlide>
          );
        })}
      </Swiper>
      <CustomPaginationCircleCard
        activeSlides={activeSlides}
        onClick={handlePaginationClicked}
        totalSlides={data?.length}
      />
    </div>
  );
};

export default CardCircle;
