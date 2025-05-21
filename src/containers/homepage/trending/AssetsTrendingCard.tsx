import { isGuest } from '@/helpers/guest';
import {
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import {
  Avatar,
  Card,
  CardBody,
  Checkbox,
  Typography
} from '@material-tailwind/react';
import { useRouter } from 'next/router';
import React from 'react';

interface AssetsData {
  asset_id: string;
  asset_name: string;
  asset_icon: string;
  asset_ticker: string;
  asset_exchange: string;
  asset_type: string;
  asset_price: number;
  regular_percentage: number;
}

interface props {
  data: AssetsData;
  currency: string;
  handleSelectedAsset?: any;
  isDefaultChecked?: any;
  isClick?: boolean;
  playId?: string;
}

const AssetTrendingCard: React.FC<props> = ({
  data,
  currency,
  handleSelectedAsset,
  isDefaultChecked,
  isClick = false,
  playId
}) => {
  const router = useRouter();
  const handleArrow = (value: number): boolean => {
    if (value > 0) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <Card
      shadow={false}
      className={`w-full my-3 bg-[#F9F9F9] ${isClick ? 'cursor-pointer' : ''}`}
      onClick={
        isClick
          ? async () => {
              await router
                .push(
                  `${
                    isGuest()
                      ? '/auth'
                      : playId !== undefined
                      ? `/homepage/assets/${data.asset_id}?playId=${playId}`
                      : `/homepage/assets/${data.asset_id}`
                  }`
                )
                .catch(error => {
                  console.log(error);
                });
            }
          : () => {}
      }
    >
      <CardBody className="p-3 inline-block h-auto">
        <div className="flex flex-row items-center">
          <Avatar
            size="md"
            variant="circular"
            src={data.asset_icon}
            alt="logo"
          />
          <div className="flex ml-5 w-1/2 flex-col gap-0.5">
            <div className="flex flex-row">
              <Typography className="font-semibold text-base text-[#262626]">
                {data.asset_ticker}
              </Typography>
              {/* <Typography className="font-normal ml-1 text-base text-[#262626]">
                {data.currency}
              </Typography> */}
            </div>
            <Typography className="font-normal text-sm text-[#7C7C7C]">
              {data.asset_name}
            </Typography>
          </div>

          <div className="ml-auto flex flex-col gap-0.5">
            <div className="flex justify-end">
              <Typography className="font-semibold text-base text-[#262626]">
                {currency} {new Intl.NumberFormat().format(data.asset_price)}
              </Typography>
            </div>
            <div className="flex justify-end">
              <Typography
                className={`flex font-normal text-sm ${
                  handleArrow(data.regular_percentage)
                    ? 'text-[#3AC4A0]'
                    : 'text-red-500'
                }`}
              >
                {handleArrow(data.regular_percentage) ? (
                  <ArrowTrendingUpIcon
                    height={20}
                    width={20}
                    className="mr-2"
                  />
                ) : (
                  <ArrowTrendingDownIcon
                    height={20}
                    width={20}
                    className="mr-2"
                  />
                )}
                {`(${data.regular_percentage.toFixed(2).replace('-', '')}%)`}
              </Typography>
            </div>
          </div>
          {handleSelectedAsset !== undefined ? (
            <div>
              <Checkbox
                className="border-[#3AC4A0]"
                color="green"
                value={JSON.stringify(data)}
                onClick={handleSelectedAsset}
                defaultChecked={isDefaultChecked(data)}
              />
            </div>
          ) : null}
        </div>
      </CardBody>
    </Card>
  );
};

export default AssetTrendingCard;
