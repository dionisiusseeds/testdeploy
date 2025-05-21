import { type PaymentOption } from '@/utils/interfaces/team-battle.interface';
import { type UserInfo } from '@/utils/interfaces/tournament.interface';
import { Typography } from '@material-tailwind/react';
import React from 'react';
import PaymentOptionComponent from './PaymentOption';

interface Props {
  currentOption: PaymentOption | undefined;
  options: PaymentOption[];
  labelOptions: string;
  onChange: (paymentOption: PaymentOption) => void;
  userInfo: UserInfo | undefined;
}

const PaymentOptions: React.FC<Props> = ({
  currentOption,
  options,
  labelOptions,
  onChange,
  userInfo
}) => {
  return (
    <div className="w-full mb-6">
      <Typography className="text-[#7C7C7C] text-sm font-semibold text-left mb-4">
        {labelOptions}
      </Typography>
      <div className="flex flex-col gap-4">
        {options?.map(option => (
          <PaymentOptionComponent
            key={option?.id}
            option={option}
            onChange={onChange}
            currentOption={currentOption}
            userInfo={userInfo}
          />
        ))}
      </div>
    </div>
  );
};

export default PaymentOptions;
