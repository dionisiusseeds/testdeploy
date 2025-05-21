import { type Banners } from '@/utils/interfaces/play.interface';
import { Card, CardHeader } from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { type Swiper as SwiperInstance } from 'swiper';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

interface BannerProps {
  data: Banners[];
}

interface custompaginationbanner {
  totalSlides: number;
  activeSlides: number;
  onClick: (idx: number) => void;
}

const CustomPaginationBannerCard: React.FC<custompaginationbanner> = ({
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

const CardBannerPromotion: React.FC<BannerProps> = ({ data }) => {
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
    1280: { slidesPerView: 4 },
    1024: { slidesPerView: 3 },
    768: { slidesPerView: 2 },
    480: { slidesPerView: 1.5 },
    320: { slidesPerView: 1, centeredSlides: true }
  };
  return (
    <div className="flex flex-col items-center justify-center w-full gap-2">
      <Swiper
        className="flex flex-row w-full h-auto"
        loop={true}
        slidesPerView={3}
        autoplay={{ delay: 1000 }}
        modules={[Autoplay]}
        breakpoints={breakpoints}
        onSwiper={swiper => {
          setSwiperInstance(swiper);
        }}
      >
        {data?.map((item, idx: number) => (
          <SwiperSlide key={idx}>
            <div className="w-full flex flex-row justify-center p-2">
              <Card className="md:w-80 w-full rounded-[10px] h-fit">
                <CardHeader floated={false} className="p-0 m-0">
                  <div className="relative w-full aspect-[1430/676] overflow-hidden cursor-pointer">
                    <Image
                      onClick={async () => {
                        await router.push(`${item.external_url}`);
                      }}
                      src={item.image_url}
                      alt={item.name}
                      className="absolute top-0 left-0 w-full h-full object-cover"
                      width={1430}
                      height={676}
                    />
                  </div>
                </CardHeader>
              </Card>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <CustomPaginationBannerCard
        activeSlides={activeSlides}
        onClick={handlePaginationClicked}
        totalSlides={data?.length}
      />
    </div>
  );
};

export default CardBannerPromotion;
