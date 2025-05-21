import { payBattle } from '@/repository/team-battle.repository';
import { selectPromoCodeValidationResult, setPromoCodeValidationResult } from '@/store/redux/features/promo-code';
import { type StatusSubscription } from '@/utils/interfaces/subscription.interface';
import { type PaymentResult, type TeamBattleDetail } from '@/utils/interfaces/team-battle.interface';
import { type UserInfo } from '@/utils/interfaces/tournament.interface';
import { Button, Switch, Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import SubsSeedy from 'public/assets/subscription/subs-seedy.svg';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaChevronRight } from 'react-icons/fa';
import { IoAlertCircle } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import goldSeedsCoin from '../../../public/assets/images/goldHome.svg';
import PromoCodeButton from '../promocode/promoCode';
import Modal from '../ui/modal/Modal';

interface Props {
  onClose: () => void;
  userInfo: UserInfo;
  detailBattle: TeamBattleDetail;
  dataSubscription: StatusSubscription | null;
  totalAvailableCoins: number;
  promoCodeValidation: any;
  setPopUpJoinBattle: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalPayBattle: React.FC<Props> = ({
  onClose,
  userInfo,
  detailBattle,
  dataSubscription,
  totalAvailableCoins,
  promoCodeValidation,
  setPopUpJoinBattle
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const router = useRouter();
  const [useCoins, setUseCoins] = useState<boolean>(false);
  
  const promoCodeValidationResult = useSelector(
    selectPromoCodeValidationResult
  );

  const isStarted = (): boolean => {
    const playTime = detailBattle?.elimination_start;
    const timeStart = new Date(playTime).getTime();
    const timeNow = Date.now();

    return timeStart < timeNow;
  };
  
  const handlePayBattle = async (
    type: string,
    paymentGateway: string,
    paymentMethod: string,
    phoneNumber: string | undefined = userInfo?.phoneNumber
  ): Promise<void> => {
    try {
      if (
        type === 'ewallet' &&
        (phoneNumber === userInfo?.phoneNumber || phoneNumber === '')
      ) {
        toast.error('Please fill the phone number');
      }
      if (detailBattle !== undefined) {
        const response: PaymentResult = await payBattle({
          battleId: detailBattle?.id,
          paymentGateway,
          paymentMethod,
          phoneNumber: `+${phoneNumber}`,
          promoCode: promoCodeValidationResult?.response?.promo_code ?? '',
          isUseCoins: useCoins,
          successUrl: `${
            process.env.NEXT_PUBLIC_DOMAIN as string
          }/play/team-battle/${detailBattle.id}/`,
          cancelUrl: `${
            process.env.NEXT_PUBLIC_DOMAIN as string
          }/play/team-battle/${detailBattle.id}/`
        });

        if (response !== undefined) {
          if (isStarted()) {
            await router.push(`/play/team-battle/${detailBattle?.id}/stage`);
          } else {
            await router.push(`/play/team-battle/${detailBattle?.id}/waiting`);
          }
        }
      }
    } catch (error) {
      toast.error(`${error as string}`);
    }
  };

  const discount =
    promoCodeValidationResult !== 0
      ? promoCodeValidationResult?.response?.total_discount !== undefined
        ? promoCodeValidationResult?.response?.total_discount
        : detailBattle?.admission_fee - (promoCodeValidationResult?.response?.final_price ?? 0)
      : 0;

  const handleRedirectPayment = async (): Promise<void> => {
    if (promoCodeValidationResult !== 0 && promoCodeValidationResult !== undefined) {
      if ((detailBattle?.admission_fee - discount) === 0) {
        void handlePayBattle(
          '',
          '',
          '',
        );
      } else {
        await router.push(
          `/play/team-battle/${
            detailBattle?.id
          }/payment?useCoins=${useCoins.toString()}`
        );
      }
    } else {
      if (detailBattle?.admission_fee === 0) {
        onClose();
        setPopUpJoinBattle(true);
      } else {
        await router.push(
          `/play/team-battle/${
            detailBattle?.id
          }/payment?useCoins=${useCoins.toString()}`
        );
      }
    }
  };

  return (
    <Modal
      onClose={onClose}
      backdropClasses="z-40 fixed top-0 left-0 w-full h-screen bg-black/75 flex justify-start items-start"
      modalClasses="z-50 animate-slide-down fixed bottom-0 md:top-[50%] md:left-[20%] md:right-[-20%] xl:left-[35%] xl:right-[-35%] mt-[-15.35rem] w-full md:w-[40%] xl:w-[30%] h-[470px] p-4 lg:rounded-[40px] rounded-t-2xl shadow-[0 2px 8px rgba(0, 0, 0, 0.25)] bg-white"
    >
      <div className="w-full h-full flex flex-col justify-between py-2 px-5 gap-3">
        <div className="flex flex-col items-center justify-center gap-4">
          <Typography className="font-poppins font-semibold text-xl">
            {t('teamBattle.summaryPayment')}
          </Typography>
          <div className="flex flex-col items-center gap-2">
            <Typography className="font-poppins font-normal text-xl">
              {t('teamBattle.entranceFee')}
            </Typography>
            <div className="flex items-start gap-2">
              <Typography
                className={`${
                  promoCodeValidation !== 0 &&
                  localStorage.getItem('accessToken') !== null
                    ? 'font-poppins text-[#7C7C7C] line-through decoration-2 text-md'
                    : 'font-poppins text-black text-3xl font-bold'
                }`}
              >
                {detailBattle?.admission_fee === 0
                  ? t('quiz.free')
                  : detailBattle?.admission_fee?.toLocaleString('id-ID', {
                      currency: userInfo?.preferredCurrency ?? 'IDR',
                      style: 'currency'
                    })}
              </Typography>
              {promoCodeValidation !== 0 &&
                localStorage.getItem('accessToken') !== null && (
                  <div className="font-semibold text-xl">
                    {detailBattle?.admission_fee === 0
                      ? t('quiz.free')
                      : (
                          promoCodeValidation?.response?.final_price ?? 0
                        ).toLocaleString('id-ID', {
                          currency: userInfo?.preferredCurrency ?? 'IDR',
                          style: 'currency'
                        })}
                  </div>
                )}
            </div>
            <Typography className="flex items-center gap-2 font-poppins font-normal text-xs text-[#3C49D6]">
              <IoAlertCircle color="#3C49D6" size={16} />
              {`${t('teamBattle.yourCurrentCurrency')} : ${
                userInfo?.preferredCurrency
              }`}
            </Typography>
          </div>
        </div>
        <div className="w-full flex flex-col gap-2">
          {dataSubscription === null && (
            <div
              onClick={async () => await router.push('/seedsplan')}
              className="w-full bg-gradient-radial-subs shadow-subs-complete hover:shadow-subs-complete-hover flex justify-between items-center px-2 md:py-2 py-1 gap-2 rounded-xl cursor-pointer font-poppins duration-300 border border-white my-2"
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
          <div className="flex flex-col gap-2">
            <Typography className="font-poppins font-semibold text-base">
              {t('teamBattle.useSeedsCoin')}
            </Typography>
            <div className="flex flex-row items-center justify-between">
              <div className="flex flex-row items-center">
                <Image src={goldSeedsCoin} alt="Next" width={30} height={30} />
                <div className="text-xs text-[#7C7C7C] lg:px-2">
                  {totalAvailableCoins > 0
                    ? t('quiz.seedsCoin', { data: totalAvailableCoins })
                    : `Coin cannot be redeemed`}
                </div>
              </div>
              <div>
                <Switch
                  disabled={totalAvailableCoins <= 0}
                  checked={useCoins}
                  onChange={() => {
                    setUseCoins(!useCoins);
                    dispatch(setPromoCodeValidationResult(0));
                  }}
                />
              </div>
            </div>
          </div>
          {userInfo !== undefined && (detailBattle?.admission_fee ?? 0) > 0 && (
            <PromoCodeButton
              userInfo={userInfo}
              id={detailBattle?.id}
              spotType={'Paid Battle'}
              useCoins={useCoins}
            />
          )}
        </div>
        <Button
          onClick={handleRedirectPayment}
          className="w-full rounded-full bg-[#5E44FF] text-white font-poppins text-xl capitalize"
        >{`${
          detailBattle?.admission_fee === 0
            ? t('teamBattle.mainPage.join')
            : t('teamBattle.payButton')
        }`}</Button>
      </div>
    </Modal>
  );
};

export default ModalPayBattle;
