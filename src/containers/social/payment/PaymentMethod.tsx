/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import CCard from '@/components/CCard';
import Dialog from '@/components/ui/dialog/Dialog';
import { userDefault } from '@/containers/play/payment/PaymentList';
import PaymentOptions from '@/containers/play/payment/PaymentOptions';
import { getPaymentList } from '@/repository/payment.repository';
import { getUserInfo } from '@/repository/profile.repository';
import { promoValidate } from '@/repository/promo.repository';
import { postPaymentPremiumContent } from '@/repository/social.respository';
import { selectPromoCodeValidationResult } from '@/store/redux/features/promo-code';
import { type DataPost } from '@/utils/interfaces/social.interfaces';
import { type UserInfo } from '@/utils/interfaces/tournament.interface';
import { Button, Typography } from '@material-tailwind/react';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import ModalEWallet from './ModalEWallet';

export interface Payment {
  id: string;
  payment_method: string;
  logo_url: string;
  payment_type: string;
  admin_fee: number;
  is_promo_available: boolean;
  promo_price: number;
  service_fee: number;
  payment_gateway?: string;
}

interface props {
  data: DataPost;
}

const PaymentMethod: React.FC<props> = ({ data }) => {
  const router = useRouter();
  const [eWalletList, setEWalletList] = useState([]);
  const [qRisList, setQRisList] = useState([]);
  const [ccList, setCcList] = useState([]);
  const [virtualAccountList, setVirtualAccountList] = useState([]);
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [option, setOption] = useState<Payment>();
  const [openDialog, setOpenDialog] = useState(false);
  const { t } = useTranslation();
  const [newPromoCodeDiscount, setNewPromoCodeDiscount] = useState<number>(0);
  const promoCodeValidationResult = useSelector(
    selectPromoCodeValidationResult
  );

  const fetchUserInfo = async (): Promise<void> => {
    try {
      const response = await getUserInfo();
      setUserInfo(response);
    } catch (error) {
      toast.error(`${error as string}`);
    }
  };

  const fetchPaymentList = async (): Promise<void> => {
    try {
      const data = await getPaymentList();
      setEWalletList(data.type_ewallet);
      setQRisList(data.type_qris);
      setCcList(data.type_cc);
      setVirtualAccountList(data.type_va);
    } catch (error) {
      toast.error(`Error fetching Payment List: ${error as string}`);
    }
  };

  const handlePay = async (
    type: string,
    paymentGateway: string,
    paymentMethod: string,
    totalAmount: number,
    phoneNumber: string | undefined = userInfo?.phoneNumber
  ): Promise<void> => {
    try {
      if (
        type === 'ewallet' &&
        (phoneNumber === userInfo?.phoneNumber || phoneNumber === '')
      ) {
        toast.error(`Please fill the phone number`);
      }

      const response = await postPaymentPremiumContent({
        amount: totalAmount,
        payment_gateway: paymentGateway,
        payment_method: paymentMethod,
        phone_number: `+62${phoneNumber as string}`,
        item_id: data?.id,
        item_name: 'Social Post Premium',
        quantity: 1,
        name: userInfo?.name,
        email: userInfo?.email,
        promo_code:
          promoCodeValidationResult !== 0
            ? promoCodeValidationResult?.response?.promo_code
            : '',
        spot_type: 'Premium Content'
      });

      if (response) {
        if (response.payment_url !== '' && paymentMethod !== 'BNC_QRIS') {
          window.open(response.payment_url as string, '_blank');
        }
        const query =
          response.payment_url !== ''
            ? { paymentUrl: response.payment_url }
            : undefined;

        await router
          .replace(
            {
              pathname:
                `/social/payment/receipt/${response.order_id as string}` +
                `${paymentMethod?.includes('BNC') ? '/qris' : ''}`,
              query
            },
            undefined,
            { shallow: true }
          )
          .catch(error => {
            toast(`${error as string}`);
          });
      }
    } catch (error: any) {
      setOpenDialog(false)
      if (error?.response?.data?.message === "bad request, minimum transaction using VA is 10000") {
        toast.error(t('PlayPayment.VirtualAccountGuide.minimumPaymentError'));
      } else {
        toast.error(`${error as string}`);
      }
    }
  };

  useEffect(() => {
    void fetchUserInfo();
    void fetchPaymentList();
  }, []);

  useEffect(() => {
    void validatePromo();
  }, [data]);

  const validatePromo = useCallback(async (): Promise<void> => {
    if (promoCodeValidationResult) {
      const admissionFee = Number(data?.premium_fee ?? 0);

      const response = await promoValidate({
        promo_code: promoCodeValidationResult?.response?.promo_code,
        spot_type: 'Premium Content',
        item_price: admissionFee,
        item_id: data?.id,
        currency: userInfo?.preferredCurrency ?? 'IDR'
      });

      setNewPromoCodeDiscount(response?.total_discount);
    }
  }, [
    promoCodeValidationResult,
    data,
    promoValidate,
    userInfo,
    setNewPromoCodeDiscount
  ]);

  const handleOpenDialog = (value: boolean): void => {
    if (option?.payment_type === 'qris') {
      if (option?.payment_gateway === 'BNC') {
        void handlePay(
          option?.payment_type,
          'BNC',
          'BNC_QRIS',
          data.premium_fee
        );
      } else {
        void handlePay(
          option?.payment_type,
          'MIDTRANS',
          'OTHER_QRIS',
          data.premium_fee
        );
      }
    } else {
      setOpenDialog(value);
    }
  };

  return (
    <CCard className="flex p-8 mx-2 lg:mx-20 md:rounded-lg border-none rounded-none">
      <div className="flex flex-col justify-center">
        <Typography className="w-full px-8 text-center text-black text-lg font-semibold mb-3">
          {t('PlayPayment.title')}
        </Typography>
        <div className="">
          <PaymentOptions
            label="QRIS"
            options={qRisList}
            onChange={setOption}
            currentValue={option}
            userInfo={userInfo ?? userDefault}
          />
          <PaymentOptions
            label={t('PlayPayment.eWalletLabel')}
            options={eWalletList}
            onChange={setOption}
            currentValue={option}
            userInfo={userInfo ?? userDefault}
          />
          <PaymentOptions
            label={t('PlayPayment.creditCardLabel')}
            options={virtualAccountList}
            onChange={setOption}
            currentValue={option}
            userInfo={userInfo ?? userDefault}
          />
          <PaymentOptions
            label={t('PlayPayment.ccLabel')}
            options={ccList}
            onChange={setOption}
            currentValue={option}
            userInfo={userInfo ?? userDefault}
          />
          <Button
            disabled={option?.id == null}
            fullWidth
            className="bg-[#3AC4A0] rounded-2xl"
            onClick={() => {
              handleOpenDialog(true);
            }}
          >
            {t('PlayPayment.button')}
          </Button>
        </div>
      </div>
      <Dialog
        title={
          option?.payment_type === 'ewallet'
            ? t('PlayPayment.WalletForm.title', {
                wallet: option?.payment_method
              })
            : t('PlayPayment.VirtualAccountGuide.title', {
                bank: option?.payment_method?.split('_')[0]
              })
        }
        isOpen={openDialog}
        bottomSheetOnSmall
        handleClose={() => {
          setOpenDialog(false);
        }}
      >
        {userInfo !== undefined && option !== undefined && (
          <ModalEWallet
            payment={option}
            handlePay={handlePay}
            dataPost={data}
            newPromoCodeDiscount={newPromoCodeDiscount}
            userInfo={userInfo}
          />
        )}
      </Dialog>
    </CCard>
  );
};

export default PaymentMethod;
