import NFTDialog from '@/components/nft/dialog';
import withAuth from '@/helpers/withAuth';
import {
  createBuyOffer,
  createSellOffer,
  createTrustline
} from '@/lib/diamnet';
import {
  type Data,
  getNftById,
  getNftTransaction,
  sellNft,
  type TransData
} from '@/repository/nft.repository';
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  Button,
  Card
} from '@material-tailwind/react';
import { Asset } from 'diamnet-sdk';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FiArrowLeft, FiChevronRight } from 'react-icons/fi';
import { toast } from 'react-toastify';

interface Column {
  fieldId: string;
  label: string;
  render: (value: TransData, index: number) => React.ReactElement;
}

const NFTDetail: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const transactionRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<{ open: boolean; state: number }>({
    open: false,
    state: 0
  });
  const [data, setData] = useState<Data>();
  const [transData, setTransData] = useState<TransData[]>();
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [detail, setDetail] = useState<boolean>(false);
  const [transaction, setTransaction] = useState<boolean>(false);
  const [price, setPrice] = useState<number>(0);

  const formattedAddress = (address: string): string => {
    return `${address.substring(0, 7)}***${address.slice(-7)}`;
  };
  const handleOpen = (): void => {
    setOpen({ open: !open.open, state: 0 });
  };

  const handleChange = (state: number): void => {
    setOpen(prev => ({ ...prev, state }));
  };

  const handleConfirm = async (): Promise<void> => {
    if (
      sessionStorage.getItem('diamPublicKey') !== null &&
      data !== undefined &&
      id !== undefined
    ) {
      try {
        setDisabled(true);
        if (
          sessionStorage.getItem('diamPublicKey') !== data.owner.wallet_address
        ) {
          const res = await createTrustline(
            String(sessionStorage.getItem('diamPublicKey')),
            data?.metadata_cid,
            data?.creator.wallet_address
          );
          if (res === 200) {
            const status = await createBuyOffer(
              String(id),
              String(sessionStorage.getItem('diamPublicKey')),
              {
                selling: Asset.native(),
                buying: new Asset(
                  data.metadata_cid,
                  data.creator.wallet_address
                ),
                buyAmount: '1',
                price: String(data.price)
              }
            );
            if (status === 200) {
              handleChange(2);
            } else {
              throw new Error('Error while buy asset');
            }
          } else {
            throw new Error('Error while create trustline asset');
          }
        } else {
          if (!Number.isNaN(price) && price !== 0 && price >= data.price) {
            const status = await createSellOffer(data.owner.wallet_address, {
              selling: new Asset(
                data.metadata_cid,
                data.creator.wallet_address
              ),
              buying: Asset.native(),
              amount: '1',
              price: String(price)
            });
            if (status === 200) {
              await sellNft(data.id, { price });
              await router.push('/nft');
            } else {
              throw new Error('Error while selling asset');
            }
          } else {
            setError(Number.isNaN(price) || price === 0 || price < data.price);
          }
        }
      } catch (error) {
        handleOpen();
      } finally {
        setDisabled(false);
      }
    }
  };

  const handleDataId = useCallback(async () => {
    const res = await getNftById(String(id));
    setData(res);
  }, [id]);

  const fetchData = useCallback(async () => {
    if (!loading && hasMore) {
      setLoading(true);
      try {
        const res = await getNftTransaction(String(id), { page, limit: 3 });
        const data = res.data;
        if (page === 1) {
          setTransData(res.data);
        } else if (page > 1) {
          setTransData(prev => [...(prev ?? []), ...(data ?? [])]);
        }
        if (
          res.metadata.currentPage === res.metadata.totalPage ||
          res.metadata.totalPage === 0
        )
          setHasMore(false);
        setPage(prevPage => prevPage + 1);
      } catch (error) {
        toast.error(`Error fetching data: ${String(error)}`);
      } finally {
        setLoading(false);
      }
    }
  }, [page]);

  useEffect(() => {
    const handleScroll = (): void => {
      if (transactionRef.current !== null) {
        const { scrollTop, scrollHeight, clientHeight } =
          transactionRef.current;
        if (clientHeight + scrollTop >= scrollHeight && !loading) {
          void fetchData();
        }
      }
    };

    if (page === 1) void fetchData();

    const currentRef = transactionRef.current;
    if (currentRef !== null) {
      currentRef.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (currentRef !== null) {
        currentRef.removeEventListener('scroll', handleScroll);
      }
    };
  }, [fetchData]);

  useEffect(() => {
    if (id !== undefined) {
      void handleDataId();
    }
  }, [handleDataId]);
  const columns: Column[] = [
    {
      fieldId: 'from',
      label: 'From',
      render: (value: TransData, index: number) => {
        const prevOwner =
          index > 0 ? transData?.[index - 1].owner : value.creator;
        return (
          <div className="flex gap-3">
            <Image
              src={String(prevOwner?.avatar)}
              alt={String(prevOwner?.name)}
              width={40}
              height={40}
              className="rounded-full"
            />
            <div>
              <p className="font-poppins font-semibold text-sm text-neutral-medium">
                {prevOwner?.name}
              </p>
              <p className="font-poppins font-normal text-xs text-neutral-soft">
                {formattedAddress(String(prevOwner?.wallet_address))}
              </p>
            </div>
          </div>
        );
      }
    },
    {
      fieldId: 'to',
      label: 'To',
      render: (value: TransData) => (
        <div className="flex gap-3">
          <Image
            src={value.owner.avatar}
            alt={value.owner.name}
            width={40}
            height={40}
            className="rounded-full"
          />
          <div>
            <p className="font-poppins font-semibold text-sm text-neutral-medium">
              {value.owner.name}
            </p>
            <p className="font-poppins font-normal text-xs text-neutral-soft">
              {formattedAddress(value.owner.wallet_address)}
            </p>
          </div>
        </div>
      )
    },
    {
      fieldId: 'price',
      label: 'Price',
      render: (value: TransData) => <p>{value.price} DIAM</p>
    },
    {
      fieldId: 'date',
      label: 'Date',
      render: (value: TransData) => {
        const formatDate = new Date(value.transaction_date).toLocaleDateString(
          'id-ID',
          { year: 'numeric', month: '2-digit', day: '2-digit' }
        );
        return <p>{formatDate}</p>;
      }
    }
  ];
  return (
    <>
      {data !== undefined && (
        <Card className="flex flex-col md:gap-4 p-0 md:p-5">
          <div className="flex justify-between items-center py-5 px-4 md:hidden font-semibold text-base text-neutral-medium font-poppins">
            <FiArrowLeft
              size={24}
              onClick={() => {
                router.back();
              }}
              className="cursor-pointer"
            />
            <p>Detail NFT</p>
            <div className="w-6 aspect-square" />
          </div>
          <img
            src={data?.image_url}
            alt={data?.name ?? ''}
            className="w-full object-cover aspect-[16/9] md:rounded-2xl"
          />
          <div className="flex flex-col gap-2 md:gap-4 p-3 md:p-0">
            {sessionStorage.getItem('diamPublicKey') !==
            data?.owner.wallet_address
              ? data.status === 'TRUE' && (
                  <Button
                    className="bg-[#3AC4A0] p-2.5 font-poppins font-semibold text-sm rounded-full normal-case"
                    onClick={handleOpen}
                  >
                    GET
                  </Button>
                )
              : data?.status === 'FALSE' && (
                  <Button
                    className="bg-[#3AC4A0] p-2.5 font-poppins font-semibold text-sm rounded-full normal-case"
                    onClick={handleOpen}
                  >
                    List for Sale
                  </Button>
                )}
            <div className="flex flex-col gap-3 bg-[#F3F4F8] border border-[#E9E9E9] rounded-lg py-2 px-3.5">
              <div className="flex flex-col gap-3.5">
                <div className="flex gap-3 items-center">
                  <div className="flex gap-1.5 items-center">
                    <Image
                      src={data?.owner.avatar}
                      width={20}
                      height={20}
                      alt="pic-profile"
                      className="rounded-full"
                    />
                    <p className="font-poppins font-semibold text-sm md:text-base text-[#3AC4A0]">
                      {data?.owner.name}
                    </p>
                  </div>
                  {sessionStorage.getItem('diamPublicKey') ===
                    data?.owner.wallet_address && (
                    <p
                      className={`${
                        data.status === 'TRUE'
                          ? 'bg-[#FFE9D4] text-[#B81516]'
                          : 'bg-[#E9E9E9] text-neutral-soft'
                      } rounded-full py-1 w-20 text-center font-semibold font-poppins text-xs`}
                    >
                      {data.status === 'TRUE' ? 'On Sale' : 'Not Listed'}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <p className="font-semibold font-poppins text-base md:text-lg text-neutral-medium">
                    {data?.name}
                  </p>
                  <p className="font-poppins font-normal text-xs md:text-sm text-neutral-soft">
                    Owned By {data?.owner.name}
                  </p>
                  <p className="bg-[#3AC4A0] py-0.5 px-6 font-poppins font-normal text-[10px] leading-4 md:text-xs text-[#1A857D] w-fit rounded">
                    {data?.price} DIAM
                  </p>
                </div>
              </div>
              <p className="font-poppins font-normal text-[10px] leading-4 md:text-xs text-neutral-medium text-justify">
                {data?.description}
              </p>
            </div>
            <Accordion
              open={detail}
              icon={
                <FiChevronRight
                  className={`${
                    detail ? 'rotate-90' : '-rotate-90 md:rotate-0'
                  } transition-all`}
                  size={24}
                />
              }
              className="py-2.5 ps-3.5 pe-5 bg-[#F3F4F8] border border-[#E9E9E9] rounded-lg"
            >
              <AccordionHeader
                onClick={() => {
                  setDetail(!detail);
                }}
                className="p-0 font-semibold text-lg text-neutral-medium font-poppins border-none"
              >
                Token Detail
              </AccordionHeader>
              <AccordionBody className="flex flex-col gap-2.5 md:gap-4 py-4 md:py-5">
                <div className="flex justify-between items-center">
                  <p className="text-neutral-medium text-xs md:text-sm font-normal font-poppins">
                    Asset Token
                  </p>
                  <u
                    className="rounded px-3 md:px-7 bg-[#4FE6AF] text-[#1A857D] font-poppins font-normal text-[10px]
              leading-4"
                  >
                    {data?.metadata_cid}
                  </u>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-neutral-medium text-xs md:text-sm font-normal font-poppins">
                    Creator Address
                  </p>
                  <u
                    className="rounded px-3 md:px-7 bg-[#4FE6AF] text-[#1A857D] font-poppins font-normal text-[10px]
              leading-4"
                  >
                    {formattedAddress(data?.creator.wallet_address)}
                  </u>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-neutral-medium text-xs md:text-sm font-normal font-poppins">
                    Owner Address
                  </p>
                  <u
                    className="rounded px-3 md:px-7 bg-[#4FE6AF] text-[#1A857D] font-poppins font-normal text-[10px]
              leading-4"
                  >
                    {formattedAddress(data?.owner.wallet_address)}
                  </u>
                </div>
              </AccordionBody>
            </Accordion>
            <Accordion
              open={transaction}
              icon={
                <FiChevronRight
                  className={`${
                    transaction ? 'rotate-90' : '-rotate-90 md:rotate-0'
                  } transition-all`}
                  size={24}
                />
              }
              className="py-2.5 ps-3.5 pe-5 bg-[#F3F4F8] border border-[#E9E9E9] rounded-lg"
            >
              <AccordionHeader
                onClick={() => {
                  setTransaction(!transaction);
                }}
                className="p-0 font-semibold text-lg text-neutral-medium font-poppins border-none"
              >
                Transaction Activity
              </AccordionHeader>
              <AccordionBody className="flex flex-col gap-2.5 md:gap-4 py-4 md:py-5">
                <div
                  className="overflow-auto max-w-full max-h-40"
                  ref={transactionRef}
                >
                  <table className="min-w-[600px] w-full">
                    <thead>
                      <tr>
                        {columns.map((column, index) => (
                          <th
                            key={index}
                            className="text-left font-poppins text-sm font-semibold p-2 text-neutral-medium"
                          >
                            {column.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {transData?.map((rowData, rowIndex) => (
                        <tr key={rowIndex}>
                          {columns.map((column, colIndex) => (
                            <td
                              key={colIndex}
                              className="p-2 font-poppins font-semibold text-neutral-medium text-sm"
                            >
                              {column.render(rowData, rowIndex)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </AccordionBody>
            </Accordion>
          </div>
        </Card>
      )}
      {data !== undefined && (
        <NFTDialog
          open={open}
          data={data}
          error={error}
          disabled={disabled}
          setError={setError}
          setPrice={setPrice}
          handleOpen={handleOpen}
          handleChange={handleChange}
          handleConfirm={handleConfirm}
        />
      )}
    </>
  );
};

export default withAuth(NFTDetail);
