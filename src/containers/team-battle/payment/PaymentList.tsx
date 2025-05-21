/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import Loading from '@/components/popup/Loading';
import SubmitButton from '@/components/SubmitButton';
import Dialog from '@/components/ui/dialog/Dialog';
import PageGradient from '@/components/ui/page-gradient/PageGradient';
import { getPaymentList } from '@/repository/payment.repository';
import { getUserInfo } from '@/repository/profile.repository';
import { promoValidate } from '@/repository/promo.repository';
import { getTransactionSummary } from '@/repository/seedscoin.repository';
import {
  getBattleDetail,
  payBattle
} from '@/repository/team-battle.repository';
import { selectPromoCodeValidationResult } from '@/store/redux/features/promo-code';
import {
  type PaymentOption,
  type PaymentOptionList,
  type PaymentResult,
  type TeamBattleDetail
} from '@/utils/interfaces/team-battle.interface';
import { type UserInfo } from '@/utils/interfaces/tournament.interface';
import { Typography } from '@material-tailwind/react';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import PaymentOptions from './PaymentOptions';
import VirtualAccountGuide from './VirtualAccountGuide';
import WalletForm from './WalletForm';

const PaymentList: React.FC = (): JSX.Element => {
  const { t } = useTranslation();
  const router = useRouter();
  const { id, useCoins } = router.query;

  const [qRList, setQRList] = useState<PaymentOption[]>([]);
  const [ccList, setCCList] = useState<PaymentOption[]>([]);
  const [virtualList, setVirtualList] = useState<PaymentOption[]>([]);
  const [eWalletList, setEWalletList] = useState<PaymentOption[]>([]);
  const [option, setOption] = useState<PaymentOption>();

  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [detailBattle, setDetailBattle] = useState<TeamBattleDetail>();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false);
  const isUseCoins = useCoins === 'true';
  const [userCoins, setUserCoins] = useState<number>(0);
  const [newPromoCodeDiscount, setNewPromoCodeDiscount] = useState<number>(0);
  const promoCodeValidationResult = useSelector(
    selectPromoCodeValidationResult
  );

  const fetchUserInfo = async (): Promise<void> => {
    try {
      const response = await getUserInfo();
      setUserInfo(response);
    } catch (error) {
      toast.error(`Error fetching user info: ${error as string}`);
    }
  };

  const handleGetCoinsUser = async (): Promise<void> => {
    try {
      const response = await getTransactionSummary();
      setUserCoins(response?.data?.total_available_coins ?? 0);
    } catch (error) {
      toast.error(`Error fetching user info: ${error as string}`);
    }
  };

  const fetchDetailBattle = async (): Promise<void> => {
    try {
      const response = await getBattleDetail(id as string);
      setDetailBattle(response);
    } catch (error) {
      toast.error(`Error fetching battle detail: ${error as string}`);
    }
  };

  useEffect(() => {
    void fetchUserInfo();
  }, []);

  useEffect(() => {
    if (id !== undefined && useCoins !== undefined) {
      void fetchDetailBattle();
      if (useCoins === 'true') {
        void handleGetCoinsUser();
      }
    }
  }, [id, useCoins]);

  const fetchPaymentList = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const response: PaymentOptionList = await getPaymentList(
        userInfo?.preferredCurrency?.toUpperCase()
      );
      setQRList(
        response?.type_qris.filter(item =>
          detailBattle?.payment_method?.includes(item?.payment_method)
        )
      );
      setCCList(
        response?.type_cc.filter(item =>
          detailBattle?.payment_method?.includes(item?.payment_method)
        )
      );
      setVirtualList(
        response?.type_va?.filter(item =>
          detailBattle?.payment_method?.includes(item?.payment_method)
        )
      );
      setEWalletList(
        response?.type_ewallet?.filter(item =>
          detailBattle?.payment_method?.includes(item?.payment_method)
        )
      );
    } catch (error) {
      toast.error(`Error fetching payment list: ${error as string}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (detailBattle !== undefined && userInfo !== undefined) {
      void fetchPaymentList();
    }
  }, [userInfo, detailBattle]);

  useEffect(() => {
    void validatePromo();
  }, [detailBattle]);

  const validatePromo = useCallback(async (): Promise<void> => {
    if (
      promoCodeValidationResult !== undefined &&
      promoCodeValidationResult !== 0
    ) {
      if (detailBattle != null) {
        const admissionFee = Number(detailBattle?.admission_fee ?? 0);

        const response = await promoValidate({
          promo_code: promoCodeValidationResult?.response?.promo_code,
          spot_type: 'Paid Battle',
          item_price: admissionFee,
          item_id: detailBattle?.id,
          currency: userInfo?.preferredCurrency ?? 'IDR'
        });

        setNewPromoCodeDiscount(response?.total_discount);
      }
    }
  }, [
    promoCodeValidationResult,
    detailBattle,
    promoValidate,
    userInfo,
    setNewPromoCodeDiscount
  ]);

  const handlePayBattle = async (
    type: string,
    paymentGateway: string,
    paymentMethod: string,
    totalAmount: number,
    phoneNumber: string | undefined = userInfo?.phoneNumber
  ): Promise<void> => {
    try {
      setIsLoading(true);
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
          phoneNumber: `+62${phoneNumber as string}`,
          promoCode: promoCodeValidationResult?.response?.promo_code ?? '',
          isUseCoins,
          successUrl: `${
            process.env.NEXT_PUBLIC_DOMAIN as string
          }/play/team-battle/${detailBattle.id}/`,
          cancelUrl: `${
            process.env.NEXT_PUBLIC_DOMAIN as string
          }/play/team-battle/${detailBattle.id}/`
        });

        if (response !== undefined) {
          if (response?.payment_url !== '' && paymentMethod !== 'BNC_QRIS') {
            window.open(response?.payment_url as string, '_blank');
          }
          const query =
            response.payment_url !== ''
              ? { paymentUrl: response.payment_url }
              : undefined;

          await router
            .replace(
              {
                pathname:
                  `/play/team-battle/${id as string}/payment/receipt/${
                    response?.order_id as string
                  }` + `${paymentMethod?.includes('BNC') ? '/qris' : ''}`,
                query
              },
              undefined,
              { shallow: true }
            )
            .catch(error => {
              toast.error(`${error as string}`);
            });
        }
      }
    } catch (error: any) {
      setIsOpenDialog(false)
      if (error?.response?.data?.message === "bad request, minimum transaction using VA is 10000") {
        toast.error(t('PlayPayment.VirtualAccountGuide.minimumPaymentError'));
      } else {
        toast.error(`${error as string}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = (): void => {
    let _admissionFee = 0;
    let _adminFee = 0;
    let _totalFee = 0;

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (detailBattle) {
      _admissionFee = detailBattle?.admission_fee;
      _adminFee = 0;
      _totalFee = Number(_admissionFee) + Number(_adminFee);
    }

    if (option?.payment_type === 'qris') {
      if (option?.payment_gateway === 'BNC') {
        void handlePayBattle(
          option?.payment_type,
          'BNC',
          'BNC_QRIS',
          _totalFee
        );
      } else {
        void handlePayBattle(
          option?.payment_type,
          'MIDTRANS',
          'OTHER_QRIS',
          _totalFee
        );
      }
    } else if (option?.payment_type === 'cc') {
      void handlePayBattle(option?.payment_type, 'STRIPE', 'CC', _totalFee);
    } else {
      setIsOpenDialog(true);
    }
  };

  const renderLoading = (): JSX.Element => <Loading />;

  const renderContent = (): JSX.Element => (
    <div className="relative md:bg-[url('/assets/vector/purple-ellipse.svg')] bg-[white] bg-opacity-30 bg-no-repeat bg-left-top w-full h-full flex flex-col items-center pt-8 md:p-8 rounded-xl">
      <Typography className="w-full max-w-[600px] text-left px-8 md:text-center text-neutral-500 text-lg font-semibold mb-3">
        {t('PlayPayment.title')}
      </Typography>
      <div className="bg-[white] max-w-[600px] w-full h-full flex flex-col items-center p-8 rounded-xl">
        {qRList?.length > 0 && (
          <PaymentOptions
            labelOptions="QRIS"
            options={qRList}
            onChange={setOption}
            currentOption={option}
            userInfo={userInfo}
          />
        )}
        {eWalletList?.length > 0 && (
          <PaymentOptions
            labelOptions={t('PlayPayment.eWalletLabel')}
            options={eWalletList}
            onChange={setOption}
            currentOption={option}
            userInfo={userInfo}
          />
        )}
        {virtualList?.length > 0 && (
          <PaymentOptions
            labelOptions="Virtual Account"
            options={virtualList}
            onChange={setOption}
            currentOption={option}
            userInfo={userInfo}
          />
        )}
        {ccList?.length > 0 && (
          <PaymentOptions
            labelOptions={t('PlayPayment.creditCardLabel')}
            options={ccList}
            onChange={setOption}
            currentOption={option}
            userInfo={userInfo}
          />
        )}
        <SubmitButton
          disabled={option?.id == null}
          fullWidth
          onClick={onSubmit}
        >
          {t('PlayPayment.button')}
        </SubmitButton>
      </div>
    </div>
  );

  return (
    <PageGradient defaultGradient className="w-full md:px-20 my-10">
      {isLoading ? renderLoading() : renderContent()}
      <Dialog
        title={
          option?.payment_type === 'ewallet'
            ? t('PlayPayment.WalletForm.title', {
                wallet: option.payment_method
              })
            : t('PlayPayment.VirtualAccountGuide.title', {
                bank: option?.payment_method?.split('_')[0]
              })
        }
        isOpen={isOpenDialog}
        bottomSheetOnSmall
        handleClose={() => {
          setIsOpenDialog(false);
        }}
      >
        {option?.payment_type === 'ewallet' && (
          <>
            {detailBattle !== undefined && userInfo !== undefined && (
              <WalletForm
                payment={option}
                handlePayBattle={handlePayBattle}
                detailBattle={detailBattle}
                userInfo={userInfo}
                newPromoCodeDiscount={newPromoCodeDiscount}
                coinsDiscount={userCoins}
                setCoinsDiscount={setUserCoins}
              />
            )}
          </>
        )}
        {option?.payment_type === 'va' && (
          <>
            {detailBattle !== undefined && userInfo !== undefined && (
              <VirtualAccountGuide
                payment={option}
                handlePayBattle={handlePayBattle}
                detailBattle={detailBattle}
                newPromoCodeDiscount={newPromoCodeDiscount}
              />
            )}
          </>
        )}
      </Dialog>
    </PageGradient>
  );
};

export default PaymentList;
