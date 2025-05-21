/* eslint-disable @typescript-eslint/restrict-template-expressions */
'use client';
// import { useAppSelector } from '@/store/redux/store';
import { type UserInfo } from '@/utils/interfaces/tournament.interface';
import { Radio } from '@material-tailwind/react';
import Image from 'next/image';
import { type Payment } from './PaymentList';

interface IPaymentOption {
  option: Payment;
  onChange: (paymentOption: Payment) => void;
  currentValue: Current | undefined;
  userInfo: UserInfo;
}

interface Current {
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

const PaymentOption = ({
  option,
  onChange,
  currentValue,
  userInfo
}: IPaymentOption): JSX.Element => {
  return (
    <>
      {option?.payment_type === 'va' ? (
        option?.payment_method === 'BCA_VA' && (
          <label
            htmlFor={option?.id}
            className="flex justify-between rounded-xl border items-center p-2 pl-4"
          >
            <div>
              <Image
                src={option?.logo_url}
                width={200}
                height={200}
                className="w-auto h-[20px] object-contain object-[center_center]"
                alt={option?.payment_method}
              />
              <div className="text-[#27A590] text-xs mt-1">
                {`Admin fee ${userInfo?.preferredCurrency.toUpperCase()} ${
                  option?.admin_fee
                }`}
              </div>
            </div>
            <Radio
              id={option?.id}
              value={option?.id}
              name="paymentOption"
              className="rounded-xl border"
              color="teal"
              checked={option?.id === currentValue?.id}
              onChange={() => {
                onChange(option);
              }}
            />
          </label>
        )
      ) : (
        <label
          htmlFor={option?.id}
          className="flex justify-between rounded-xl border items-center p-2 pl-4"
        >
          <div>
            <Image
              src={option?.logo_url}
              width={200}
              height={200}
              className="w-auto h-[20px] object-contain object-[center_center]"
              alt={option?.payment_method}
            />
            <div className="text-[#27A590] text-xs mt-1">
              {`Admin fee ${userInfo?.preferredCurrency.toUpperCase()} ${
                option?.admin_fee
              }`}
            </div>
          </div>
          <Radio
            id={option?.id}
            value={option?.id}
            name="paymentOption"
            className="rounded-xl border"
            color="teal"
            checked={option?.id === currentValue?.id}
            onChange={() => {
              onChange(option);
            }}
          />
        </label>
      )}
    </>
  );
};

export default PaymentOption;
