'use client';
import SubmitButton from '@/components/SubmitButton';
import { type RootState } from '@/store/premium-circle';
import { selectPromoCodeValidationResult } from '@/store/redux/features/promo-code';
import { Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import Divider from './components/Divider';
import InlineText from './components/InlineText';
interface VirtualAccountGuideProps {
  payment: any;
  dataPost: any;
  handlePay: (
    type: string,
    paymentGateway: string,
    paymentMethod: string,
    totalAmount: number,
    phoneNumber?: string | undefined
  ) => Promise<void>;
  newPromoCodeDiscount: number;
}

const VirtualAccountGuide = ({
  payment,
  dataPost,
  handlePay,
  newPromoCodeDiscount
}: VirtualAccountGuideProps): JSX.Element => {
  const { premiumCircleFee } = useSelector(
    (state: RootState) => state?.premiumCircle ?? {}
  );
  const { t } = useTranslation();
  const admissionFee = premiumCircleFee;
  const quizFee = (dataPost?.quiz?.admission_fee as number) ?? 0;
  const adminFee = (dataPost?.admin_fee as number) ?? 0;
  const translationsId = 'PlayPayment.VirtualAccountGuide';
  const bankName = payment?.payment_method?.split('_')[0];
  const quizAdminFee = (payment?.admin_fee as number) ?? 0;
  const quizServiceFee = (payment?.service_fee as number) ?? 0;
  const promoCodeValidationResult = useSelector(
    selectPromoCodeValidationResult
  );
  const discount = promoCodeValidationResult !== 0 ? newPromoCodeDiscount : 0;
  const totalFee = parseInt(
    `${
      (dataPost?.quiz !== undefined ? quizFee : admissionFee) +
      adminFee +
      quizAdminFee +
      quizServiceFee -
      discount
    }`
  );

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
      {
        dataPost?.quiz !== undefined
          ?
            <InlineText
              label={
                (dataPost?.quiz !== undefined)
                  ? 'Quiz Fee'
                  : t(`${translationsId}.admissionFeeLabel`)
              }
              value={`IDR ${quizFee}`}
              className="mb-2"
            />
          :
            <InlineText
              label={
                dataPost !== undefined
                  ? 'Circle Membership'
                  : t(`${translationsId}.admissionFeeLabel`)
              }
              value={`IDR ${admissionFee}`}
              className="mb-2"
            />
      }
      {adminFee > 0 && (
        <InlineText
          label={t(`${translationsId}.adminFeeLabel`)}
          value={`IDR ${adminFee}`}
          className="mb-2"
        />
      )}
      {promoCodeValidationResult !== undefined && promoCodeValidationResult !== 0 ? (
        <InlineText
          label={t(`${translationsId}.promoCodeDiscountLabel`)}
          value={`- IDR ${
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            newPromoCodeDiscount ?? 0
          }`}
          className="mb-2"
        />
      ) : null}
      {quizAdminFee > 0 && (
        <InlineText
          label={'Admin Fee'}
          value={`IDR ${quizAdminFee ?? 0}`}
          className="mb-2"
        />
      )}
      {quizServiceFee > 0 && (
        <InlineText
          label={'Service Fee'}
          value={`IDR ${quizServiceFee ?? 0}`}
          className="mb-2"
        />
      )}
      <Divider />
      <Typography className="text-3xl text-[#3AC4A0] font-semibold text-right">
        {`IDR ${totalFee}`}
      </Typography>
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
          provider: payment?.payment_method.split('_')[0]
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
            payment.payment_gateway,
            payment?.payment_method,
            totalFee
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
