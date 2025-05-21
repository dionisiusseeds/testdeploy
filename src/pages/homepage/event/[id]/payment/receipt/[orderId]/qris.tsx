import CountdownTimer from '@/components/payment/CountdownTimer';
import Loading from '@/components/popup/Loading';
import PageGradient from '@/components/ui/page-gradient/PageGradient';
import withAuth from '@/helpers/withAuth';
import { getPaymentDetail } from '@/repository/payment.repository';
import { setPromoCodeValidationResult } from '@/store/redux/features/promo-code';
import { Button, Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ArrowBackwardIcon } from 'public/assets/vector';
import Warning from 'public/assets/verif-failed.png';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BsArrowsFullscreen } from 'react-icons/bs';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

interface ReceiptDetail {
  currency: string;
  grossAmount: number;
  howToPayApi?: string;
  itemId: string;
  itemName: string;
  merchantId: string;
  orderId: string;
  paymentGateway: string;
  paymentMethod: string;
  quantity: number;
  transactionId: string;
  transactionStatus: string;
  vaNumber?: string;
  admin_fee: number;
  service_fee: number;
  promoPrice: number;
  seeds_coin: number;
  promo_price?: number;
  is_promo_available?: boolean;
  expired_at: string;
}

const SuccessPaymentPageQR: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const id = router.query.id as string;
  const orderId = router.query.orderId as string;
  const paymentUrl = router.query.paymentUrl as string;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [orderDetail, setOrderDetail] = useState<undefined | ReceiptDetail>();

  const fetchOrderDetail = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await getPaymentDetail(orderId);
      setOrderDetail(response);
    } catch (error) {
      toast.error(`Error fetching order detail: ${error as string}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchOrderDetail();
  }, [id, orderDetail?.howToPayApi]);

  useEffect(() => {
    dispatch(setPromoCodeValidationResult(0));
  }, [id, orderDetail]);

  const scanInstructions = [
    {
      id: '0',
      text: t('bnc.instructions.text1')
    },
    {
      id: '1',
      text: t('bnc.instructions.text2')
    },
    {
      id: '2',
      text: t('bnc.instructions.text3')
    },
    {
      id: '3',
      text: t('bnc.instructions.text4')
    }
  ];

  const handleOpen = (): void => {
    window.open(paymentUrl, '_blank');
  };

  return (
    <div>
      {isLoading && <Loading />}
      <PageGradient
        defaultGradient
        className="relative overflow-hidden h-full flex flex-col items-center sm:p-0 pb-16 w-full"
      >
        <div className="w-full rounded-xl px-4 md:px-8 py-4 mb-4 relative bg-white">
          <Image
            src={ArrowBackwardIcon}
            alt="icon"
            width={24}
            height={24}
            className="text-white cursor-pointer hover:scale-110 duration-150 absolute left-4 md:left-8 m-auto"
            onClick={async () => {
              const query = paymentUrl !== '' ? { paymentUrl } : undefined;
              await router
                .replace(
                  {
                    pathname: `/homepage/event/${id}/payment/receipt/${orderId}`,
                    query
                  },
                  undefined,
                  { shallow: true }
                )
                .catch(error => {
                  toast(`${error as string}`);
                });
            }}
          />
          <Typography className="text-xl font-semibold text-[#262626] text-center">
            {t('bnc.payment')}
          </Typography>
        </div>
        <div className="w-full bg-white rounded-xl p-4">
          <div className="flex flex-col justify-center items-center">
            <Typography className="text-lg font-semibold text-[#262626] text-center">
              {t('bnc.scanDescription')}
            </Typography>
            {orderDetail?.transactionStatus !== 'EXPIRED' ? (
              paymentUrl?.length > 0 ? (
                <div className="relative" onClick={handleOpen}>
                  <div className="w-full md:w-[400px] h-auto mt-4 shadow-sm rounded-md overflow-hidden">
                    <Image
                      src={paymentUrl}
                      alt="AVATAR"
                      width={1000}
                      height={1000}
                      className="w-full h-full"
                    />
                  </div>
                  <div className="absolute right-4 bottom-4 bg-white w-[30px] h-[30px] flex justify-center items-center cursor-pointer rounded-md opacity-60 hover:opacity-90 duration-300">
                    <BsArrowsFullscreen />
                  </div>
                </div>
              ) : (
                <div className="bg-white animate-pulse rounded-lg overflow-hidden mt-4 shadow-sm">
                  <div className="w-full md:w-[300px] h-[200px] bg-gray-300" />
                </div>
              )
            ) : (
              <div className="flex flex-col justify-center items-center mb-4">
                <div className="w-[200px] md:w-[250px] h-auto mt-4 rounded-md overflow-hidden">
                  <Image
                    src={Warning}
                    alt="AVATAR"
                    width={1000}
                    height={1000}
                    className="w-full h-full"
                  />
                </div>
                <Typography className="font-poppins font-semibold text-lg mt-4 text-center">
                  {t('bnc.expired.text1')}
                </Typography>
                <Typography className="font-poppins font-normal text-center">
                  {t('bnc.expired.text2')}
                </Typography>
              </div>
            )}
            {orderDetail?.transactionStatus !== 'EXPIRED' && (
              <>
                <Typography className="font-poppins font-normal text-center mt-8">
                  {t('bnc.completePayment')}
                </Typography>
                {orderDetail !== undefined && (
                  <CountdownTimer
                    deadline={
                      orderDetail !== undefined ? orderDetail?.expired_at : ''
                    }
                  />
                )}
                <div className="flex flex-col justify-around items-start gap-2 my-8">
                  {scanInstructions?.map((instructions, index) => (
                    <div
                      key={index}
                      className="flex justify-center items-center gap-4"
                    >
                      <Typography className="flex justify-center items-center text-white w-[30px] h-[30px] bg-seeds-button-green font-poppins font-semibold rounded-full">
                        {index + 1}
                      </Typography>
                      <Typography className="w-[240px] md:w-[300px] font-poppins">
                        {instructions.text}
                      </Typography>
                    </div>
                  ))}
                </div>
                <Button
                  disabled={
                    orderDetail?.transactionStatus !== 'SUCCEEDED' &&
                    orderDetail?.transactionStatus !== 'SUCCESS' &&
                    orderDetail?.transactionStatus !== 'SETTLEMENT'
                  }
                  className="w-full md:w-[300px] text-sm font-semibold bg-seeds-button-green rounded-full capitalize"
                  onClick={async () => {
                    if (
                      orderDetail?.transactionStatus === 'SUCCESS' ||
                      orderDetail?.transactionStatus === 'SETTLEMENT' ||
                      orderDetail?.transactionStatus === 'SUCCEEDED'
                    ) {
                      void router.replace(
                        `/homepage/event/${id}/${orderId}/booking-success-details`
                      );
                    } else {
                      const query =
                        paymentUrl !== '' ? { paymentUrl } : undefined;
                      await router
                        .replace(
                          {
                            pathname: `/homepage/event/${id}/payment/receipt/${orderId}`,
                            query
                          },
                          undefined,
                          { shallow: true }
                        )
                        .catch(error => {
                          toast(`${error as string}`);
                        });
                    }
                  }}
                >
                  {t('bnc.done')}
                </Button>
              </>
            )}
            {orderDetail?.transactionStatus === 'EXPIRED' && (
              <Button
                className="w-full md:w-[300px] text-sm font-semibold bg-seeds-button-green rounded-full capitalize mb-4"
                onClick={async () => {
                  await router.push(`/homepage/event`);
                }}
              >
                {t('bnc.repeat')}
              </Button>
            )}
          </div>
        </div>
      </PageGradient>
    </div>
  );
};

export default withAuth(SuccessPaymentPageQR);
