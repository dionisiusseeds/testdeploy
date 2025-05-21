import GrayArrow from '@/assets/product/GrayArrow.svg';
import WhiteArrow from '@/assets/product/WhiteArrow.svg';
import shareButton from '@/assets/shareButton.svg';
import { getQuizTrending } from '@/repository/quiz.repository';
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
import 'swiper/css';
import { Autoplay, EffectCoverflow } from 'swiper/modules';
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';

export const SlideQuiz: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [activeSlide, setActiveSlide] = useState(0);
  const [quizData, setQuizData] = useState<TopQuiz[]>([]);

  const [isChange, setChange] = useState(true);

  /* -------------------- Get API ---------------------- */
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const quizResponse = await getQuizTrending(
          localStorage.getItem('translation') === 'ID' ? 'IDR' : 'USD'
        );
        setQuizData(quizResponse.data);
      } catch (error) {
        console.error('Error fetching data:');
      }
    };

    fetchData()
      .then()
      .catch(() => {});
  }, []);

  /* ------------Handle Prev and Next Button------------- */
  const PrevBtn: React.FC = () => {
    const swiper = useSwiper();
    setActiveSlide(activeSlide);
    return (
      <div className="flex gap-3">
        <div
          onClick={() => {
            setChange(false);
            swiper.slidePrev();
          }}
          className={`rounded-full p-2 w-9 h-9 flex justify-center items-center   ${
            isChange
              ? 'bg-transparent'
              : 'bg-gradient-to-tr from-[#9A76FE] to-[#4FE6AF]'
          }`}
        >
          <Image
            src={isChange ? GrayArrow : WhiteArrow}
            alt="PrevArrow"
            className={`${isChange ? '' : 'rotate-180'}`}
          />
        </div>
      </div>
    );
  };

  const NextBtn: React.FC = () => {
    const swiper = useSwiper();
    setActiveSlide(activeSlide);
    return (
      <div className="flex gap-3">
        <div
          onClick={() => {
            setChange(true);
            swiper.slideNext();
          }}
          className={`rounded-full p-2 w-9 h-9 flex justify-center items-center   ${
            isChange
              ? 'bg-gradient-to-tr from-[#9A76FE] to-[#4FE6AF]'
              : 'bg-transparent'
          }`}
        >
          <Image
            src={isChange ? WhiteArrow : GrayArrow}
            alt="NextArrow"
            className={`${isChange ? '' : 'rotate-180'}`}
          />
        </div>
      </div>
    );
  };

  /* ----- Handle classname Swiper ----- */
  const classNameSwiper =
    '!flex !flex-col w-full !items-center !justify-center';
  const coverFlowEffectSwiper = {
    rotate: 0,
    slideShadows: false,
    stretch: 0,
    modifier: 2.5,
    depth: 150
  };

  /* -----Handle responsive breakpoint swiper----- */
  const responsiveBreakpointsSwiper = {
    320: { slidesPerView: 1, centeredSlides: true },
    480: { slidesPerView: 1, centeredSlides: true },
    640: { slidesPerView: 1, centeredSlides: true },
    1024: { slidePerView: 3, centeredSlides: true }
  };

  const durationInDays = (startedAt: string, endedAt: string): number => {
    const startDate = moment(startedAt);
    const endDate = moment(endedAt);

    const durationDays = endDate.diff(startDate, 'days');

    return durationDays;
  };

  return (
    <div className="flex lg:flex gap-5 w-full">
      <Swiper
        centeredSlides={true}
        loop={true}
        slidesPerView={3}
        spaceBetween={50}
        breakpoints={responsiveBreakpointsSwiper}
        coverflowEffect={coverFlowEffectSwiper}
        effect={'coverflow'}
        className={classNameSwiper}
        autoplay={{ delay: 2000 }}
        speed={1500}
        modules={[EffectCoverflow, Autoplay]}
        autoFocus={true}
      >
        {quizData?.length !== 0
          ? quizData?.map((item: TopQuiz, index: number) => {
              return (
                <SwiperSlide key={index}>
                  <Card className="flex flex-col items-center md:w-96 border h-auto">
                    <CardHeader
                      floated={false}
                      shadow={false}
                      color="transparent"
                      className="m-0 w-full h-36 object-cover rounded-none rounded-t-[18px] p-0"
                    >
                      <Image
                        src={item.banner.image_url}
                        alt={item.name}
                        className="object-cover w-full h-full"
                        width={300}
                        height={300}
                      />
                    </CardHeader>
                    <CardBody className="p-1 h-auto w-full flex flex-col bg-gradient-to-r from-[#106B6E] to-[#96F7C1] gap-1">
                      <div className="p-2 flex flex-row  justify-between items-center">
                        <Typography className="text-white font-bold lg:text-xl text-[17px]">
                          {item.name}
                        </Typography>
                        <button>
                          <Image src={shareButton} alt="share" />
                        </button>
                      </div>
                      <div className="border-dashed border border-separate-500"></div>
                      <div className="lg:w-full w-full p-1 flex flex-row justify-between items-end">
                        <div className="flex gap-3 text-white ">
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
                        <Button
                          onClick={async () =>
                            await router.push(
                              `${
                                process.env.NEXT_PUBLIC_DOMAIN ??
                                'https://user-dev-ali.seeds.finance'
                              }/play/quiz/${item.id}`
                            )
                          }
                          className="flex justify-center items-center bg-white rounded-full text-[#3AC4A0] capitalize h-4"
                        >
                          {`${t('quiz.play')}`}
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                </SwiperSlide>
              );
            })
          : null}
        <div className="flex w-full justify-center cursor-pointer mt-5">
          <PrevBtn />
          <NextBtn />
        </div>
      </Swiper>
    </div>
  );
};
