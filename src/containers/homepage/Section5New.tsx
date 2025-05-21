import withAuth from '@/helpers/withAuth';
import { type CircleInterface } from '@/pages/connect';
import { getCircle } from '@/repository/circle.repository';
import { getBanner } from '@/repository/discover.repository';
import { searchUser } from '@/repository/people.repository';
import { type Banners } from '@/utils/interfaces/play.interface';
import {
  Button,
  TabPanel,
  Tabs,
  TabsBody,
  TabsHeader,
  Typography
} from '@material-tailwind/react';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import CardBannerPromotion from './trending/section5.component/CardBannerPromotion.component';
import CardCircle from './trending/section5.component/CardCircle.component';
import CardPeople from './trending/section5.component/CardPeople.component';
import CardPlayHomepage from './trending/section5.component/CardPlayHomepage.component';
import CardSeedsPedia from './trending/section5.component/CardSeedsPedia.component';

interface categorie {
  label: string;
  value: string;
}

const categories: categorie[] = [
  {
    label: 'SeedsPedia',
    value: 'seedspedia'
  },
  {
    label: 'Promotion',
    value: 'promotion'
  },
  { label: 'People', value: 'people' },
  { label: 'Circle', value: 'circle' },
  { label: 'Play', value: 'play' }
];

export interface people {
  id: string;
  name: string;
  seeds_tag: string;
  avatar: string;
  label: string;
  followers: number;
  is_followed: boolean;
  verified: boolean;
}

const initialParamsCircle = {
  search: '',
  type: '',
  sortBy: 'my_circle',
  page: 1,
  limit: 7
};

const initialParamsPeople = {
  search: ' ',
  page: 1,
  limit: 7,
  sortBy: ''
};

const initialParamsBanner = {
  page: 1,
  type: 'exclusive'
};

const Section5New: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeButton, setActiveButton] = useState<number>(0);
  const [multiTab, setMultiTab] = useState<string>('seedspedia');
  const [dataBanner, setDataBanner] = useState<Banners[]>([]);
  const [dataPeople, setDataPeople] = useState<people[]>([]);
  const [circleData, setCircleData] = useState<CircleInterface[]>([]);
  const handleMultiTabChange = (value: string): void => {
    setMultiTab(value);
    if (value === 'seedspedia') {
      void (<CardSeedsPedia />);
    }
    if (value === 'promotion') {
      void fetchBanner();
    }
    if (value === 'people') {
      void fetchDataPeople();
    }
    if (value === 'circle') {
      void fetchCircle();
    }
    if (value === 'play') {
      void (<CardPlayHomepage />);
    }
  };

  const fetchBanner = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const bannerResp = await getBanner({ ...initialParamsBanner });
      if (bannerResp !== null) {
        setDataBanner(bannerResp.data);
      } else {
        setDataBanner([]);
      }
    } catch (error) {
      toast.error(`fetch banner error :${error as string}`);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDataPeople = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const peopleResp = await searchUser({ ...initialParamsPeople });
      if (peopleResp !== null) {
        setDataPeople(peopleResp.result);
      } else {
        setDataPeople([]);
      }
    } catch (error) {
      toast.error(`fetch people error : ${error as string}`);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCircle = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const circleResp = await getCircle({
        ...initialParamsCircle
      });
      if (circleResp !== null) {
        setCircleData(circleResp.data);
      } else {
        setCircleData([]);
      }
    } catch (error) {
      toast.error(`fetch circle error: ${error as string}`);
    } finally {
      setIsLoading(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type

  useEffect(() => {
    if (multiTab === 'seedspedia') {
      void (<CardSeedsPedia />);
    } else if (multiTab === 'promotion') {
      void fetchBanner();
    } else if (multiTab === 'people') {
      void fetchDataPeople();
    } else if (multiTab === 'circle') {
      void fetchCircle();
    } else if (multiTab === 'play') {
      void (<CardPlayHomepage />);
    }
  }, [multiTab]);

  return (
    <div className="w-full h-auto cursor-default">
      <Tabs value={multiTab}>
        <TabsHeader className="w-full flex justify-around bg-white md:gap-6 gap-2 py-2 overflow-x-auto">
          {categories.map((item, idx: number) => (
            <Button
              className={`w-full flex justify-center items-center md:w-96 h-fit px-10 ${
                activeButton !== idx
                  ? 'border border-[#BDBDBD] hover:bg-white'
                  : 'border bg-[#3AC4A0] hover:bg-[3AC4A0]'
              } `}
              variant="text"
              color="gray"
              key={idx}
              onClick={() => {
                handleMultiTabChange(item.value);
                setActiveButton(idx);
              }}
              value={item.value}
            >
              <Typography
                className={`text-xs md:text-center ${
                  activeButton !== idx
                    ? 'font-poppins text-[#BDBDBD]'
                    : 'font-poppins text-[#FFFFFF] font-semibold'
                }`}
              >
                {item.label}
              </Typography>
            </Button>
          ))}
        </TabsHeader>
        <TabsBody>
          {categories.map(({ value }) => {
            return (
              <TabPanel key={value} value={value}>
                <div className="flex w-full h-fit">
                  {!isLoading ? (
                    multiTab === 'seedspedia' ? (
                      <CardSeedsPedia />
                    ) : multiTab === 'promotion' ? (
                      <CardBannerPromotion data={dataBanner} />
                    ) : multiTab === 'people' ? (
                      <CardPeople data={dataPeople} />
                    ) : multiTab === 'circle' ? (
                      <CardCircle data={circleData} />
                    ) : multiTab === 'play' ? (
                      <CardPlayHomepage />
                    ) : (
                      <Typography className="text-base w-full font-semibold text-[#262626] text-center items-center">
                        Data Not Found
                      </Typography>
                    )
                  ) : (
                    <Typography className="text-base w-full font-semibold text-[#262626] text-center items-center ">
                      Loading...
                    </Typography>
                  )}
                </div>
              </TabPanel>
            );
          })}
        </TabsBody>
      </Tabs>
    </div>
  );
};

export default withAuth(Section5New);
