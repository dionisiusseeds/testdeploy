import type { Banners } from '@/utils/interfaces/play.interface';
import { Card, CardBody } from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { type Swiper as SwiperType } from 'swiper';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

interface BannerLoad {
  BannerList: Banners[];
  loading: boolean;
  className: string;
}

interface props {
  activeIndex: number | string;
  totalSlides: number;
  onClick: (index: number) => void;
}

const CustomPagination: React.FC<props> = ({
  activeIndex,
  totalSlides,
  onClick
}) => {
  return (
    <div className="flex w-full items-center justify-center gap-3 hover:cursor-pointer md:hidden ">
      {Array.from({ length: totalSlides }).map((_, index: number) => (
        <div
          key={index}
          onClick={() => {
            onClick(index);
          }}
          className={
            activeIndex !== index
              ? 'rounded-[75px] h-2 w-2 bg-[#E9E9E9]'
              : 'rounded-[75px] w-10 h-2 bg-[#3AC4A0]'
          }
        />
      ))}
    </div>
  );
};

const BannerComponent: React.FC<BannerLoad> = ({
  BannerList,
  loading,
  className
}) => {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

  const breakPoints = {
    320: { slidesPerView: 1 },
    480: { slidesPerView: 2 },
    720: { slidesPerView: 3 },
    1080: { slidesPerView: 3 },
    2466: { slidesPerView: 4 }
  };

  useEffect(() => {
    if (swiperInstance != null) {
      swiperInstance.on('slideChange', () => {
        setActiveIndex(swiperInstance.realIndex);
      });
    }

    if (swiperInstance !== null) {
      swiperInstance.autoplay.start();
    }
  }, [swiperInstance]);

  const handlePaginationClicked = (index: number): void => {
    setActiveIndex(index);
    if (swiperInstance != null) {
      swiperInstance.slideToLoop(index);
    }
  };

  return (
    <div className="flex flex-col w-full gap-3">
      <Swiper
        className={`${className}flex w-full h-auto`}
        centeredSlides={true}
        slidesPerView={3}
        modules={[Autoplay]}
        spaceBetween={15}
        autoplay={{ delay: 1000, disableOnInteraction: false }}
        speed={1000}
        loop={true}
        breakpoints={breakPoints}
        onSwiper={swiper => {
          setSwiperInstance(swiper);
        }}
        keyboard={{ enabled: true }}
        enabled={true}
      >
        {BannerList.length !== 0
          ? BannerList.map(item => {
              return (
                <div key={item.id} className="flex flex-col gap-3">
                  <SwiperSlide>
                    <Card shadow={false}>
                      <CardBody className="p-0 m-0 w-full">
                        <div className="relative w-full aspect-[1430/676] overflow-hidden">
                          <Image
                            onClick={async () => {
                              await router.push(item.external_url);
                            }}
                            src={
                              item.image_url === null &&
                              item.image_url === undefined &&
                              item.image_url === ''
                                ? 'https://dev-assets.seeds.finance/storage/cloud/5efa1141-9999-4341-958a-5ab97353ac42.png'
                                : item.image_url
                            }
                            alt={item.name}
                            className="absolute top-0 left-0 w-full h-full object-cover rounded-[10px] cursor-pointer"
                            width={1430}
                            height={676}
                          />
                        </div>
                      </CardBody>
                    </Card>
                  </SwiperSlide>
                </div>
              );
            })
          : loading}
      </Swiper>
      <CustomPagination
        activeIndex={activeIndex}
        totalSlides={BannerList.length}
        onClick={handlePaginationClicked}
      />
    </div>
  );
};

export default BannerComponent;
