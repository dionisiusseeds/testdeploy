import nodata from '@/assets/homepage/nodata.svg';
import shareButton from '@/assets/shareButton.svg';
import type { TopQuiz } from '@/utils/interfaces/quiz.interfaces';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Typography
} from '@material-tailwind/react';
import moment from 'moment';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { type Swiper as SwiperType } from 'swiper';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

interface props {
  data: TopQuiz[];
  loading: boolean;
}

interface propsquiz {
  activeIndex?: number;
  totalSlides: number;
  onClick: (index: number) => void;
}

const CustomPaginationQuiz: React.FC<propsquiz> = ({
  activeIndex,
  totalSlides,
  onClick
}): any => {
  return (
    <div className="w-full items-center flex justify-center gap-3">
      {totalSlides !== 0 && totalSlides !== null
        ? Array.from({ length: totalSlides }).map((_, index) => (
            <div
              key={index}
              className={`cursor-pointer ${
                activeIndex !== index
                  ? 'rounded-[75px] h-2 w-2 bg-[#E9E9E9]'
                  : 'rounded-[75px] w-10 h-2 bg-[#3AC4A0]'
              }`}
              onClick={() => {
                onClick(index);
              }}
            />
          ))
        : null}
    </div>
  );
};

export const CardSlideQuiz: React.FC<props> = ({ data, loading = true }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (swiperInstance !== null) {
      swiperInstance.on('slideChange', () => {
        setActiveIndex(swiperInstance.realIndex);
      });
    }
  }, [swiperInstance]);

  const handlePaginationClicked = (index: number): void => {
    setActiveIndex(index);
    if (swiperInstance !== null) {
      swiperInstance.slideToLoop(index);
    }
  };

  /* ----- Handle classname Swiper ----- */
  const classNameSwiper = '!flex !flex-col w-full gap-3';
  /* -----Handle responsive breakpoint swiper----- */
  const responsiveBreakpointsSwiper = {
    320: { slidesPerView: 1, centeredSlides: true },
    480: { slidesPerView: 2, centeredSlides: true },
    640: { slidesPerView: 3, centeredSlides: true },
    1080: { slidePerView: 3, centeredSlides: true }
  };

  const durationInDays = (startedAt: string, endedAt: string): number => {
    const startDate = moment(startedAt);
    const endDate = moment(endedAt);
    const durationDays = endDate.diff(startDate, 'days');
    return durationDays;
  };

  return (
    <div className="flex flex-col justify-center items-center w-full gap-2">
      {!loading ? (
        <Swiper
          centeredSlides={true}
          loop={true}
          slidesPerView={3}
          spaceBetween={50}
          breakpoints={responsiveBreakpointsSwiper}
          className={classNameSwiper}
          autoplay={{ delay: 2000 }}
          speed={1500}
          modules={[Autoplay]}
          autoFocus={true}
          onSwiper={setSwiperInstance}
        >
          {data?.length > 0 && data !== null ? (
            data?.map((item, index: number) => {
              return (
                <SwiperSlide key={index}>
                  <Card className="flex flex-col items-center md:w-80 sm:w-72 w-full h-auto border-none">
                    <CardHeader
                      floated={false}
                      shadow={false}
                      color="transparent"
                      className="m-0 p-0 w-full rounded-none rounded-t-[18px]"
                    >
                      <Image
                        src={
                          item.banner.image_url !== null &&
                          item.banner.image_url !== ''
                            ? item.banner.image_url
                            : 'https://dev-assets.seeds.finance/storage/cloud/0ac00be5-98a3-40cf-b1c7-22d88a4affde.png'
                        }
                        alt={item.name}
                        className="w-full h-auto"
                        width={1000}
                        height={1000}
                      />
                    </CardHeader>
                    <CardBody className="py-2 px-3 w-full flex flex-col bg-gradient-to-r from-[#106B6E] to-[#96F7C1] gap-1">
                      <div className="p-2 flex flex-row  justify-between items-center">
                        <Typography className="text-white font-poppins font-semibold md:text-sm text-[11px]">
                          {item.name}
                        </Typography>
                        <button>
                          <Image src={shareButton} alt="share" />
                        </button>
                      </div>
                      <div className="border-dashed border border-separate-500"></div>
                      <div className="lg:w-full w-full p-1 flex flex-row justify-between items-end">
                        <div className="flex gap-3 text-white justify-between w-full">
                          <div className="flex flex-col items-start justify-start">
                            <Typography className="text-[#E9E9E9] text-[15px] lg:text-lg">
                              {`${t('quiz.entryFee')}`}
                            </Typography>
                            <Typography className="font-bold text-[15px] lg:text-lg">
                              {item.admission_fee === 0
                                ? t('quiz.free')
                                : item.admission_fee.toLocaleString('id-ID', {
                                    style: 'currency',
                                    currency: 'IDR'
                                  })}
                            </Typography>
                          </div>
                          <div className="flex flex-col items-start">
                            <Typography className="text-[#E9E9E9] text-[15px] lg:text-lg">
                              {`${t('quiz.duration')}`}
                            </Typography>
                            <Typography className="text-[15px] lg:text-lg font-bold">
                              {durationInDays(item.started_at, item.ended_at)}{' '}
                              {`${t('tournament.tournamentCard.days')}`}
                            </Typography>
                          </div>
                          <div className="flex flex-col items-start">
                            <Typography className="text-[#E9E9E9] text-[15px] lg:text-lg">
                              {`${t('quiz.players')}`}
                            </Typography>
                            <Typography className=" text-[15px] lg:text-lg font-bold">
                              {item.participants}
                            </Typography>
                          </div>
                        </div>
                      </div>
                      <div className="w-full flex justify-end items-end mb-2">
                        <Button
                          onClick={async () =>
                            await router.push(
                              `${
                                process.env.NEXT_PUBLIC_DOMAIN ??
                                'https://user-dev-ali.seeds.finance'
                              }/play/quiz/${item.id}`
                            )
                          }
                          className="w-full md:w-1/2 flex justify-center items-center bg-white rounded-full text-[#3AC4A0] capitalize h-4"
                        >
                          {`${t('quiz.play')}`}
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                </SwiperSlide>
              );
            })
          ) : (
            <div className="w-full flex items-center justify-center">
              <div className="flex flex-col gap-2 h-36 items-center">
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
      <CustomPaginationQuiz
        totalSlides={data?.length}
        activeIndex={activeIndex}
        onClick={handlePaginationClicked}
      />
    </div>
  );
};
