import SubmitButton from '@/components/SubmitButton';
import InlineText from '@/containers/tournament/payment/components/InlineText';
import { selectPromoCodeValidationResult } from '@/store/redux/features/promo-code';
import {
  type PaymentOption,
  type TeamBattleDetail
} from '@/utils/interfaces/team-battle.interface';
import { type UserInfo } from '@/utils/interfaces/tournament.interface';
import { Input, Typography } from '@material-tailwind/react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

interface Props {
  payment: PaymentOption;
  detailBattle: TeamBattleDetail;
  userInfo: UserInfo;
  newPromoCodeDiscount: number;
  coinsDiscount: number;
  setCoinsDiscount: React.Dispatch<React.SetStateAction<number>>;
  handlePayBattle: (
    type: string,
    paymentGateway: string,
    paymentMethod: string,
    totalAmount: number,
    phoneNumber?: string | undefined
  ) => Promise<void>;
}

const WalletForm: React.FC<Props> = ({
  payment,
  detailBattle,
  userInfo,
  newPromoCodeDiscount,
  handlePayBattle,
  coinsDiscount,
  setCoinsDiscount
}) => {
  const { t } = useTranslation();

  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [admissionFee, setAdmissionFee] = useState<number>(0);
  const [adminFee, setAdminFee] = useState<number>(0);
  const [totalFee, setTotalFee] = useState<number>(0);

  const [showOtherFees, setShowOtherFees] = useState<boolean>(false);
  const promoCodeValidationResult = useSelector(
    selectPromoCodeValidationResult
  );

  const translationId = 'PlayPayment.WalletForm';

  useEffect(() => {
    if (detailBattle !== undefined) {
      if (detailBattle?.admission_fee - newPromoCodeDiscount === 0) {
        setShowOtherFees(false);
      } else {
        setShowOtherFees(true);
      }
    }
  }, [detailBattle, newPromoCodeDiscount]);

  useEffect(() => {
    let _admissionFee = 0;
    let _adminFee = 0;
    let _totalFee = 0;
    let _discount = 0;

    _discount = payment.is_promo_available
      ? (showOtherFees ? payment.promo_price : 0) +
        (coinsDiscount > 0 ? coinsDiscount : 0)
      : coinsDiscount > 0
      ? coinsDiscount
      : 0;
    if (promoCodeValidationResult !== undefined) {
      _discount += newPromoCodeDiscount ?? 0;
    }

    if (detailBattle !== undefined) {
      _admissionFee = detailBattle?.admission_fee;
      _adminFee = payment?.admin_fee;
      _totalFee = parseFloat(
        `${(
          Number(_admissionFee) -
          Number(_discount) +
          (showOtherFees ? Number(_adminFee) : 0) +
          (showOtherFees ? Number(payment.service_fee) : 0)
        ).toFixed(2)}`
      );
    }

    if (coinsDiscount > 0) {
      setCoinsDiscount(Math.min(coinsDiscount, _admissionFee));
    } else {
      setCoinsDiscount(0);
    }

    setAdmissionFee(_admissionFee);
    setAdminFee(_adminFee);
    setTotalFee(_totalFee);
  }, [
    detailBattle,
    payment,
    coinsDiscount,
    setCoinsDiscount,
    promoCodeValidationResult,
    newPromoCodeDiscount,
    showOtherFees
  ]);

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
          value={phoneNumber}
          onChange={e => {
            let inputValue = e.target.value;
            inputValue = inputValue.replace(/[^0-9]/g, '');
            if (inputValue.charAt(0) === '0') {
              inputValue = '8' + inputValue.slice(1);
            }
            setPhoneNumber(inputValue);
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
        label={t(`${translationId}.teamBattleFee`)}
        value={`${userInfo?.preferredCurrency} ${admissionFee}`}
        className="mb-2"
      />
      {showOtherFees && (
        <>
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
        </>
      )}
      {promoCodeValidationResult !== undefined && promoCodeValidationResult !== 0 ? (
        <InlineText
          label={t(`${translationId}.promoCodeDiscountLabel`)}
          value={`- ${userInfo?.preferredCurrency} ${newPromoCodeDiscount ?? 0}`}
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
      <SubmitButton
        className="my-4"
        disabled={phoneNumber.length < 1}
        onClick={async () => {
          await handlePayBattle(
            payment?.payment_type,
            payment?.payment_gateway ?? '',
            payment?.payment_method,
            totalFee,
            phoneNumber
          );
        }}
      >
        {t(`${translationId}.button`)}
      </SubmitButton>
    </div>
  );
};

export default WalletForm;
