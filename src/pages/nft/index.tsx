import NFTTabs from '@/components/nft/tabs';
import withAuth from '@/helpers/withAuth';
import { connectWallet } from '@/lib/diamnet';
import { type Data, getNftList } from '@/repository/nft.repository';
import {
  Button,
  Card,
  Dialog,
  DialogBody,
  DialogHeader,
  Spinner
} from '@material-tailwind/react';
import Image from 'next/image';
import logo from 'public/assets/logo-seeds.png';
import checklist from 'public/assets/nft/checklist.svg';
import diam from 'public/assets/vector/diam.svg';
import React, { useCallback, useEffect, useState } from 'react';
import CurrencyInput from 'react-currency-input-field';
import { FiChevronRight, FiFilter, FiSearch, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';

const NFTDashboard: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [openFilter, setOpenFilter] = React.useState(false);
  const [data, setData] = useState<Data[]>();
  const [params, setParams] = useState<{
    page: number;
    search?: string;
    lowestPrice?: number;
    highestPrice?: number;
  }>({ page: 1 });
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingConnect, setLoadingConnect] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const handleOpen = (): void => {
    setOpen(!open);
  };
  const handleOpenFilter = (): void => {
    setOpenFilter(!openFilter);
  };
  const handleConnect = async (): Promise<void> => {
    try {
      setLoadingConnect(true);
      if ('diam' in window) {
        const res = await connectWallet();
        if (res?.status === 200) {
          handleOpen();
        }
      } else {
        throw new Error(
          'Please download Diam Wallet first, then refresh this tab'
        );
      }
    } catch (error: any) {
      toast.error(`${String(error)}`);
    } finally {
      setLoadingConnect(false);
    }
  };
  const handlePrice = ({
    lowestPrice,
    highestPrice
  }: {
    lowestPrice?: number;
    highestPrice?: number;
  }): void => {
    setParams(prev => ({
      ...prev,
      lowestPrice: lowestPrice !== undefined ? lowestPrice : prev.lowestPrice,
      highestPrice:
        highestPrice !== undefined ? highestPrice : prev.highestPrice,
      page: 1
    }));
    setHasMore(true);
  };

  const fetchScroll = useCallback(async () => {
    if (!loading && hasMore) {
      setLoading(true);
      try {
        const res = await getNftList({
          ...params,
          limit: 10,
          sort: 'created_desc',
          status: 'true'
        });
        const data = res.data;
        if (params.page === 1) {
          setData(res.data);
        } else if (params.page > 1) {
          setData(prev => [...((prev as Data[]) ?? []), ...(data ?? [])]);
        }
        if (
          res.metadata.current_page === res.metadata.total_page ||
          res.metadata.total_page === 0
        )
          setHasMore(false);
        setParams(prev => ({ ...prev, page: prev.page + 1 }));
      } catch (error) {
        toast.error(`Error fetching data: ${String(error)}`);
      } finally {
        setLoading(false);
      }
    }
  }, [params]);

  useEffect(() => {
    const handleScroll = (): void => {
      const isBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight;

      if (isBottom && hasMore && params.page > 1) {
        void fetchScroll();
      }
    };
    if (params.page === 1) {
      void fetchScroll();
    }
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [fetchScroll]);

  const PriceButton = ({
    lowestPrice,
    highestPrice,
    text
  }: {
    lowestPrice: number;
    highestPrice: number;
    text: string;
  }): JSX.Element => {
    return (
      <Button
        className={`${
          params?.lowestPrice === lowestPrice &&
          params?.highestPrice === highestPrice
            ? 'bg-[#DCFCE4] border border-[#3AC4A0] text-[#3AC4A0]'
            : 'bg-[#F9F9F9] border border-[#E9E9E9] text-neutral-medium'
        } font-normal font-poppins text-xs py-3 px-0`}
        onClick={() => {
          handlePrice({ lowestPrice, highestPrice });
        }}
      >
        {text}
      </Button>
    );
  };

  return (
    <section className="flex flex-col gap-2 md:gap-4">
      <Card className="md:p-5 rounded-none md:rounded-xl">
        <div className="flex flex-row-reverse md:flex-col gap-4 bg-gradient-to-b from-[#3AC4A0] to-[#94CCBD] w-full p-4 md:px-8 md:py-6">
          <Image src={logo} alt="seeds-logo" className="w-16 hidden md:block" />
          <div className="relative w-full">
            <FiSearch
              className="absolute top-1/2 -translate-y-1/2 md:left-3 right-3 w-4 h-4 md:w-5 md:h-5"
              color="#1A857D"
            />
            <input
              className="bg-[#F9F9F9] border border-[#E9E9E9] w-full rounded-xl h-10 md:ps-16 ps-3 md:pe-3 pe-8 py-3 outline-none font-poppins placeholder:font-normal placeholder:text-xs placeholder:text-[#BDBDBD]"
              placeholder="Search NFT"
              onChange={async e => {
                setParams(prev => ({
                  ...prev,
                  search: e.target.value,
                  page: 1
                }));
                setHasMore(true);
              }}
            />
          </div>
        </div>
      </Card>
      <Card className="flex flex-col gap-9 md:p-5 rounded-none md:rounded-xl">
        <div className="flex gap-2 items-center">
          <Button
            disabled={
              sessionStorage.getItem('diamPublicKey') !== null || loadingConnect
            }
            className={`flex justify-between items-center ${
              sessionStorage.getItem('diamPublicKey') !== null
                ? 'bg-[#F9F9F9] border-[#3AC4A0] disabled:opacity-100'
                : 'bg-[#94CCBD] border-[#4FE6AF]'
            } border px-4 py-1.5 md:px-7 md:py-2 rounded-[10px] w-full`}
            onClick={handleConnect}
          >
            <div className="flex items-center gap-5">
              {loadingConnect ? (
                <Spinner className=" h-12 w-12" />
              ) : (
                <Image src={diam} alt="diam-logo" />
              )}
              <p
                className={`font-poppins font-semibold ${
                  sessionStorage.getItem('diamPublicKey') !== null
                    ? `text-[#444444]`
                    : 'text-white'
                } text-sm`}
              >
                {sessionStorage.getItem('diamPublicKey') !== null
                  ? `${String(sessionStorage.getItem('diamBalance'))} DIAM`
                  : 'Connect to DIAM Wallet'}
              </p>
            </div>
            <FiChevronRight
              color="white"
              className={
                sessionStorage.getItem('diamPublicKey') !== null
                  ? 'hidden'
                  : 'block'
              }
              size={18}
            />
          </Button>
          <FiFilter
            size={32}
            className="bg-white border border-[#3AC4A0] text-[#3AC4A0] p-1 cursor-pointer rounded-lg active:scale-95 transition-all w-fit"
            onClick={handleOpenFilter}
          />
        </div>
        <NFTTabs data={data} />
      </Card>
      <Dialog handler={handleOpen} open={open} className="p-2.5" size="xs">
        <DialogBody className="flex flex-col gap-4 p-0 justify-center items-center">
          <Image src={checklist} alt="checklist" />
          <div className="flex flex-col gap-3.5 items-center justify-center">
            <p className="font-poppins font-semibold text-sm text-black">
              Successfull connect DIAM wallet !
            </p>
            <hr className="text-[#BDBDBD] w-full" />
            <p
              className="font-poppins font-semibold text-sm text-[#7555DA] cursor-pointer"
              onClick={handleOpen}
            >
              OK
            </p>
          </div>
        </DialogBody>
      </Dialog>
      <Dialog
        open={openFilter}
        handler={handleOpenFilter}
        size="sm"
        className="px-4 py-5 flex flex-col gap-4"
      >
        <DialogHeader className="p-0 flex justify-between items-center">
          <p className="font-semibold font-poppins text-neutral-medium text-base">
            Filter
          </p>
          <FiX
            className="text-neutral-medium cursor-pointer"
            size={16}
            onClick={handleOpenFilter}
          />
        </DialogHeader>
        <DialogBody className="flex flex-col gap-4 p-0">
          <div className="bg-[#F9F9F9] rounded-lg grid grid-cols-2 p-4 gap-6">
            <CurrencyInput
              onValueChange={(_, __, values) => {
                handlePrice({
                  lowestPrice: values?.float !== null ? values?.float : 0
                });
                // setParams(prev => ({
                //   ...prev,
                //   page: 1,
                //   lowestPrice: values?.float !== null ? values?.float : 0
                // }));
              }}
              disableAbbreviations
              suffix=" DIAM"
              className="bg-white h-[52px] rounded-xl font-normal font-poppins placeholder:text-[#BDBDBD] text-base text-center text-neutral-medium"
              placeholder="Lowest"
              value={params?.lowestPrice}
              defaultValue={params?.lowestPrice}
            />
            <CurrencyInput
              onValueChange={(_, __, values) => {
                handlePrice({
                  highestPrice: values?.float !== null ? values?.float : 0
                });

                // setParams(prev => ({
                //   ...prev,
                //   page: 1,
                //   highestPrice: values?.float !== null ? values?.float : 0
                // }));
              }}
              disableAbbreviations
              suffix=" DIAM"
              className="bg-white h-[52px] rounded-xl font-normal font-poppins placeholder:text-[#BDBDBD] text-base text-center text-neutral-medium"
              placeholder="Highest"
              value={params?.highestPrice}
              defaultValue={params?.highestPrice}
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <PriceButton
              lowestPrice={50}
              highestPrice={100}
              text="50-100 DIAM"
            />
            <PriceButton
              lowestPrice={100}
              highestPrice={150}
              text="100-150 DIAM"
            />
            <PriceButton
              lowestPrice={200}
              highestPrice={250}
              text="200-250 DIAM"
            />
          </div>
        </DialogBody>
      </Dialog>
    </section>
  );
};

export default withAuth(NFTDashboard);
