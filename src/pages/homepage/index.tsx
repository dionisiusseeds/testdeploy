import CCard from '@/components/CCard';
import ChooseCurrencyPopup from '@/components/popup/ChooseCurrency';
import PageGradient from '@/components/ui/page-gradient/PageGradient';
import UserInfoPlaySimulation from '@/components/UserInfoPlaySimulation.index';
import FeatureSection from '@/containers/homepage/FeatureSection';
import Section5New from '@/containers/homepage/Section5New';
import SubcroptionSection from '@/containers/homepage/SubcriptionSection';
import TopGainers from '@/containers/homepage/top-gainers/TopGainers.index';
import { isGuest } from '@/helpers/guest';
import withAuth from '@/helpers/withAuth';
import { getUserInfo } from '@/repository/profile.repository';
import { type UserInfo } from '@/utils/interfaces/tournament.interface';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Section1New from './section1/index.section1';

const Homepage: React.FC = () => {
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [popUpCurrency, setPopupCurrency] = useState<boolean>(false);
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const dataInfo = await getUserInfo();
        setUserInfo(dataInfo);
      } catch (error) {
        toast.error(`Error fetching data: ${error as string}`);
      }
    };

    fetchData()
      .then()
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (userInfo?.preferredCurrency?.length === 0) {
      setPopupCurrency(true);
    }
  }, [userInfo]);

  const handleOpen = (): void => {
    setPopupCurrency(!popUpCurrency);
  };

  return (
    <PageGradient
      defaultGradient
      className="w-full bg-[#f8f8f8] md:bg-transparent"
    >
      <CCard className="w-full px-2 py-3 mb-5">
        {userInfo !== undefined && (
          <UserInfoPlaySimulation playerInfo={userInfo} />
        )}
      </CCard>

      <SubcroptionSection />

      <ChooseCurrencyPopup handleOpen={handleOpen} open={popUpCurrency} />
      <CCard className="p-3 mb-5 h-auto rounded-none shadow-none flex-col gap-2">
        <Section1New />
      </CCard>
      <CCard className="p-3 mb-5">
        <FeatureSection />
      </CCard>
      {!isGuest() && (
        <CCard className="px-3 py-5 mb-5">
          <TopGainers />
        </CCard>
      )}
      <CCard className="p-3 mb-5">
        <Section5New />
      </CCard>
    </PageGradient>
  );
};

export default withAuth(Homepage);
