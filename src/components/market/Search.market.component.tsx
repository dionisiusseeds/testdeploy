import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Input } from '@material-tailwind/react';
import Image from 'next/image';
import { type Dispatch, type SetStateAction } from 'react';
import Background from 'src/assets/market/BgSearchbar.svg';

const Search = ({
  setMenuOpen
}: {
  setMenuOpen: Dispatch<SetStateAction<boolean>>;
}): React.ReactElement => {
  // const [trendingAsset, setTrendingAsset] = useState<trendingMarket[]>([]);
  // const [searchQuery, setSearchQuery] = useState<string>('');

  // const fetchTrendingAsset = async (): Promise<void> => {
  //   try {
  //     const response = await getPlayAssetTrending({
  //       page: 1,
  //       limit: 5000,
  //       sortBy: 'most_traded'
  //     });
  //     setTrendingAsset(response.data.data);
  //   } catch (err: any) {
  //     toast.error(`error fetching data: ${err as string}`);
  //   }
  // };

  // useEffect(() => {
  //   void fetchTrendingAsset();
  // }, []);

  // // Filter assets based on search query
  // const filteredAssets = trendingAsset.filter(asset =>
  //   asset.asset_name.toLowerCase().includes(searchQuery.toLowerCase())
  // );

  return (
    <>
      <div className="flex w-full h-full">
        <Image
          src={Background}
          alt="Searchbar background"
          className="w-full h-full p-3 object-cover"
        />
        <div className="absolute inset-0 flex justify-center items-center w-full p-8">
          <Input
            placeholder="Search"
            label="Search"
            className="bg-white"
            onChange={e => {
              if (e.target.value.length > 0) {
                setMenuOpen(true);
              } else {
                setMenuOpen(false);
              }
              // setSearchQuery(e.target.value);
              setMenuOpen(e.target.value.length > 0);
            }}
          />
          <div className="absolute inset-y-0 right-10 pr-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="w-5 h-5 text-[#1A857D]" />
          </div>
        </div>
      </div>
    </>
  );
};
export default Search;
