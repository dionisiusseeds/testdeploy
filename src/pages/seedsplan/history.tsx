import hystory from '@/assets/seedsplan/hystory.svg';
import PageGradient from '@/components/ui/page-gradient/PageGradient';
import { getUserInfo } from '@/repository/profile.repository';
import { getTransactionHistory } from '@/repository/subscription.repository';
import { type UserInfo } from '@/utils/interfaces/earning.interfaces';
import { type TransactionHistoryRes } from '@/utils/interfaces/subscription.interface';
import { Button, Typography } from '@material-tailwind/react';
import moment from 'moment';
import Image from 'next/image';
import { useRouter } from 'next/router';
import GoldPlan from 'public/assets/subscription/gold-plan.svg';
import SilverPlan from 'public/assets/subscription/silver-plan.svg';
import { ArrowBackwardIcon } from 'public/assets/vector';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const HistoryTransaction: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [dataTransaction, setDataTransaction] =
    useState<TransactionHistoryRes>();

  useEffect(() => {
    fetchData()
      .then()
      .catch(() => {});
  }, []);

  const fetchData = useCallback(async (): Promise<void> => {
    try {
      const transactionHistory = await getTransactionHistory();
      setDataTransaction(transactionHistory);
      const dataInfo = await getUserInfo();
      setUserInfo(dataInfo);
    } catch (error) {
      toast(`Error fetching data user: ${error as string}`);
    }
  }, []);

  return (
    <PageGradient defaultGradient className="w-full">
      <div className="bg-white p-5 rounded-[18px] shadow-lg">
        <div className="flex items-center justify-center relative">
          <Image
            src={ArrowBackwardIcon}
            alt="arrow-backward-icon"
            onClick={() => {
              router.back();
            }}
            className="cursor-pointer absolute left-0"
          />
          <Typography className="font-semibold text-xl text-left">
            {t('seedsPlan.history.transactionHistory')}
          </Typography>
        </div>
        {dataTransaction?.data !== null ? (
          dataTransaction?.data?.map(item => (
            <div
              key={item.id}
              className="flex justify-between items-center p-3 my-2 bg-[#F9F9F9] rounded-xl hover:shadow-md duration-300"
            >
              <div className="flex flex-row items-center gap-6">
                <div>
                  <div
                    className={`absolute w-[50px] h-[50px] rounded-full bg-gradient-to-b ${
                      item?.subscription_type === 'GOLD'
                        ? 'from-[#b5dda4] to-[#FEEBA6]'
                        : 'from-[#a8dbce] to-[#d7e5e1]'
                    }`}
                  ></div>
                  <div className="relative left-2 top-1">
                    <Image
                      src={
                        item?.subscription_type === 'GOLD'
                          ? GoldPlan
                          : SilverPlan
                      }
                      alt="Plan Subscription"
                      width={35}
                      height={35}
                    />
                  </div>
                </div>
                <div className="flex-col">
                  <p className="font-semibold text-sm capitalize">
                    {item?.subscription_type.toLocaleLowerCase()} Plan
                  </p>
                  <p className="text-xs text-[#BDBDBD]">
                    {moment(item?.created_at).format('dddd, DD MMM YYYY')}
                  </p>
                </div>
              </div>
              <div className="flex-col">
                <p className="text-xs text-[#BDBDBD]">
                  {item?.paid_price.toLocaleString('id-ID', {
                    currency: userInfo?.preferredCurrency ?? 'IDR',
                    style: 'currency'
                  })}
                </p>
                <p
                  className={`capitalize text-sm font-semibold ${
                    item?.payment_status?.toLowerCase() === 'success'
                      ? 'text-green-500'
                      : 'text-red-500'
                  }`}
                >
                  {item?.payment_status?.toLocaleLowerCase()}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="p-3 my-2 bg-[#F9F9F9] rounded-xl items-center text-center justify-center">
            <Image
              src={hystory}
              width={500}
              height={500}
              alt="seedsplan"
              className="w-[223px] h-[223px] mx-auto pt-12"
            />
            <Typography className="text-[#262626] font-poppins font-semibold text-xl text-center">
              {t('seedsPlan.history.transactionHistoryEmpty')}
            </Typography>
            <Typography className="text-[#7C7C7C] font-poppins text-lg mt-1 text-center">
              {t('seedsPlan.history.noTransaction')}
            </Typography>
            <Button
              className={`w-[345px] lg:h-[42px] h-[42px] mx-auto mt-8 justify-center rounded-full text-white text-sm font-semibold font-poppins bg-[#3AC4A0]`}
            >
              {t('seedsPlan.history.back')}
            </Button>
          </div>
        )}
      </div>
    </PageGradient>
  );
};

export default HistoryTransaction;
