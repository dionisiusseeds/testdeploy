import { type PaymentOption } from '@/utils/interfaces/team-battle.interface';
import { type UserInfo } from '@/utils/interfaces/tournament.interface';
import { Radio, Typography } from '@material-tailwind/react';
import Image from 'next/image';

interface Props {
  option: PaymentOption;
  onChange: (paymentOption: PaymentOption) => void;
  currentOption: PaymentOption | undefined;
  userInfo: UserInfo | undefined;
}

const PaymentOptionComponent: React.FC<Props> = ({
  option,
  onChange,
  currentOption,
  userInfo
}) => {
  return (
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
        <Typography className="font-poppins text-[#27A590] text-xs mt-1">
          {`Admin fee ${userInfo?.preferredCurrency.toUpperCase() ?? ''} ${
            option?.admin_fee
          }`}
        </Typography>
      </div>
      <Radio
        id={option?.id}
        value={option?.id}
        name="paymentOption"
        className="rounded-xl border"
        color="teal"
        checked={option?.id === currentOption?.id}
        onChange={() => {
          onChange(option);
        }}
      />
    </label>
  );
};

export default PaymentOptionComponent;
