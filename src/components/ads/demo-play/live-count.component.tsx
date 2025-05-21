import DropdownPhone from '@/assets/my-profile/editProfile/DropdownPhone.svg';
import countries from '@/constants/countries.json';
import { handleChangePhoneNumber } from '@/helpers/authFormData';
import TrackerEvent from '@/helpers/GTM';
import {
  Button,
  Input,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList
} from '@material-tailwind/react';
import Image from 'next/image';
import cheerleader from 'public/assets/ads/cheerleader.png';
import icon from 'public/assets/ads/icon-demo-play.png';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const LiveCount = (): React.ReactElement => {
  const { t } = useTranslation();
  const [country, setCountry] = useState<number>(101);
  const [formData, setFormData] = useState<{
    phoneNumber: string;
    email: string;
  }>({
    phoneNumber: '',
    email: ''
  });

  const [change, setChange] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const handleSubmit = (): void => {
    setDisabled(true);
    TrackerEvent({
      event: 'SW_click_rate',
      data: {
        ...formData,
        phoneNumber:
          formData.phoneNumber.length !== 0
            ? `${countries[country].dialCode}${formData.phoneNumber}`
            : ''
      }
    });
  };
  const data = [
    {
      upper: '96%',
      lower: '',
      desc: t('demo.text26')
    },
    {
      upper: '9,317',
      lower: t('demo.text27'),
      desc: t('demo.text28')
    },
    {
      upper: '3,254',
      lower: t('demo.text29'),
      desc: t('demo.text30')
    },
    {
      upper: '3',
      lower: t('demo.text31'),
      desc: t('demo.text32')
    }
  ];
  return (
    <div className="flex flex-col justify-center items-center gap-6 md:gap-10 p-4 sm:p-16 w-full">
      <Image src={disabled ? cheerleader : icon} alt="icon" />
      <div className="flex flex-col justify-center items-center gap-2 md:gap-6 text-seeds-button-green">
        <p className="font-semibold text-base sm:text-xl md:text-3xl lg:text-4xl text-center">
          {disabled ? t('demo.text33') : t('demo.text34')}
        </p>
        <p
          className={`text-sm sm:text-base md:text-xl ${
            disabled ? 'w-2/3' : ''
          } text-center`}
        >
          {disabled ? t('demo.text35') : t('demo.text36')}
        </p>
      </div>
      <div className="flex flex-col w-full lg:w-1/2 justify-center items-center gap-2 md:gap-4">
        <p
          className={`${
            disabled
              ? 'text-[#BDBDBD] cursor-default'
              : 'text-[#5263F9] cursor-pointer'
          } underline font-semibold text-sm sm:text-base self-start`}
          onClick={() => {
            if (!disabled) {
              setChange(!change);
              setFormData({
                phoneNumber: '',
                email: ''
              });
            }
          }}
        >
          {t('demo.text37')} {change ? t('demo.text38') : 'email'}
        </p>
        <form
          className={`w-full flex flex-col sm:flex-row items-center justify-center ${
            disabled ? 'sm:bg-[#E9E9E9]' : 'sm:bg-seeds-button-green'
          } rounded-full p-0 sm:p-2 gap-4`}
          onSubmit={e => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          {change ? (
            <input
              type="email"
              disabled={disabled}
              className=" h-11 bg-[#F8F8F8] sm:bg-white w-full rounded-full focus:outline-none px-4 py-5 placeholder:text-[#BDBDBD] text-sm sm:text-base disabled:text-neutral-soft"
              placeholder={t('demo.text39') ?? 'Enter email address'}
              onChange={e => {
                setFormData({
                  ...formData,
                  email: e.target.value
                });
              }}
            />
          ) : (
            <div className="relative flex justify-center items-center bg-[#F8F8F8] sm:bg-white border-none w-full rounded-full h-full">
              <Menu placement="top-start">
                <MenuHandler>
                  <Button
                    disabled={disabled}
                    ripple={false}
                    variant="text"
                    className="absolute left-4 z-10 flex p-0 gap-2 items-center rounded-none hover:bg-transparent focus:border-none"
                  >
                    <img
                      src={`https://flagcdn.com/${countries[
                        country
                      ]?.code.toLowerCase()}.svg`}
                      alt={countries[country].name}
                      className="h-4 w-7 object-cover"
                    />

                    <p className="font-poppins font-normal text-base text-[#7C7C7C]">
                      {countries[country]?.dialCode}
                    </p>
                    <Image src={DropdownPhone} alt="DropdownPhone" />
                  </Button>
                </MenuHandler>
                <MenuList className="max-h-[20rem] max-w-[18rem] ">
                  {countries
                    .sort((a: any, b: any) => a.name.localeCompare(b.name))
                    .map(({ name, code }: any, index: number) => {
                      return (
                        <MenuItem
                          key={name}
                          value={name}
                          className="flex items-center gap-2"
                          onClick={() => {
                            setCountry(index);
                          }}
                        >
                          <img
                            src={`https://flagcdn.com/${
                              code.toLowerCase() as string
                            }.svg`}
                            alt={name}
                            className="h-5 w-5 object-cover"
                          />
                          {name}
                        </MenuItem>
                      );
                    })}
                </MenuList>
              </Menu>
              <Input
                disabled={disabled}
                type="text"
                variant="static"
                placeholder="85XXX"
                name="phoneNumber"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={13}
                value={formData.phoneNumber}
                onPaste={e => {
                  e.preventDefault();
                  return false;
                }}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  handleChangePhoneNumber(
                    e,
                    countries[country].dialCode.replace('+', ''),
                    formData,
                    setFormData
                  );
                }}
                labelProps={{
                  className:
                    '!bg-white !w-fit !h-fit !px-1 !ms-3 after:!border-none !font-semibold !font-poppins !text-base !text-[#262626] !leading-[10px]'
                }}
                className={`!border-none focus:!border-none !p-1.5 !font-poppins !font-normal !text-base !text-[#262626] !rounded-full leading-3 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none disabled:!text-neutral-soft ${
                  countries[country].dialCode.replace('+', '').length < 2
                    ? '!ps-24'
                    : countries[country].dialCode.replace('+', '').length < 3
                    ? '!ps-28'
                    : '!ps-32'
                }`}
              />
            </div>
          )}

          <button
            disabled={disabled}
            className={`${
              disabled ? 'bg-[#BDBDBD]' : 'bg-[#5263F9]'
            } rounded-full text-white px-3 py-2 font-poppins`}
            type="submit"
          >
            Subscribe
          </button>
        </form>
        <p className="text-sm text-[#5263F9] p-2 bg-[#DCE1FE4D] rounded-lg w-fit">
          {t('demo.text40')}
        </p>
      </div>
      <div className="flex flex-col w-full sm:w-[90%] justify-center gap-10 py-11 sm:px-4 sm:py-16 sm:border-[#5263F9] sm:border-[3px] rounded-3xl">
        <div className="flex flex-col justify-center items-center gap-4">
          <p className="font-semibold text-base sm:text-xl md:text-3xl text-neutral-medium">
            {t('demo.text41')}
          </p>
          <p className="text-sm sm:text-base text-center text-neutral-soft">
            {t('demo.text42')}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 w-full gap-4 xl:gap-0">
          {data.map((item, index) => (
            <div
              className={`flex justify-center ${
                index !== 3
                  ? index !== 1
                    ? 'md:border-r md:border-[#A9E0FF]'
                    : 'xl:border-r xl:border-[#A9E0FF]'
                  : ''
              } `}
              key={index}
            >
              <div className="flex flex-col gap-3 w-full md:w-[200px]">
                <p className="text-[#7B8BFC] text-5xl">
                  {item.upper}
                  <span className="text-base">{item.lower}</span>
                </p>
                <p className="text-sm sm:text-base text-neutral-medium">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiveCount;
