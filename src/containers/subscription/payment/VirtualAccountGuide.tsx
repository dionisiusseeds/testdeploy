'use client';
import SubmitButton from '@/components/SubmitButton';
import { getChatClock, getSubscriptionDate } from '@/helpers/dateFormat';
import LanguageContext from '@/store/language/language-context';
import { selectPromoCodeValidationResult } from '@/store/redux/features/promo-code';
import {
  type PlanI,
  type StatusSubscription
} from '@/utils/interfaces/subscription.interface';
import { Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { type Payment } from './PaymentList';
import Divider from './components/Divider';
import InlineText from './components/InlineText';

interface VirtualAccountGuideProps {
  payment: Payment;
  dataPlan: PlanI;
  handlePay: (
    type: string,
    paymentGateway: string,
    paymentMethod: string,
    totalAmount: number,
    phoneNumber: string
  ) => Promise<void>;
  subscriptionStatus: StatusSubscription | null;
  incomingSubscription: PlanI;
}

export interface PaymentStatus {
  orderId: string;
  transactionId: string;
  fraudStatus: string;
  transactionStatus: string;
  currency: string;
  merchantId: string;
  paymentGateway: string;
  itemName: string;
  itemId: string;
  quantity: number;
  grossAmount: number;
  paymentMethod: string;
  vaNumber: string;
  howToPayApi: string;
}

const VirtualAccountGuide = ({
  payment,
  dataPlan,
  handlePay,
  subscriptionStatus,
  incomingSubscription
}: VirtualAccountGuideProps): JSX.Element => {
  const { t } = useTranslation();
  const promoCodeValidationResult = useSelector(
    selectPromoCodeValidationResult
  );
  const discount =
    promoCodeValidationResult !== 0
      ? promoCodeValidationResult?.total_discount
      : 0;
  const admissionFee = dataPlan?.is_promo
    ? dataPlan?.price_after_promo ?? 0
    : dataPlan?.price ?? 0;
  const adminFee = payment?.admin_fee;
  const serviceFee = payment?.service_fee;
  const promoPrice = payment?.promo_price;
  const totalFee = parseInt(
    `${
      admissionFee +
      (adminFee +
        serviceFee -
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        (payment?.is_promo_available ? promoPrice : 0) -
        discount)
    }`
  );

  const translationsId = 'PlayPayment.VirtualAccountGuide';
  const translationId = 'PlayPayment.WalletForm';
  const bankName = payment?.payment_method?.split('_')[0];
  const languageCtx = useContext(LanguageContext);

  return (
    <div className="max-h-[70vh]">
      <div className="flex items-center">
        <Image
          src={payment?.logo_url}
          width={200}
          height={200}
          className="h-[20px] w-auto mr-2 object-contain"
          alt={payment?.payment_method}
        />
        <Typography className="text-[#201B1C] font-normal text-md">
          {t(`${translationsId}.bankName`, { bank: bankName })}
        </Typography>
      </div>
      <Divider />
      <InlineText
        label={
          dataPlan !== undefined
            ? 'Circle Membership'
            : t(`${translationsId}.admissionFeeLabel`)
        }
        value={`IDR ${admissionFee}`}
        className="mb-2"
      />
      <InlineText
        label={t(`${translationId}.serviceFeeLabel`)}
        value={`IDR ${serviceFee}`}
        className="mb-2"
      />
      <InlineText
        label={t(`${translationsId}.adminFeeLabel`)}
        value={`IDR ${adminFee}`}
        className="mb-2"
      />
      {payment.is_promo_available ? (
        <InlineText
          label={t(`${translationId}.adminFeeDiscountLabel`)}
          value={`- IDR ${promoPrice}`}
          className="mb-2"
        />
      ) : null}
      {promoCodeValidationResult !== undefined && promoCodeValidationResult !== 0 ? (
        <InlineText
          label={t(`${translationId}.promoCodeDiscountLabel`)}
          value={`- IDR ${
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            promoCodeValidationResult?.total_discount ?? 0
          }`}
          className="mb-2"
        />
      ) : null}
      <Divider />
      <Typography className="text-3xl text-[#3AC4A0] font-semibold text-right">
        {`IDR ${totalFee}`}
      </Typography>
      <Divider />
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
      <Divider />
      <Typography className="text-[#DD2525] font-normal text-sm mb-6">
        {t(`${translationsId}.note`)}
      </Typography>
      <Typography className="text-[#262626] font-normal">
        {t(`${translationsId}.instructionLabel`)}
      </Typography>
      <Divider />
      <Typography className="text-[#262626] font-normal mb-4">
        1.
        <a className="text-[#7C7C7C]"> {t(`${translationsId}.step1.1`)} </a>
        {t(`${translationsId}.step1.2`, {
          provider: bankName
        })}
      </Typography>
      <Typography className="text-[#262626] font-normal mb-4">
        2.
        <a className="text-[#7C7C7C]"> {t(`${translationsId}.step2.1`)} </a>
        {t(`${translationsId}.step2.2`)}
        <a className="text-[#7555DA]"></a>
        <a className="text-[#7C7C7C]"> {t(`${translationsId}.step2.3`)} </a>
        {t(`${translationsId}.step2.4`)}
      </Typography>
      <Typography className="text-[#262626] font-normal mb-4">
        3.
        <a className="text-[#7C7C7C]"> {t(`${translationsId}.step3.1`)} </a>
        {t(`${translationsId}.step3.2`)}
        <a className="text-[#7C7C7C]"> {t(`${translationsId}.step3.3`)} </a>
        <a className="text-[#7C7C7C]"> {t(`${translationsId}.step3.4`)} </a>
        {t(`${translationsId}.step3.5`)}
      </Typography>
      <Typography className="text-[#262626] font-normal mb-4">
        4.
        <a className="text-[#7C7C7C]">
          {' '}
          {t(`${translationsId}.step4.1`, { provider: bankName })}{' '}
        </a>
        {t(`${translationsId}.step4.2`)}
      </Typography>
      <SubmitButton
        onClick={async () => {
          await handlePay(
            payment?.payment_type,
            payment?.payment_gateway ?? 'DOKU',
            payment?.payment_method,
            totalFee,
            ''
          );
        }}
      >
        {t(`${translationsId}.button`)}
      </SubmitButton>
      <Divider />
    </div>
  );
};

export default VirtualAccountGuide;
