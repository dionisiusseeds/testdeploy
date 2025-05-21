import { getPlayAssetTrending } from '@/repository/play.repository';
import type { trendingMarket } from '@/utils/interfaces/market.interface';
import { Avatar, Typography } from '@material-tailwind/react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const TopLosers = (): React.ReactElement => {
  const [topLoser, setTopLoser] = useState<trendingMarket[]>([]);

  const fetchTrendingAsset = async (): Promise<void> => {
    try {
      const response = await getPlayAssetTrending({
        page: 1,
        limit: 10,
        sortBy: 'top_losers'
      });
      setTopLoser(response.data.data);
    } catch (error) {
      toast.error(`error fetching data: `);
    }
  };

  useEffect(() => {
    void fetchTrendingAsset();
  }, []);
  return (
    <>
      <div
        className="flex flex-col gap-3" /*  cover tag atas -  wrap to row  */
      >
        <div className="grid grid-cols-3 grid-rows-1">
          <Typography className="text-left">Asset</Typography>
          <Typography className="text-center">Volume</Typography>
          <Typography className="text-right">Price</Typography>
        </div>
        {topLoser?.map((item, index) => (
          <div
            key={index}
            className="w-full grid grid-cols-3 grid-rows-1 border-b border-[#E9E9E9] bg-blue py-2"
          >
            <div className="flex flex-row gap-3 justify-start">
              <Avatar src={item.asset_icon} />
              <div>
                <Typography>{item.asset_ticker}</Typography>
                <Typography>{item.asset_name}</Typography>
              </div>
            </div>
            <Typography className="text-center">{item.volume}</Typography>
            <Typography className="text-right">
              {Number(item.asset_price) % 1 === 0
                ? Number(item.asset_price).toFixed(0)
                : Number(item.asset_price).toFixed(2)}
            </Typography>
          </div>
        ))}
      </div>
    </>
  );
};

export default TopLosers;
