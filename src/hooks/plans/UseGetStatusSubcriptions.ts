import DiamondIcon from '@/assets/homepage/subcription-buttons/diamond-icon.png';
import GoldMemberIcon from '@/assets/homepage/subcription-buttons/gold-icon.png';
import SeedsIcon from '@/assets/homepage/subcription-buttons/icon-subcriptions-1.png';
import SilverMemberIcon from '@/assets/homepage/subcription-buttons/silver-icon.png';
import { getSubscriptionStatus } from '@/repository/subscription.repository';
import { type StatusSubscription } from '@/utils/interfaces/subscription.interface';
import { type StaticImageData } from 'next/image';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface SubscriptionPlan {
  tagText?: string;
  description: string;
  title: string;
  href: string;
  icon: StaticImageData; // Menggunakan tipe IconType dari react-icons
  type: string;
  classNameText?: string;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const UseGetStatusSubcriptionPlan = () => {
  const { t } = useTranslation();

  const subscriptionPlans: SubscriptionPlan[] = [
    {
      tagText: t('homepageSubcription.subscribeNow.tagText') ?? '',
      description: t('homepageSubcription.subscribeNow.description') ?? '',
      title: t('homepageSubcription.subscribeNow.title') ?? '',
      href: '/seedsplan',
      icon: SeedsIcon,
      type: 'subscribe'
    },
    {
      tagText: t('homepageSubcription.silver.tagText') ?? '',
      description: t('homepageSubcription.silver.description') ?? '',
      title: t('homepageSubcription.silver.title') ?? '',
      href: '/seedsplan',
      classNameText: 'text-gray-800',
      icon: SilverMemberIcon,
      type: 'silver'
    },
    {
      tagText: t('homepageSubcription.gold.tagText') ?? '',
      description: t('homepageSubcription.gold.description') ?? '',
      title: t('homepageSubcription.gold.title') ?? '',
      href: '/seedsplan',
      icon: GoldMemberIcon,
      type: 'gold'
    },
    {
      description: t('homepageSubcription.platinum.description') ?? '',
      title: t('homepageSubcription.platinum.title') ?? '',
      href: '/seedsplan',
      icon: DiamondIcon,
      type: 'platinum'
    }
  ];

  const [dataSubscription, setDataSubscription] =
    useState<StatusSubscription | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getSubscriptionPlan = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const planStatus = await getSubscriptionStatus();
      if (planStatus !== undefined) {
        setDataSubscription(planStatus);
      }
    } catch (error) {
      console.error(`${error as string}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void getSubscriptionPlan();
  }, []);

  const activeType =
    dataSubscription?.active_subscription?.subscription_type?.toLowerCase();
  const activeIndex = subscriptionPlans.findIndex(
    plan => plan.type === activeType
  );

  // Menentukan paket yang akan ditampilkan
  const selectedPlan =
    dataSubscription == null
      ? subscriptionPlans[0] // Jika tidak ada data, tampilkan paket default
      : activeIndex === subscriptionPlans.length - 1 ||
        dataSubscription?.incoming_subscription !== null
      ? subscriptionPlans[activeIndex] // Jika paket terakhir atau ada incoming_subscription, tidak menampilkan apapun
      : subscriptionPlans[activeIndex]; // Tampilkan paket

  return {
    dataSubscription,
    isLoading,
    selectedPlan
  };
};

export default UseGetStatusSubcriptionPlan;
