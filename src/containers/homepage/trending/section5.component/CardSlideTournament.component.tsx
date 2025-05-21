import admission from '@/assets/admission_tournament.svg';
import duration from '@/assets/duration_tournament.svg';
import nodata from '@/assets/homepage/nodata.svg';
import share from '@/assets/product/ShareButtonTopTournament.svg';
import user from '@/assets/usericon_toptournament.svg';
import { standartCurrency } from '@/helpers/currency';
import { type TopTournament } from '@/utils/interfaces/tournament.interface';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Typography
} from '@material-tailwind/react';
import moment from 'moment';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { type Swiper as SwiperType } from 'swiper';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

interface propstournament {
  activeIndex: number;
  totalSlides: number;
  onClick: (index: number) => void;
}

interface props {
  data: TopTournament[];
  loading: boolean;
}

const CustomPaginationTournament: React.FC<propstournament> = ({
  activeIndex,
  totalSlides,
  onClick
}): any => {
  return (
    <div className="w-full items-center flex justify-center gap-3">
      {totalSlides !== 0
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

export const CardSlideTournament: React.FC<props> = ({
  data,
  loading = true
}) => {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const { t } = useTranslation();

  const router = useRouter();

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

  const classNameSwiper = 'w-full !flex !flex-col gap-3';
  const breakpointsSwiper = {
    320: { slidesPerView: 1, centeredSlides: true },
    640: { slidesPerView: 2, centeredSlides: true },
    720: { slidesPerView: 2, centeredSlides: true },
    1080: { slidesPerView: 3 }
  };
  const formatDate = (isoDate: string): string => {
    return moment(isoDate).format('lll');
  };
  const formatPublishMonth = (isoDate: string): string => {
    return moment(isoDate).format('MMM');
  };
  const formatPublishDay = (isoDate: string): string => {
    return moment(isoDate).format('DD');
  };
  const durationTimeTournament = (playTime: Date, endTime: Date): number => {
    const Duration = moment(endTime).diff(moment(playTime), 'days');
    return Duration;
  };

  return (
    <div className="flex flex-col w-full items-center justify-center gap-2">
      {!loading ? (
        <Swiper
          centeredSlides={true}
          grabCursor={true}
          pagination={true}
          slidesPerView={3}
          className={classNameSwiper}
          breakpoints={breakpointsSwiper}
          spaceBetween={150}
          modules={[Autoplay]}
          loop={true}
          autoplay={{ delay: 1000 }}
          speed={1000}
          onSwiper={setSwiperInstance}
        >
          {data?.length > 0 && data !== null ? (
            data?.map((item, idx: number) => {
              return (
                <SwiperSlide key={idx}>
                  <div className="flex flex-row gap-1">
                    <div className="md:flex md:flex-col hidden items-center text-center">
                      <Typography>{`${formatPublishMonth(
                        item.publish_time
                      )}`}</Typography>
                      <Typography className="text-[30px] font-bold font-sans">
                        {`${formatPublishDay(item.publish_time)}`}
                      </Typography>
                    </div>
                    <Card
                      className={`flex flex-col lg:rounded-b-none rounded-b-none md:w-80 sm:w-72 w-full h-auto gap-3`}
                    >
                      <CardHeader
                        floated={false}
                        shadow={false}
                        color="transparent"
                        className="m-0 p-0 w-auto h-32 rounded rounded-t-[18px] rounded-b-none"
                      >
                        <Image
                          src={
                            item.banner !== undefined && item.banner !== ''
                              ? item.banner
                              : 'https://dev-assets.seeds.finance/storage/cloud/0ac00be5-98a3-40cf-b1c7-22d88a4affde.png'
                          }
                          alt={item.name}
                          width={600}
                          height={50}
                        />
                      </CardHeader>
                      <CardBody className="flex h-24 px-2 flex-col md:gap-1.5 gap-0.5 justify-center w-full items-center">
                        <div className="flex justify-between w-full items-start">
                          <Typography className="font-bold font-poppins md:text-[13.91px] text-xs text-[#262626] line-clamp-1">
                            {item.name}
                          </Typography>
                          <button className="capitalize w-[75px] h-[25px] rounded-[4.64px] bg-[#F7F7F7] text-[#553BB8]">
                            {item.type.toLocaleLowerCase()}
                          </button>
                        </div>
                        <div className="flex flex-col w-full">
                          <Typography className="text-[#BDBDBD] text-[11.59px]">
                            {`${formatDate(item.created_at.split('T')[0])}`} -{' '}
                            {`${formatDate(item.end_time.split('T')[0])}`}
                          </Typography>
                        </div>
                        <div className="flex w-full justify-center py-0">
                          <Card
                            className="rounded-[15px] bg-[#F5F5F5] border-none md:gap-0 gap-2 w-full flex flex-row"
                            shadow={false}
                          >
                            <div className="flex flex-col w-full items-center justify-center">
                              <div className="flex  gap-2">
                                <Image
                                  src={duration}
                                  alt={duration}
                                  width={15}
                                  height={15}
                                />
                                <Typography className="md:text-[15px] text-[13px]">
                                  {`${t('tournament.tournamentCard.duration')}`}
                                </Typography>
                              </div>
                              <Typography className="font-bold text-[#262626] md:text-[15px] text-[13px]">
                                {`${durationTimeTournament(
                                  new Date(item.play_time),
                                  new Date(item.end_time)
                                )}`}{' '}
                                {(durationTimeTournament(
                                  new Date(item.play_time),
                                  new Date(item.end_time)
                                ) ?? 0) > 1
                                  ? t('tournament.tournamentCard.days')
                                  : t('tournament.tournamentCard.day')}
                              </Typography>
                            </div>
                            <div className="w-full flex flex-col items-center justify-center md:border-x-2 border-x-0 pe-2">
                              <div className="flex md:gap-2 gap-1">
                                <Image
                                  src={user}
                                  alt={user}
                                  width={15}
                                  height={15}
                                />
                                <Typography className="md:text-[15px] text-[13px]">
                                  {t('tournament.tournamentCard.joined')}
                                </Typography>
                              </div>
                              <Typography className="font-bold text-[#262626] md:text-[15px] text-[13px]">
                                {item.participants === null
                                  ? '0'
                                  : `${item.participants?.length}`}
                              </Typography>
                            </div>
                            <div className="flex flex-col items-center justify-center w-full overflow-hidden">
                              <div className="flex md:gap-2 gap-1">
                                <Image
                                  src={admission}
                                  alt={admission}
                                  width={15}
                                  height={15}
                                />
                                <Typography className="md:text-[15px] text-[13px]">
                                  {t('tournament.tournamentCard.fee')}
                                </Typography>
                              </div>
                              <Typography className="font-bold text-[#262626] md:text-[15px] text-[13px]">
                                {item.admission_fee === 0
                                  ? 'free'
                                  : standartCurrency(item.admission_fee)}
                              </Typography>
                            </div>
                          </Card>
                        </div>
                      </CardBody>
                      <CardFooter className="m-0 py-1 flex px-2 h-auto">
                        <div className="flex md:gap-10 gap-5 justify-center items-center w-full">
                          <div className="flex w-full lg:gap-3 gap-2 items-center">
                            <div className="border-none flex justify-center items-center rounded-[5px] overflow-hidden w-14 h-5 bg-[#DCFCE4] text-[#27A590]">
                              <Typography className="text-[10px]">
                                {item.category}
                              </Typography>
                            </div>
                            <div
                              className="flex gap-2 items-center cursor-pointer"
                              onClick={async () => {
                                await navigator.clipboard.writeText(
                                  item.id === null
                                    ? `Arena's over`
                                    : `https://seeds.finance/play/tournament/${item.id}`
                                );
                              }}
                            >
                              <button
                                onClick={() => {
                                  toast.success(
                                    `${item.name} succesful copied`,
                                    {
                                      position: 'top-center',
                                      draggable: true,
                                      autoClose: 2000
                                    }
                                  );
                                }}
                                className="border-none flex items-center p-2 rounded-full w-6 h-5 bg-[#DCFCE4] "
                              >
                                <Image
                                  src={share}
                                  alt={share}
                                  width={30}
                                  height={30}
                                />
                              </button>
                              <Typography
                                className="text-[#262626] text-[16px] font-normal font-poppins capitalize"
                                onClick={() => {
                                  toast.success(
                                    `${item.name} succesful copied`,
                                    {
                                      position: 'top-center',
                                      draggable: true,
                                      autoClose: 2000
                                    }
                                  );
                                }}
                              >
                                {t('tournament.tournamentCard.share')}
                              </Typography>
                            </div>
                          </div>
                          <Button
                            color="green"
                            className="w-[110px] md:h-[25px] h-[10px] flex items-center justify-center border-none rounded-[30px] bg-[#3AC4A0]"
                            onClick={async () => {
                              await router.push(
                                `${
                                  process.env.NEXT_PUBLIC_DOMAIN ??
                                  'https://user-dev-ali.seeds.finance'
                                }/play/tournament/${item.id}`
                              );
                            }}
                          >
                            OPEN
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  </div>
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
      <CustomPaginationTournament
        activeIndex={activeIndex}
        totalSlides={data?.length}
        onClick={handlePaginationClicked}
      />
    </div>
  );
};
