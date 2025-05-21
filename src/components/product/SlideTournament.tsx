import admission from '@/assets/admission_tournament.svg';
import duration from '@/assets/duration_tournament.svg';
import GrayArrow from '@/assets/product/GrayArrow.svg';
import share from '@/assets/product/ShareButtonTopTournament.svg';
import WhiteArrow from '@/assets/product/WhiteArrow.svg';
import user from '@/assets/usericon_toptournament.svg';
import { standartCurrency } from '@/helpers/currency';
import { getTrendingPlayList } from '@/repository/play.repository';
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
import { Autoplay, EffectCoverflow } from 'swiper/modules';
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';

export const SlideTournament: React.FC = () => {
  const [tournament, setTournament] = useState<TopTournament[]>([]);
  const [buttonChange, setButtonChange] = useState(true);
  const { t } = useTranslation();

  const router = useRouter();

  const HandlePrev: React.FC = () => {
    const swiper = useSwiper();
    return (
      <button
        onClick={() => {
          swiper.slidePrev();
          setButtonChange(false);
        }}
        className={`${
          buttonChange
            ? 'bg-transparent '
            : 'bg-gradient-to-tr from-[#9A76FE] to-[#4FE6AF]'
        } rounded-full h-9 w-9 cursor-pointer flex justify-center items-center`}
      >
        <Image
          src={buttonChange ? GrayArrow : WhiteArrow}
          alt="prevBtn"
          className={buttonChange ? '' : 'rotate-180'}
        />
      </button>
    );
  };

  const HandleNext: React.FC = () => {
    const swiper = useSwiper();
    return (
      <button
        onClick={() => {
          swiper.slideNext();
          setButtonChange(true);
        }}
        className={`${
          buttonChange
            ? 'bg-gradient-to-tr from-[#9A76FE] to-[#4FE6AF]'
            : 'bg-transparent'
        } rounded-full h-9 w-9 cursor-pointer flex justify-center items-center`}
      >
        <Image
          src={buttonChange ? WhiteArrow : GrayArrow}
          alt="nextBtn"
          className={buttonChange ? '' : 'rotate-180'}
        />
      </button>
    );
  };

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const tournamentResponse = await getTrendingPlayList();
        if (tournamentResponse !== null) {
          setTournament(tournamentResponse.data);
        } else {
          setTournament([]);
        }
      } catch (error) {
        toast.error('error fetching data: ');
      }
    };
    fetchData()
      .then()
      .catch(() => {});
  }, []);

  const classNameSwiper =
    'w-full !flex !flex-col md:gap-3 gap-3 justify-center items-center';
  const breakpointsSwiper = {
    320: { slidesPerView: 1 },
    640: { slidesPerView: 3 },
    1080: { slidesPerView: 3 },
    1124: { slidesPerView: 3 },
    2380: { slidesPerView: 5 }
  };
  const coverFlowEffectSwiper = {
    rotate: 0,
    modifier: 3,
    depth: 100,
    stretch: 0,
    slideShadows: false
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
    <div className="w-full">
      <div className="flex flex-col">
        <Swiper
          centeredSlides={true}
          grabCursor={true}
          pagination={true}
          slidesPerView={3}
          className={classNameSwiper}
          breakpoints={breakpointsSwiper}
          effect={'coverflow'}
          spaceBetween={150}
          modules={[EffectCoverflow, Autoplay]}
          coverflowEffect={coverFlowEffectSwiper}
          loop={true}
          autoplay={{ delay: 1000 }}
          speed={1000}
        >
          {tournament?.length !== 0
            ? tournament?.map((item, idx: number) => {
                return (
                  <SwiperSlide key={idx}>
                    <div className="flex flex-row gap-1 ">
                      <div className="md:flex md:flex-col items-center text-center">
                        <Typography>{`${formatPublishMonth(
                          item.publish_time
                        )}`}</Typography>
                        <Typography className="md:text-[45px] text-[30px] font-bold font-sans">
                          {`${formatPublishDay(item.publish_time)}`}
                        </Typography>
                      </div>
                      <Card
                        className={`flex flex-col lg:rounded-b-none rounded-b-none md:w-96 w-60 h-auto gap-3`}
                      >
                        <CardHeader
                          floated={false}
                          shadow={false}
                          color="transparent"
                          className="m-0 p-0 w-auto h-32 rounded-t-[13.37px] lg:rounded-t-[13.37px] rounded-b-none"
                        >
                          <Image
                            src={
                              item.banner !== undefined && item.banner !== ''
                                ? item.banner
                                : 'https://dev-assets.seeds.finance/storage/cloud/5efa1141-9999-4341-958a-5ab97353ac42.png'
                            }
                            alt={item.name}
                            width={600}
                            height={50}
                          />
                        </CardHeader>
                        <CardBody className="flex h-24 px-2 flex-col md:gap-1.5 gap-0.5 justify-center md:w-96 w-full items-center">
                          <div className="flex justify-between w-full items-start">
                            <Typography className="font-bold font-poppins text-[13.91px] text-[#262626]">
                              {item.name}
                              <Typography className="text-[#BDBDBD] text-[11.59px]">
                                {`${formatDate(item.created_at.split('T')[0])}`}{' '}
                                - {`${formatDate(item.end_time.split('T')[0])}`}
                              </Typography>
                            </Typography>
                            <button className="capitalize w-[75px] h-[25px] rounded-[4.64px] bg-[#F7F7F7] text-[#553BB8]">
                              {item.type.toLocaleLowerCase()}
                            </button>
                          </div>
                          <Card
                            className="rounded-[15px] bg-[#F5F5F5] border-none md:w-full w-60 md:gap-0 gap-2 flex flex-row"
                            shadow={false}
                          >
                            <div className="flex flex-col w-full items-center justify-center">
                              <div className="flex  gap-2">
                                <Image
                                  src={duration}
                                  alt={duration}
                                  width={10}
                                  height={10}
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
                                  width={10}
                                  height={10}
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
                                  width={10}
                                  height={10}
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
                        </CardBody>
                        <CardFooter className="m-0 py-1 px-2 h-auto">
                          <div className="flex md:gap-10 gap-5 justify-center items-center w-full">
                            <div className="flex w-full lg:gap-3 gap-2 items-center">
                              <div className="border-none flex justify-center items-center rounded-[10px] overflow-hidden md:w-14 w-10 bg-[#DCFCE4] text-[#27A590] text-[13.5px]">
                                {item.category}
                              </div>
                              <div
                                className="flex gap-2 items-center cursor-pointer"
                                onClick={async () => {
                                  await navigator.clipboard.writeText(
                                    item.id === null
                                      ? `Arena's over`
                                      : `https://seeds.finance/play/tournament`
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
            : null}
          <div className="flex justify-center items-center w-full">
            <HandlePrev />
            <HandleNext />
          </div>
        </Swiper>
      </div>
    </div>
  );
};
