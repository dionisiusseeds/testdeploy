import { getPlayAssetTrending } from '@/repository/play.repository';
import type { trendingMarket } from '@/utils/interfaces/market.interface';
import { Typography } from '@material-tailwind/react';
import type { Dispatch, SetStateAction } from 'react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const SearchMarket = ({
  setMenuOpen
}: {
  setMenuOpen: Dispatch<SetStateAction<boolean>>;
}): React.ReactElement => {
  const [trendingAsset, setTrendingAsset] = useState<trendingMarket[]>([]);

  // Filter assets based on search query
  const filteredAssets = trendingAsset.filter(asset =>
    asset.asset_name.toLowerCase().includes('')
  );

  const fetchTrendingAsset = async (): Promise<void> => {
    try {
      const response = await getPlayAssetTrending({
        page: 1,
        limit: 1000,
        sortBy: 'most_traded'
      });
      setTrendingAsset(response.data.data);
    } catch (Error) {
      toast.error(`error fetching data: `);
    }
  };

  useEffect(() => {
    void fetchTrendingAsset();
  }, []);
  return (
    <div className="absolute top-full mt-2 bg-white border rounded-lg w-full max-h-60 overflow-y-auto">
      {filteredAssets.length > 0 ? (
        filteredAssets.map(asset => (
          <div key={asset.asset_id} className="p-2 hover:bg-gray-100">
            {asset.asset_name}
          </div>
        ))
      ) : (
        <Typography className="p-2 text-gray-500">No results found</Typography>
      )}
    </div>
  );
};
export default SearchMarket;
