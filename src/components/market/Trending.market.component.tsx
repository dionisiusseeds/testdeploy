import { getPlayAssetTrending } from '@/repository/play.repository';
import { type trendingMarket } from '@/utils/interfaces/market.interface';
import {
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import { Avatar, Card, Typography } from '@material-tailwind/react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const initialParamsMarket = {
  page: 1,
  limit: 5,
  sortBy: 'trending'
};

const Trending = (): JSX.Element => {
  const [trendingAsset, setTrendingAsset] = useState<trendingMarket[]>([]);
  const [isLoading, setIsloading] = useState<boolean>(false);

  const fetchTrendingAsset = async (): Promise<void> => {
    try {
      setIsloading(true);
      const response = await getPlayAssetTrending({ ...initialParamsMarket });
      if (response !== null) {
        setTrendingAsset(response.data.data);
      } else {
        setTrendingAsset([]);
      }
    } catch (error) {
      toast.error(`error fetching data: `);
    } finally {
      setIsloading(false);
    }
  };

  useEffect(() => {
    void fetchTrendingAsset();
  }, []);

  if (isLoading) {
    return (
      <Typography className="font-poppins text-2xl font-semibold">
        Loading...
      </Typography>
    );
  }

  return (
    <div className="flex items-center justify-start md:justify-between overflow-x-auto md:overflow-x-visible gap-5">
      {trendingAsset?.length !== 0
        ? trendingAsset?.map((item, idx: number) => (
            <Card
              key={idx}
              className=" flex flex-row items-center p-2 bg-white rounded-lg shadow-sm"
              shadow={false}
            >
              <div className="flex flex-col items-center justify-center p-0 bg-white rounded-lg shadow-sm">
                <Avatar src={item.asset_icon} className="flex shrink-0" />
                <Typography className="text-center font-medium text-base py-1">
                  {item.asset_name}
                </Typography>
                <Typography
                  className={`flex items-center text-base p-0 ${
                    item.regular_percentage?.toString().includes('-')
                      ? 'text-red-500'
                      : 'text-[#3AC4A0]'
                  }`}
                >
                  {item.regular_percentage?.toString().includes('-') ? (
                    <ArrowTrendingDownIcon
                      height={20}
                      width={20}
                      className="mr-2"
                    />
                  ) : (
                    <ArrowTrendingUpIcon
                      height={20}
                      width={20}
                      className="mr-2"
                    />
                  )}

                  {`${item.regular_percentage?.toFixed(2) ?? '0'} %`}
                </Typography>
              </div>
            </Card>
          ))
        : isLoading}
    </div>
  );
};

export default Trending;
