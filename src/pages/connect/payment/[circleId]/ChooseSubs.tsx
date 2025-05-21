import PromoCode from '@/components/promocode/promoCode';
import Button from '@/components/ui/button/Button';
import { standartCurrency } from '@/helpers/currency';
import useWindowInnerHeight from '@/hooks/useWindowInnerHeight';
import { getUserInfo } from '@/repository/profile.repository';
import { getSubscriptionStatus } from '@/repository/subscription.repository';
import { type RootState } from '@/store/premium-circle';
import { setMonth, setPrice } from '@/store/premium-circle/premiumCircleSlice';
import { setPromoCodeValidationResult } from '@/store/redux/features/promo-code';
import { type StatusSubscription } from '@/utils/interfaces/subscription.interface';
import { type UserInfo } from '@/utils/interfaces/tournament.interface';
import { Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { PaymentSVG } from 'public/assets/circle';
import SubsSeedy from 'public/assets/subscription/subs-seedy.svg';
import VoucherInvalid from 'public/assets/vector/voucher-invalid.svg';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaChevronRight } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

interface props {
  dataPost: any;
  setPages: any;
}

const ChooseSubs: React.FC<props> = ({ dataPost, setPages }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const dispatch = useDispatch();
  const monthSubscription = ['1 month', '3 month', '6 month', '12 month'];
  const height = useWindowInnerHeight();
  const { premiumCircleMonth } = useSelector(
    (state: RootState) => state?.premiumCircle ?? {}
  );
  const [dataSubscription, setDataSubscription] =
    useState<StatusSubscription | null>(null);

  const getSubscriptionPlanStatus = async (): Promise<void> => {
    try {
      const response = await getSubscriptionStatus();
      if (response !== undefined) {
        setDataSubscription(response);
      }
    } catch {}
  };

  useEffect(() => {
    fetchData()
      .then()
      .catch(() => {});
    void getSubscriptionPlanStatus();
  }, []);

  const fetchData = async (): Promise<void> => {
    try {
      const dataInfo = await getUserInfo();
      setUserInfo(dataInfo);
    } catch (error) {
      toast.error(`Error fetching data: ${error as string}`);
    }
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { value } = event.target;
    dispatch(setPromoCodeValidationResult(0));
    dispatch(setMonth(value));
  };

  const handleSubmit = (event: any): void => {
    event.preventDefault();
    if (dataPost?.type !== 'lifetime' && premiumCircleMonth === '') {
      setPages('chooseSubs');
    }
    setPages('terms');
  };

  const numberMonth = (): number => {
    if (premiumCircleMonth !== undefined && premiumCircleMonth.length > 0) {
      dispatch(
        setPrice(
          dataPost?.premium_fee * parseInt(premiumCircleMonth.substring(0, 2))
        )
      );
      return parseInt(premiumCircleMonth.substring(0, 2));
    } else {
      dispatch(setPrice(dataPost?.premium_fee));
      return 1;
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-col items-center gap-4">
        <Image src={PaymentSVG} alt="image" className="w-[192px] h-[192px]" />
        <div className="flex flex-col items-center gap-1">
          <Typography className="font-poppins max-w-[300px] font-semibold text-xl text-center line-clamp-2">
            {t('circle.payment.getAccessToUnlock')}
          </Typography>
          <Typography className="font-poppins max-w-[340px] font-light text-sm text-center">
            {t('circle.payment.enjoyUnlimitedAccess')}
          </Typography>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {dataSubscription === null && (
          <div
            onClick={async () => await router.push('/seedsplan')}
            className="w-full bg-gradient-radial-subs shadow-subs-complete hover:shadow-subs-complete-hover flex justify-between items-center px-2 md:py-2 py-1 gap-2 rounded-xl cursor-pointer font-poppins duration-300 border border-white mt-4 mb-3"
          >
            <div className="flex items-center justify-between gap-2">
              <div>
                <div className="absolute bg-gradient-to-b from-[#fdb458] to-[#fccc6e]/60 md:w-[35px] md:h-[35px] w-[50px] h-[50px] rounded-full"></div>
                <div className={'relative left-1'}>
                  <Image
                    src={SubsSeedy}
                    alt={'subscription-image'}
                    width={100}
                    height={100}
                    className="md:w-[35px] md:h-[35px] w-[50px] h-[50px]"
                  />
                </div>
              </div>
              <Typography className="text-white font-semibold font-poppins text-sm capitalize">
                {t('ProfilePage.subscriptionButton')}
              </Typography>
            </div>
            <div className="flex justify-center items-center h-[16px]">
              <FaChevronRight className="text-white" size={16} />
            </div>
          </div>
        )}

        {dataPost?.type === 'subscription' && premiumCircleMonth === '' ? (
          <div className="w-full ">
            <div className="border-[#BDBDBD] bg-white flex justify-start items-center border rounded-lg py-2 px-4 gap-2">
              <div className="w-[30px] h-[30px] flex justify-center items-center">
                <Image
                  src={VoucherInvalid}
                  alt="Voucher"
                  width={100}
                  height={100}
                  className="object-contain h-full w-full"
                />
              </div>
              <Typography className="text-[#BDBDBD] font-poppins flex justify-center items-center font-semibold">
                Voucher & Promo
              </Typography>
            </div>
          </div>
        ) : (
          <div className="w-full ">
            {userInfo !== undefined && (dataPost?.premium_fee ?? 0) > 0 && (
              <PromoCode
                userInfo={userInfo}
                id={dataPost?.id as string}
                spotType={'Premium Circle'}
              />
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 place-items-center">
          {dataPost?.type === 'lifetime' ? (
            <></>
          ) : (
            monthSubscription?.map((el, i) => (
              <label className="cursor-default" key={i}>
                <input
                  type="radio"
                  className="peer sr-only"
                  name="type"
                  onChange={handleInputChange}
                  value={el}
                />
                <div
                  className={`w-[150px] z-50 rounded-full ring-1 p-2 ${
                    el !== premiumCircleMonth
                      ? 'text-black cursor-pointer bg-white hover:text-white ring-neutral-soft transition-all hover:shadow  hover:ring-white hover:bg-neutral-soft hover:ring-offset-1'
                      : 'text-white cursor-not-allowed ring-white bg-seeds-green ring-offset-1'
                  }`}
                >
                  <div className="flex gap-2">
                    <div className="flex justify-center w-full gap-5 ">
                      <div className="flex flex-col justify-start">
                        <p className="text-sm font-light font-poppins">{el}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </label>
            ))
          )}
        </div>
        <div className="w-[350px] rounded-2xl border border-seeds-purple">
          <div className="bg-seeds-purple w-full p-2 rounded-t-xl pl-2 text-white">
            <h1 className="font-poppins text-xs font-medium">
              {dataPost?.type === 'lifetime'
                ? 'Lifetime Access'
                : 'Subscription'}
            </h1>
          </div>
          <div className="flex flex-col py-6 px-5 gap-2">
            <Typography className="text-center font-poppins text-base font-semibold">
              {userInfo?.preferredCurrency}{' '}
              {standartCurrency((dataPost?.premium_fee ?? 0) * numberMonth())}
            </Typography>
            <Typography className="text-center font-poppins text-sm font-normal">
              {t('circle.payment.getFullAccess')}
            </Typography>
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <Button
            props={{
              type: 'submit'
            }}
            className={`w-[350px] rounded-full py-3 px-6 font-poppins font-semibold leading-4 ${
              dataPost?.type !== 'lifetime' && premiumCircleMonth === ''
                ? 'bg-neutral-soft text-neutral-medium shadow-neutral-soft/20 hover:shadow-neutral-soft/40 shadow-md hover:shadow-lg'
                : 'bg-seeds-button-green text-white shadow-seeds-green/20 hover:shadow-seeds-green/40 focus:outline-seeds-button-green shadow-md hover:shadow-lg'
            } ${
              height !== undefined && height < 760 ? 'text-xs' : 'text-sm'
            } transition-all duration-300 active:opacity-80 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none`}
            label={'Next'}
          />
        </div>
      </form>
    </div>
  );
};
export default ChooseSubs;
