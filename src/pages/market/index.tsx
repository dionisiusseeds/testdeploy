import CCard from '@/components/CCard';
import PageGradient from '@/components/ui/page-gradient/PageGradient';
import SearchMarket from '@/containers/market/search/Search.market';
import withAuth from '@/helpers/withAuth';
import { Typography } from '@material-tailwind/react';
import { useState } from 'react';
import Search from '../../components/market/Search.market.component';
import Trending from '../../components/market/Trending.market.component';
import MarketOption from '../../containers/market/MarketOption.market';

const Index = (): React.ReactElement => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <PageGradient defaultGradient className="w-full h-full">
      <CCard className=" mb-5 w-full h-[98px]">
        <Search setMenuOpen={setMenuOpen} />
      </CCard>
      {menuOpen ? (
        <div>
          {' '}
          <SearchMarket setMenuOpen={setMenuOpen} />{' '}
        </div>
      ) : (
        <CCard className="p-3 mb-5 gap-5">
          <Typography className="text-xl font-poppins font-bold">
            Trending
          </Typography>
          <Trending />
          <MarketOption />
        </CCard>
      )}
    </PageGradient>
  );
};

export default withAuth(Index);
