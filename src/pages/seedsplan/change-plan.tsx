import HowToUseSeedsplan from '@/components/seedsplan/howToUse';
import TncSeedsplan from '@/components/seedsplan/tnc';
import PageGradient from '@/components/ui/page-gradient/PageGradient';
import withAuth from '@/helpers/withAuth';
import { getUserInfo } from '@/repository/profile.repository';
import {
  getSubscriptionPlan,
  getSubscriptionStatus,
  getSubscriptionVoucher
} from '@/repository/subscription.repository';
import i18n from '@/utils/common/i18n';
import {
  type DataPlanI,
  type DataVoucherI,
  type PlanByTier,
  type PlanI,
  type StatusSubscription
} from '@/utils/interfaces/subscription.interface';
import { type UserInfo } from '@/utils/interfaces/tournament.interface';
import { Typography } from '@material-tailwind/react';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaChevronRight } from 'react-icons/fa';
import { GoInfinity } from 'react-icons/go';
import { HiUserGroup } from 'react-icons/hi2';
import { IoGameController } from 'react-icons/io5';
import { toast } from 'react-toastify';

const ChangePlan: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslation();

  const [subscriptionStatus, setSubscriptionStatus] =
    useState<StatusSubscription | null>(null);
  const [dataVoucher, setDataVoucher] = useState<DataVoucherI | undefined>(
    undefined
  );
  const [userInfo, setUserInfo] = useState<UserInfo>();

  const [dataPlan, setDataPlan] = useState<DataPlanI>();
  const [mappedPlansByTier, setMappedPlansByTier] = useState<PlanByTier[]>([]);
  const [allAvailablePlans, setAllAvailablePlans] = useState<PlanI[]>([]);
  const [selectedPeriodPlan, setSelectedPeriodPlan] = useState<PlanI>();
  const [activePlan, setActivePlan] = useState<PlanI>();

  const [packagePlan, setPackagePlan] = useState<string>('SILVER');
  const [periodPlan, setPeriodPlan] = useState<number>(1);

  const [isActiveSubscription, setIsActiveSubscription] =
    useState<boolean>(false);
  const [showTnc, setShowTnc] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [showHowToUse, setHowToUse] = useState<boolean>(false);

  const packagePlanList = [
    { name: 'SILVER', badge: null },
    { name: 'GOLD', badge: null },
    { name: 'PLATINUM', badge: t('seedsPlan.text9') }
  ];

  const getPlanList = async (): Promise<void> => {
    try {
      const response = await getSubscriptionPlan();
      setDataPlan(response);
      const dataInfo = await getUserInfo();
      setUserInfo(dataInfo);
    } catch (error) {
      toast(error as string, { type: 'error' });
    }
  };

  const getVoucherList = async (id: string): Promise<void> => {
    try {
      const response = await getSubscriptionVoucher(id);
      setDataVoucher(response);
    } catch (error) {
      toast(error as string, { type: 'error' });
    }
  };

  const getStatus = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await getSubscriptionStatus();
      if (response !== undefined) {
        setSubscriptionStatus(response);
      }
    } catch (error) {
      console.error(`Error fetching data: ${error as string}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void getPlanList();
    void getStatus();
  }, []);

  useEffect(() => {
    if (subscriptionStatus !== null) {
      setIsActiveSubscription(true);
    } else {
      setIsActiveSubscription(false);
    }
  }, [subscriptionStatus]);

  useEffect(() => {
    if (dataPlan !== undefined) {
      const { SILVER, GOLD, PLATINUM } = dataPlan.data;
      const mappedPlan = [
        { name: 'SILVER', data: [...SILVER] },
        { name: 'GOLD', data: [...GOLD] },
        { name: 'PLATINUM', data: [...PLATINUM] }
      ];

      setMappedPlansByTier(mappedPlan);
      setAllAvailablePlans([...SILVER, ...GOLD, ...PLATINUM]);
      setPeriodPlan(
        SILVER.find(item => item.duration_in_months === 1)
          ?.duration_in_months ?? 1
      );
    }
  }, [dataPlan]);

  const filteredPlanByTier = mappedPlansByTier?.find(
    item => item.name === packagePlan
  )?.data;

  useEffect(() => {
    const selected = filteredPlanByTier?.find(
      item => item.duration_in_months === periodPlan
    );
    setSelectedPeriodPlan(selected);
  }, [periodPlan, filteredPlanByTier, allAvailablePlans]);

  useEffect(() => {
    if (isActiveSubscription && subscriptionStatus !== null) {
      const activeSubscriptionId =
        subscriptionStatus?.active_subscription?.subscription_type_id;
      const selected = allAvailablePlans?.find(
        item => item.id === activeSubscriptionId
      );
      setActivePlan(selected);
    }
  }, [isActiveSubscription, subscriptionStatus, allAvailablePlans]);

  const filteredTnc =
    selectedPeriodPlan?.tnc?.[i18n.language === 'id' ? 'id' : 'en'] !== ''
      ? selectedPeriodPlan?.tnc[i18n.language === 'id' ? 'id' : 'en']
      : '-';

  const filteredHowToUse =
    selectedPeriodPlan?.how_to_use?.[i18n.language === 'id' ? 'id' : 'en'] !==
    ''
      ? selectedPeriodPlan?.how_to_use[i18n.language === 'id' ? 'id' : 'en']
      : '-';

  useEffect(() => {
    if (selectedPeriodPlan !== undefined) {
      void getVoucherList(selectedPeriodPlan.id);
    }
  }, [selectedPeriodPlan]);

  return (
    <>
      <PageGradient defaultGradient className="w-full">
        {loading ? (
          <div className="w-full flex justify-center h-fit mt-8">
            <div className="h-[60px]">
              <div className="animate-spinner w-16 h-16 border-8 border-gray-200 border-t-seeds-button-green rounded-full" />
            </div>
          </div>
        ) : (
          <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 mt-0 md:mt-4 font-poppins">
            <div className="col-span-2 w-full rounded-none px-2 pb-4 md:rounded-xl py-4 bg-white">
              <div className="md:mt-4 flex flex-row gap-2 items-center mb-4 w-full">
                <div className="rounded-3xl bg-white w-full border border-[#eaeaea] shadow-sm">
                  {packagePlanList.map(item => (
                    <button
                      key={item.name}
                      className={`text-sm md:text-base md:p-3 p-2 font-poppins w-4/12 rounded-full duration-100 ${
                        packagePlan === item.name
                          ? 'bg-[#3AC4A0] text-white'
                          : 'bg-[#f9f9f9] text-[#bdbdbd]'
                      } font-semibold`}
                      onClick={() => {
                        setPackagePlan(item.name);
                        setPeriodPlan(1);
                      }}
                    >
                      {item.name}
                      {item.badge !== null && (
                        <sup className="bg-[#ff3838] md:py-1 md:px-2 px-[3px] text-white rounded-3xl md:text-xs text-[10px] font-semibold md:ml-2">
                          {item.badge}
                        </sup>
                      )}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-4w-full flex flex-row gap-3 mb-4">
                {filteredPlanByTier
                  ?.sort((a, b) => a.duration_in_months - b.duration_in_months)
                  ?.map((item, index) => {
                    return (
                      <button
                        key={index}
                        className={`px-3 py-2 rounded-lg w-3/12 font-poppins text-xs ${
                          periodPlan === item.duration_in_months
                            ? 'bg-[#3ac4a0] text-white font-semibold'
                            : 'bg-transparent text-[#BDBDBD] border border-[#BDBDBD] font-normal'
                        }`}
                        onClick={() => {
                          setPeriodPlan(item.duration_in_months);
                        }}
                      >
                        {item.duration_in_months === 12
                          ? 1
                          : item.duration_in_months}{' '}
                        {item.duration_in_months === 1
                          ? `${t('seedsPlan.month')}`
                          : item.duration_in_months === 12
                          ? `${t('seedsPlan.year')} `
                          : `${t('seedsPlan.months')}`}
                      </button>
                    );
                  })}
              </div>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                {dataVoucher?.data?.map((item, index) => (
                  <div
                    className="bg-white rounded-2xl w-full h-28 grid grid-cols-4 px-1 border border-[#E5E5E5]"
                    key={index}
                  >
                    <div className="col-span-1 flex justify-center items-center">
                      {item?.voucher_type === 'Premium Circle' ||
                      item?.voucher_type === 'Premium Content' ? (
                        <HiUserGroup
                          size={50}
                          className="p-3 bg-gradient-to-t from-[#3AC4A0]/0 to-[#0DB48866]/40 text-[#3AC4A0] rounded-full"
                        />
                      ) : (
                        <IoGameController
                          size={50}
                          className="p-3 bg-gradient-to-t from-[#3AC4A0]/0 to-[#0DB48866]/40 text-[#3AC4A0] rounded-full"
                        />
                      )}
                    </div>
                    <div className="col-span-2 flex flex-col justify-center gap-1">
                      <Typography className="text-[#3AC4A0] font-poppins font-semibold text-base truncate">
                        {item?.name_promo_code}
                      </Typography>
                      <div
                        className="text-[#7C7C7C] font-poppins font-normal text-xs truncate"
                        dangerouslySetInnerHTML={{
                          __html:
                            item?.description?.[
                              i18n.language === 'id' ? 'id' : 'en'
                            ]
                        }}
                      />
                    </div>
                    <div className="col-span-1 flex justify-center items-center border-s-2 border-dashed text-[#7C7C7C]">
                      {item?.quantity === -1 ? (
                        <GoInfinity
                          size={30}
                          color="#D89918"
                          strokeWidth={1}
                          className="w-10"
                        />
                      ) : (
                        <Typography className="font-semibold font-poppins text-md">
                          {item?.quantity}
                        </Typography>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-span-1 w-full h-fit bg-white rounded-none md:rounded-xl p-6">
              <div>
                <div
                  className="flex justify-between flew-row items-center pb-3 border-b border-dashed cursor-pointer"
                  onClick={() => {
                    setShowTnc(!showTnc);
                  }}
                >
                  <div>{t('seedsPlan.button1')}</div>
                  <div>
                    <FaChevronRight />
                  </div>
                </div>
                <div
                  className="flex justify-between flew-row items-center py-3 border-b border-dashed cursor-pointer"
                  onClick={() => {
                    setHowToUse(!showHowToUse);
                  }}
                >
                  <div>{t('seedsPlan.button2')}</div>
                  <div>
                    <FaChevronRight />
                  </div>
                </div>
              </div>
              <div className="mt-10 pt-5 border-t-2 border-[#EDE3FE]">
                {selectedPeriodPlan !== undefined &&
                  activePlan !== undefined && (
                    <div className="flex flex-col gap-2">
                      {selectedPeriodPlan?.id !== activePlan.id && (
                        <>
                          <div className="text-[#7C7C7C] text-sm">
                            {t('seedsPlan.text2')}
                            <span
                              className={`ms-5 px-2 py-1 bg-[#ff3838] text-white rounded text-xs ${
                                selectedPeriodPlan?.is_promo ? '' : 'hidden'
                              }`}
                            >
                              {t('seedsPlan.text3')}
                            </span>
                          </div>
                          <div className="flex flex-row items-center justify-between">
                            <div>
                              <span
                                className={
                                  selectedPeriodPlan?.is_promo
                                    ? 'line-through'
                                    : ''
                                }
                              >
                                {selectedPeriodPlan?.price?.toLocaleString(
                                  'id-ID',
                                  {
                                    currency:
                                      userInfo?.preferredCurrency ?? 'IDR',
                                    style: 'currency',
                                    maximumFractionDigits: 0
                                  }
                                )}
                              </span>
                              /
                              {selectedPeriodPlan?.duration_in_months === 12
                                ? 1
                                : selectedPeriodPlan?.duration_in_months}{' '}
                              {selectedPeriodPlan.duration_in_months === 1
                                ? t('seedsPlan.month')
                                : selectedPeriodPlan.duration_in_months === 12
                                ? t('seedsPlan.year')
                                : t('seedsPlan.months')}
                            </div>
                            <div
                              className={`${
                                selectedPeriodPlan?.is_promo
                                  ? 'block'
                                  : 'hidden'
                              }`}
                            >
                              {selectedPeriodPlan?.price_after_promo?.toLocaleString(
                                'id-ID',
                                {
                                  currency:
                                    userInfo?.preferredCurrency ?? 'IDR',
                                  style: 'currency',
                                  maximumFractionDigits: 0
                                }
                              )}
                            </div>
                          </div>
                        </>
                      )}
                      <button
                        onClick={async () => {
                          if (selectedPeriodPlan?.id === activePlan.id) {
                            await router.push('/play');
                          } else {
                            await router.push(
                              `/seedsplan/payment?plan_id=${selectedPeriodPlan?.id}`
                            );
                          }
                        }}
                        className="w-full py-3 bg-[#3ac4a0] rounded-3xl font-semibold transform scale-100 hover:scale-105 transition-transform duration-300 my-2"
                      >
                        {selectedPeriodPlan?.id === activePlan.id
                          ? t('seedsPlan.button8')
                          : t('seedsPlan.button6')}
                      </button>
                    </div>
                  )}
              </div>
            </div>
          </div>
        )}
      </PageGradient>
      <TncSeedsplan
        isOpen={showTnc}
        onClose={() => {
          setShowTnc(!showTnc);
        }}
        tnc={filteredTnc as string}
      />
      <HowToUseSeedsplan
        isOpen={showHowToUse}
        onClose={() => {
          setHowToUse(!showHowToUse);
        }}
        howToUse={filteredHowToUse as string}
      />
    </>
  );
};

export default withAuth(ChangePlan);
