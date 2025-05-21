import { type Data } from '@/repository/nft.repository';
import { Button, Dialog, DialogBody, Spinner } from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';
import CurrencyInput from 'react-currency-input-field';
import { FiX } from 'react-icons/fi';

const NFTDialog = ({
  open,
  data,
  error,
  disabled,
  setError,
  setPrice,
  handleOpen,
  handleChange,
  handleConfirm
}: {
  open: { open: boolean; state: number };
  data: Data;
  error: boolean;
  disabled: boolean;
  setError: React.Dispatch<React.SetStateAction<boolean>>;
  setPrice: React.Dispatch<React.SetStateAction<number>>;
  handleOpen: () => void;
  handleChange: (state: number) => void;
  handleConfirm: () => Promise<void>;
}): React.ReactElement => {
  const router = useRouter();
  const address = (input: string): string =>
    `${input?.substring(0, 7)}***${input?.substring(input.length - 7)}`;

  return (
    <Dialog
      open={open.open}
      handler={handleOpen}
      size="md"
      dismiss={{ outsidePress: false }}
      className="DialogNft"
    >
      {sessionStorage.getItem('diamPublicKey') === data.owner.wallet_address ? (
        <DialogBody className="p-5 flex flex-col gap-5 items-center justify-center">
          <div className="flex justify-between items-center w-full">
            <label
              htmlFor="price"
              className="font-semibold text-neutral-medium text-lg font-poppins
"
            >
              Enter Price
            </label>
            <FiX
              size={30}
              className={`text-neutral-soft ${
                disabled ? 'cursor-default' : 'cursor-pointer'
              }`}
              onClick={() => {
                if (!disabled) handleOpen();
              }}
            />
          </div>
          <div className="flex flex-col gap-2 w-full">
            <CurrencyInput
              id="price"
              disableAbbreviations
              placeholder="Enter Price"
              suffix=" DIAM"
              className="bg-[#F9F9F9] border border-neutral-soft placeholder:text-[#BDBDBD] placeholder:font-poppins placeholder:text-base placeholder:font-normal text-neutral-medium font-poppins text-base font-normal w-full rounded-lg p-3"
              onValueChange={(_, __, values) => {
                setError(false);
                setPrice(
                  values?.float !== null && values?.float !== undefined
                    ? values?.float
                    : 0
                );
              }}
            />
            {error && (
              <p className="text-red-500 text-sm font-poppins text-right">
                Price must be greater current price
              </p>
            )}
          </div>

          <div className="w-full flex gap-4">
            <Button
              className="w-full rounded-full bg-white font-poppins font-semibold text-sm normal-case text-[#3AC4A0] border border-[#3AC4A0]"
              onClick={handleOpen}
              disabled={disabled}
            >
              Cancel
            </Button>
            <Button
              className="w-full flex justify-center rounded-full text-white font-poppins font-semibold text-sm normal-case bg-[#3AC4A0]"
              onClick={handleConfirm}
              disabled={disabled}
            >
              {disabled ? <Spinner className="w-6 h-6" /> : 'Confirm'}
            </Button>
          </div>
        </DialogBody>
      ) : (
        <DialogBody className="p-0">
          {open.state === 0 ? (
            <div className="py-8 px-4 md:px-9 flex flex-col gap-4 items-center justify-center">
              <Image
                src={data.image_url}
                alt={data.name}
                width={160}
                height={160}
                className="rounded-xl"
              />
              <p className="pb-3.5 border-b border-[#BDBDBD] font-semibold text-black text-sm text-center font-poppins">
                {data.name}
              </p>
              <div className="w-full md:w-7/12 border border-[#E9E9E9] bg-[#F9F9F9] flex flex-col gap-6 p-4 rounded-lg font-poppins">
                <div className="flex justify-between items-center font-semibold text-sm">
                  <p className="text-[#BDBDBD]">Price</p>
                  <p className="text-neutral-medium">{data.price} DIAM</p>
                </div>
                <div className="flex justify-between items-center font-semibold text-sm">
                  <p className="text-[#BDBDBD]">Your Balance</p>
                  <p className="text-neutral-medium">
                    {sessionStorage.getItem('diamBalance')} DIAM
                  </p>
                </div>
              </div>
              <div className="w-full pt-4 px-0 md:px-4 flex gap-4">
                <Button
                  className="w-full rounded-full text-white font-poppins font-semibold text-sm normal-case bg-[#DD2525]"
                  onClick={handleOpen}
                >
                  Cancel
                </Button>
                <Button
                  className="w-full rounded-full text-white font-poppins font-semibold text-sm normal-case bg-[#3AC4A0]"
                  onClick={() => {
                    handleChange(1);
                  }}
                >
                  Buy
                </Button>
              </div>
            </div>
          ) : open.state === 1 ? (
            <div className="py-11 px-4 md:px-9 flex flex-col gap-4 items-center justify-center">
              <p className="pb-3.5 px-10 border-b border-[#BDBDBD] font-semibold text-black text-base text-center font-poppins">
                Send 1 Transaction
              </p>
              <div className="w-full md:w-fit border border-[#E9E9E9] bg-[#F9F9F9] grid grid-cols-2 gap-6 p-4 rounded-lg font-poppins font-semibold text-sm">
                <p className="text-[#BDBDBD]">From</p>
                <p className="text-[#8f8f8f] px-2 py-1.5 bg-[#f1f1f1] rounded-md text-center w-full">
                  {address(sessionStorage.getItem('diamPublicKey') ?? '')}
                </p>
                <p className="text-[#BDBDBD]">To</p>
                <p className="text-[#8f8f8f] px-2 py-1.5 bg-[#f1f1f1] rounded-md text-center w-full">
                  {address(data.owner.wallet_address)}
                </p>
                <p className="text-[#BDBDBD]">Type</p>
                <p className="text-[#fcfcfc] px-8 py-1.5 bg-[#9adfcd] rounded-md text-center w-full">
                  NFT BUY
                </p>
                <p className="text-[#BDBDBD]">Deposit</p>
                <p className="text-[#8f8f8f] px-7 py-1.5 bg-[#f1f1f1] rounded-md text-center w-full">
                  {data.price} DIAM
                </p>
              </div>
              <div className="w-full pt-4 px-0 md:px-4 flex flex-col-reverse md:flex-row gap-2  md:gap-4">
                <Button
                  className="w-full rounded-full text-white font-poppins font-semibold text-sm normal-case bg-[#DD2525]"
                  onClick={handleOpen}
                  disabled={disabled}
                >
                  Cancel
                </Button>
                <Button
                  className="w-full rounded-full flex justify-center text-white font-poppins font-semibold text-sm normal-case bg-[#3AC4A0]"
                  onClick={handleConfirm}
                  disabled={disabled}
                >
                  {disabled ? (
                    <Spinner className="w-6 h-6" />
                  ) : (
                    'Confirm Transaction'
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="py-11 px-4 md:px-9 flex flex-col gap-4 items-center justify-center">
              <p className="pb-3.5 border-b border-[#BDBDBD] font-semibold text-black text-base text-center font-poppins">
                Purchase Successful! 🎉
              </p>
              <Image
                src={data.image_url}
                alt={data.name}
                width={160}
                height={160}
                className="rounded-xl"
              />
              <div className="flex flex-col justify-center items-center">
                <p className="font-poppins font-normal text-sm text-neutral-medium">
                  Congratulations! Your NFT
                </p>
                <p className="font-poppins font-normal text-sm text-neutral-medium text-center md:w-10/12 w-full">
                  <span className="font-bold">{data.name}</span> has been
                  successfully purchased and saved to your profile. You can view
                  and manage it anytime.
                </p>
              </div>
              <div className="w-full pt-4 px-0 md:px-4 flex flex-col-reverse md:flex-row gap-2  md:gap-4">
                <Button
                  className="w-full rounded-full text-[#3AC4A0] font-poppins font-semibold text-sm normal-case border-[#3AC4A0] border bg-white"
                  onClick={() => {
                    router.back();
                  }}
                >
                  Back to Marketplace
                </Button>
                <Button
                  className="w-full rounded-full text-white font-poppins font-semibold text-sm normal-case bg-[#3AC4A0]"
                  onClick={async () => {
                    await router.push('/my-profile');
                  }}
                >
                  Go to Profile
                </Button>
              </div>
            </div>
          )}
        </DialogBody>
      )}
    </Dialog>
  );
};

export default NFTDialog;
