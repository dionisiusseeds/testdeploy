/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable-next-line @typescript-eslint/restrict-plus-operands */
'use client';
import SubmitButton from '@/components/SubmitButton';
import { getChatClock, getSubscriptionDate } from '@/helpers/dateFormat';
import { getTransactionSummary } from '@/repository/seedscoin.repository';
import LanguageContext from '@/store/language/language-context';
import {
  type PlanI,
  type StatusSubscription,
  type UserInfo
} from '@/utils/interfaces/subscription.interface';
import { Input, Typography } from '@material-tailwind/react';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { type Payment } from './PaymentList';
import InlineText from './components/InlineText';

interface WalletFormProps {
  payment: Payment;
  handlePay: (
    type: string,
    paymentGateway: string,
    paymentMethod: string,
    totalAmount: number,
    phoneNumber: string
  ) => Promise<void>;
  dataPlan: PlanI;
  userInfo: UserInfo;
  subscriptionStatus: StatusSubscription | null;
  incomingSubscription: PlanI;
}

const WalletForm = ({
  payment,
  handlePay,
  dataPlan,
  userInfo,
  subscriptionStatus,
  incomingSubscription
}: WalletFormProps): JSX.Element => {
  const translationId = 'seedsPlan.WalletForm';
  const { t } = useTranslation();
  const [phone, setPhone] = useState('');
  const [admissionFee, setAdmissionFee] = useState(0);
  const [adminFee, setAdminFee] = useState(0);
  const [totalFee, setTotalFee] = useState(0);
  const [coinsDiscount, setCoinsDiscount] = useState(0);
  const router = useRouter();
  const languageCtx = useContext(LanguageContext);

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const handleGetCoinsUser = async () => {
    const useCoins = router.query.useCoins;
    if (useCoins === 'true') {
      const resCoins = await getTransactionSummary();
      setCoinsDiscount(resCoins?.data?.total_available_coins || 0);
    }
  };

  useEffect(() => {
    void handleGetCoinsUser();
  }, []);

  useEffect(() => {
    let _admissionFee = 0;
    let _adminFee = 0;
    let _totalFee = 0;
    let _discount = 0;

    if (payment.is_promo_available) {
      _discount = payment.promo_price + (coinsDiscount > 0 ? coinsDiscount : 0);
    } else {
      _discount = coinsDiscount > 0 ? coinsDiscount : 0;
    }

    _admissionFee = dataPlan?.is_promo
      ? dataPlan?.price_after_promo ?? 0
      : dataPlan?.price ?? 0;
    _adminFee = payment.admin_fee;
    _totalFee = parseFloat(
      `${(
        Number(_admissionFee) +
        Number(_adminFee) +
        Number(payment.service_fee) -
        Number(_discount)
      ).toFixed(2)}`
    );

    if (coinsDiscount > 0) {
      setCoinsDiscount(Math.min(coinsDiscount, _admissionFee));
    } else {
      setCoinsDiscount(0);
    }

    setAdmissionFee(_admissionFee);
    setAdminFee(_adminFee);
    setTotalFee(_totalFee);
  }, [dataPlan, payment, coinsDiscount]);

  const renderPhoneInput = (): JSX.Element => (
    <div className="mb-2">
      <Typography className="mb-2 text-[#B9B7B7] font-semibold">
        {t(`${translationId}.phoneLabel`, { wallet: payment?.payment_method })}
      </Typography>
      <div className="flex mb-2 border-[#E0E0E0] border rounded-xl">
        <Typography className="font-normal text-[#B9B7B7] flex h-10 items-center pr-0 pl-3">
          +62
        </Typography>
        <Input
          type="tel"
          placeholder={t(`${translationId}.phonePlaceholder`) ?? ''}
          className="!border-0 font-normal"
          labelProps={{
            className: 'before:content-none after:content-none'
          }}
          containerProps={{
            className: 'min-w-0'
          }}
          value={phone}
          onChange={e => {
            let inputValue = e.target.value;
            inputValue = inputValue.replace(/[^0-9]/g, '');
            if (inputValue.charAt(0) === '0') {
              inputValue = '8' + inputValue.slice(1);
            }
            setPhone(inputValue);
          }}
          onPaste={e => {
            e.preventDefault();
            return false;
          }}
          maxLength={13}
        />
      </div>
    </div>
  );

  return (
    <div className="">
      {renderPhoneInput()}
      <InlineText
        label={t(`${translationId}.admissionFeeLabel`)}
        value={`${userInfo?.preferredCurrency} ${admissionFee}`}
        className="mb-2"
      />
      <InlineText
        label={t(`${translationId}.serviceFeeLabel`)}
        value={`${userInfo?.preferredCurrency} ${payment.service_fee}`}
        className="mb-2"
      />
      <InlineText
        label={t(`${translationId}.adminFeeLabel`)}
        value={`${userInfo?.preferredCurrency} ${adminFee}`}
        className="mb-2"
      />
      {payment.is_promo_available ? (
        <InlineText
          label={t(`${translationId}.adminFeeDiscountLabel`)}
          value={`- ${userInfo?.preferredCurrency} ${payment.promo_price}`}
          className="mb-2"
        />
      ) : null}
      {coinsDiscount > 0 && (
        <InlineText
          label={t(`${translationId}.seedsCoin`)}
          value={`- ${userInfo?.preferredCurrency} ${coinsDiscount}`}
          className="mb-2"
        />
      )}
      <hr />
      <Typography className="text-3xl text-[#3AC4A0] font-semibold text-right my-6">
        {`${userInfo?.preferredCurrency} ${totalFee}`}
      </Typography>
      <hr />
      {subscriptionStatus !== null && (
        <div className="bg-[#DADADA] rounded-lg p-4">
          <Typography className="text-[#261679] font-poppins text-md">
            {t('seedsPlan.payment.information.text1')} (
            <strong>
              {`
                    ${
                      subscriptionStatus?.active_subscription?.subscription_type
                        .charAt(0)
                        .toUpperCase() +
                      subscriptionStatus?.active_subscription?.subscription_type
                        .slice(1)
                        .toLowerCase()
                    }
                    ${subscriptionStatus?.active_subscription?.duration}
                    ${
                      subscriptionStatus?.active_subscription?.duration > 1
                        ? t('seedsPlan.payment.information.text7')
                        : t('seedsPlan.payment.information.text6')
                    }
                  `}
            </strong>
            ){t('seedsPlan.payment.information.text2')}
            {languageCtx.language === 'ID'
              ? getSubscriptionDate(
                  new Date(
                    subscriptionStatus?.active_subscription?.ended_at ??
                      '2024-12-31T23:59:00Z'
                  ),
                  'id-ID'
                )
              : getSubscriptionDate(
                  new Date(
                    subscriptionStatus?.active_subscription?.ended_at ??
                      '2024-12-31T23:59:00Z'
                  ),
                  'en-US'
                )}
            {t('seedsPlan.payment.information.text5')}
            {getChatClock(
              subscriptionStatus?.active_subscription?.ended_at ??
                '2024-12-31T23:59:00Z'
            )}
            .{t('seedsPlan.payment.information.text3')} (
            <strong>
              {`
                    ${
                      incomingSubscription?.name?.charAt(0).toUpperCase() +
                      incomingSubscription?.name.slice(1).toLowerCase()
                    }
                    ${incomingSubscription?.duration_in_months}
                    ${
                      incomingSubscription?.duration_in_months > 1
                        ? t('seedsPlan.payment.information.text7')
                        : t('seedsPlan.payment.information.text6')
                    }
                  `}
            </strong>
            ){t('seedsPlan.payment.information.text4')}
            {languageCtx.language === 'ID'
              ? getSubscriptionDate(
                  new Date(
                    subscriptionStatus?.active_subscription?.ended_at ??
                      '2024-12-31T23:59:00Z'
                  ),
                  'id-ID'
                )
              : getSubscriptionDate(
                  new Date(
                    subscriptionStatus?.active_subscription?.ended_at ??
                      '2024-12-31T23:59:00Z'
                  ),
                  'en-US'
                )}
            {t('seedsPlan.payment.information.text5')}
            {getChatClock(
              subscriptionStatus?.active_subscription?.ended_at ??
                '2024-12-31T23:59:00Z'
            )}
            .
          </Typography>
        </div>
      )}
      <hr />
      <SubmitButton
        className="my-4"
        disabled={phone.length < 1}
        onClick={async () => {
          await handlePay(
            payment?.payment_type,
            payment?.payment_gateway ?? '',
            payment?.payment_method,
            totalFee,
            phone
          );
        }}
      >
        {t(`${translationId}.button`)}
      </SubmitButton>
    </div>
  );
};

export default WalletForm;
