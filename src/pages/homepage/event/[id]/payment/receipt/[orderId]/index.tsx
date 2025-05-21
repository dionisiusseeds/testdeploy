import Loading from '@/components/popup/Loading';
import CardGradient from '@/components/ui/card/CardGradient';
import PageGradient from '@/components/ui/page-gradient/PageGradient';
import VirtualAccountStep from '@/components/VirtualAccountStep';
import { CeklisCircle } from '@/constants/assets/icons';
import withAuth from '@/helpers/withAuth';
import useWindowInnerWidth from '@/hooks/useWindowInnerWidth';
import { type ReceiptDetail } from '@/pages/play/payment/receipt/[orderId]';
import {
  getPaymentDetail,
  getPaymentList
} from '@/repository/payment.repository';
import { formatCurrency } from '@/utils/common/currency';
import { Button, Card, Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Pending } from 'public/assets/circle';
import { EventBookInfo } from 'public/assets/vector';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

interface PaymentList {
  admin_fee: number;
  id: string;
  is_active: boolean;
  is_priority: boolean;
  is_promo_available: boolean;
  logo_url: string;
  minimum_withdrawal: number;
  payment_gateway: string;
  payment_method: string;
  payment_type: string;
  promo_price: number;
  service_fee: number;
}

interface QRList {
  admin_fee: number;
  id: string;
  is_active: boolean;
  is_priority: boolean;
  is_promo_available: boolean;
  logo_url: string;
  minimum_withdrawal: number;
  payment_gateway: string;
  payment_method: string;
  payment_type: string;
  promo_price: number;
  service_fee: number;
}

interface OrderDetail {
  paymentMethod: string;
}

const SuccessPaymentPage: React.FC = () => {
  const width = useWindowInnerWidth();
  const router = useRouter();
  const id = router.query.id as string;
  const orderId = router.query.orderId as string;
  const paymentUrl = router.query.paymentUrl as string;
  const [isLoadingOrder, setIsLoadingOrder] = useState<boolean>(false);
  const [isLoadingPayment, setIsLoadingPayment] = useState<boolean>(false);
  const [isLoadingHowToPay, setIsLoadingHowToPay] = useState<boolean>(false);
  const [eWalletList, setEWalletList] = useState([]);
  const [orderDetail, setOrderDetail] = useState<undefined | ReceiptDetail>();
  const [qRisList, setQRisList] = useState<QRList[]>([]);
  const [vaList, setVaList] = useState<QRList[]>([]);
  const { t } = useTranslation();

  const fetchOrderDetail = async (): Promise<void> => {
    try {
      setIsLoadingOrder(true);
      const response = await getPaymentDetail(orderId);
      setOrderDetail(response);
    } catch (error) {
      toast.error(`Error fetching order detail ${error as string}`);
    } finally {
      setIsLoadingOrder(false);
    }
  };

  const fetchPaymentList = async (): Promise<void> => {
    try {
      setIsLoadingPayment(true);
      const data = await getPaymentList();
      setQRisList(data.type_qris);
      setEWalletList(data.type_ewallet);
      setVaList(data.type_va);
    } catch (error) {
      toast.error(`Error fetching order detail ${error as string}`);
    } finally {
      setIsLoadingPayment(false);
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const fetchOrderDetailAndRepeat = async (): Promise<void> => {
      await fetchOrderDetail();

      timer = setTimeout(() => {
        void (async () => {
          await fetchOrderDetail();
        })();
      }, 5000);
    };

    void fetchOrderDetailAndRepeat();
    void fetchPaymentList();

    return (): void => {
      clearTimeout(timer);
    };
  }, []);

  const getSelectedPayment = (
    eWalletList: PaymentList[],
    vaList: PaymentList[],
    qRisList: PaymentList[],
    orderDetail: OrderDetail | undefined
  ): PaymentList[] => {
    if (orderDetail === null) {
      return [];
    }

    const paymentSelected: PaymentList[] = [
      ...eWalletList?.filter((el) => el?.payment_method === orderDetail?.paymentMethod),
      ...vaList?.filter((el) => el?.payment_method === orderDetail?.paymentMethod),
      ...qRisList?.filter((el) => el?.payment_method === orderDetail?.paymentMethod),
    ];

    return paymentSelected.length > 0 ? paymentSelected : [];
  };

  const paymentSelected = getSelectedPayment(eWalletList, vaList, qRisList, orderDetail);

  const handleViewQR = async (): Promise<void> => {
    const query = paymentUrl !== '' ? { paymentUrl } : undefined;

    await router
      .replace(
        {
          pathname:
            `/homepage/event/${id}/payment/receipt/${orderId}` +
            `${
              orderDetail?.paymentMethod?.includes('BNC') ?? false
                ? '/qris'
                : ''
            }`,
          query
        },
        undefined,
        { shallow: true }
      )
      .catch(error => {
        toast(`${error as string}`);
      });
  };

  return (
    <div className="pt-10">
      {isLoadingOrder && isLoadingPayment && isLoadingHowToPay && <Loading />}
      <PageGradient
        defaultGradient
        className="relative overflow-hidden h-full flex flex-col items-center sm:p-0 sm:pb-16 w-full"
      >
        <CardGradient
          defaultGradient
          className={`relative overflow-hidden w-full h-full sm:min-w-[90%] sm:rounded-[18px] sm:min-h-[36rem] bg-white px-0 md:px-4 py-8 ${
            width !== undefined && width < 370
              ? 'min-h-[38rem]'
              : width !== undefined && width < 400
              ? 'min-h-[45rem]'
              : width !== undefined && width < 415
              ? 'min-h-[48rem]'
              : ''
          }`}
        >
          <div className="flex items-center justify-center rounded-xl w-full">
            <Card
              className="p-9 border-none rounded-xl shadow-none w-full md:w-2/3 xl:w-1/2 h-full"
              style={{
                background:
                  'linear-gradient(to bottom, #3AC4A0 55%, #FFFFFF 50%)'
              }}
            >
              <div className="flex items-center justify-center mb-4 mt-3">
                {orderDetail?.transactionStatus !== 'SUCCESS' &&
                orderDetail?.transactionStatus !== 'SETTLEMENT' &&
                orderDetail?.transactionStatus !== 'SUCCEEDED' ? (
                  <div className="rounded-full bg-white/20 p-4">
                    <div className="bg-white rounded-full ">
                      <Image
                        src={Pending}
                        alt="AVATAR"
                        width={40}
                        height={40}
                      />
                    </div>
                  </div>
                ) : (
                  <Image
                    src={CeklisCircle.src}
                    alt="AVATAR"
                    width={80}
                    height={80}
                  />
                )}
              </div>
              <Typography className="text-sm font-normal text-white text-center">
                {orderDetail?.transactionStatus === 'SUCCESS' ||
                orderDetail?.transactionStatus === 'SETTLEMENT' ||
                orderDetail?.transactionStatus === 'SUCCEEDED'
                  ? ''
                  : t('seedsEvent.payment.receipt.pending')}
              </Typography>
              <Typography className="text-2xl font-semibold text-white text-center">
                {orderDetail?.transactionStatus === 'SUCCESS' ||
                orderDetail?.transactionStatus === 'SETTLEMENT' ||
                orderDetail?.transactionStatus === 'SUCCEEDED'
                  ? t('seedsEvent.payment.receipt.successful')
                  : `${orderDetail?.currency ?? 'IDR'} ${formatCurrency(
                      orderDetail?.grossAmount ?? 0
                    )}`}
              </Typography>
              <Typography className="text-sm font-normal text-white text-center">
                {orderDetail?.transactionStatus === 'SETTLEMENT' &&
                  t('seedsEvent.payment.receipt.recurringSaved')}
              </Typography>

              <Card className="p-5 mt-8 bg-white w-full">
                <Typography className="text-sm font-semibold text-[#BDBDBD] text-center">
                  {orderDetail?.vaNumber !== undefined
                    ? t('seedsEvent.payment.receipt.virtualNumber')
                    : t('seedsEvent.payment.receipt.paymentMethod')}
                </Typography>
                {paymentSelected?.length > 0 && (
                  <div className="flex items-center justify-center mb-9 mt-3">
                    <Image
                      src={paymentSelected[0]?.logo_url}
                      alt="AVATAR"
                      width={90}
                      height={90}
                    />
                  </div>
                )}
                <hr className="border-t-2 border-dashed" />
                <div className="flex justify-between relative bottom-3 z-10">
                  <div className="bg-[#3AC4A0] h-6 rounded-full w-6 -mx-8 outline-none" />
                  <div className="bg-[#3AC4A0] h-6 rounded-full w-6 -mx-8 outline-none" />
                </div>

                {/* Event Fee */}
                {orderDetail?.currency !== undefined &&
                orderDetail?.grossAmount !== undefined &&
                orderDetail?.paymentMethod !== 'OTHER_QRIS' ? (
                  <div className="flex flex-row justify-between my-5">
                    <Typography className="text-sm font-semibold text-[#BDBDBD]">
                      {t('seedsEvent.payment.receipt.tournamentFee')}
                    </Typography>
                    <Typography className="text-sm font-semibold text-[#262626]">
                      {`${orderDetail?.currency} ${formatCurrency(
                        orderDetail?.grossAmount -
                          ((paymentSelected[0]?.admin_fee ?? 0) +
                            (paymentSelected[0]?.service_fee ?? 0)) +
                          (paymentSelected[0]?.is_promo_available ?? false
                            ? paymentSelected[0]?.promo_price ?? 0
                            : 0)
                      )}`}
                    </Typography>
                  </div>
                ) : (
                  ''
                )}

                {/* Event Fee QRIS */}
                {orderDetail?.currency !== undefined &&
                orderDetail.grossAmount !== undefined &&
                orderDetail?.paymentMethod === 'OTHER_QRIS' ? (
                  <div className="flex flex-row justify-between my-5">
                    <Typography className="text-sm font-semibold text-[#BDBDBD]">
                      {t('seedsEvent.payment.receipt.tournamentFee')}
                    </Typography>
                    <Typography className="text-sm font-semibold text-[#262626]">
                      {`${orderDetail?.currency} ${formatCurrency(
                        orderDetail?.grossAmount -
                          ((qRisList[0]?.admin_fee ?? 0) +
                            (qRisList[0]?.service_fee ?? 0))
                      )}`}
                    </Typography>
                  </div>
                ) : (
                  ''
                )}

                {/* Admin Fee */}
                {paymentSelected !== undefined &&
                paymentSelected[0]?.admin_fee > 0 ? (
                  <div className="flex flex-row justify-between mb-5">
                    <Typography className="text-sm font-semibold text-[#BDBDBD]">
                      {t('seedsEvent.payment.receipt.adminFee')}
                    </Typography>
                    <Typography className="text-sm font-semibold text-[#262626]">
                      {orderDetail?.currency !== undefined &&
                        `${orderDetail.currency} ${formatCurrency(
                          paymentSelected[0].admin_fee ?? 0
                        )}`}
                    </Typography>
                  </div>
                ) : (
                  ''
                )}

                {/* Admin Fee QRIS */}
                {qRisList !== undefined &&
                qRisList[0]?.admin_fee > 0 &&
                orderDetail?.paymentMethod === 'OTHER_QRIS' ? (
                  <div className="flex flex-row justify-between mb-5">
                    <Typography className="text-sm font-semibold text-[#BDBDBD]">
                      {t('seedsEvent.payment.receipt.adminFee')}
                    </Typography>
                    <Typography className="text-sm font-semibold text-[#262626]">
                      {orderDetail?.currency !== undefined &&
                        `${orderDetail.currency} ${formatCurrency(
                          qRisList[0]?.admin_fee ?? 0
                        )}`}
                    </Typography>
                  </div>
                ) : (
                  ''
                )}

                {/* Service Fee */}
                {paymentSelected[0]?.service_fee > 0 ? (
                  <div className="flex flex-row justify-between mb-5">
                    <Typography className="text-sm font-semibold text-[#BDBDBD]">
                      {t('seedsEvent.payment.receipt.serviceFee')}
                    </Typography>
                    <Typography className="text-sm font-semibold text-[#262626]">
                      {orderDetail?.currency !== undefined &&
                      orderDetail.grossAmount !== undefined
                        ? `${orderDetail.currency} ${formatCurrency(
                            paymentSelected[0]?.service_fee ?? 0
                          )}`
                        : ''}
                    </Typography>
                  </div>
                ) : (
                  ''
                )}

                {/* Service Fee QRIS */}
                {qRisList !== undefined &&
                qRisList[0]?.service_fee > 0 &&
                orderDetail?.paymentMethod === 'OTHER_QRIS' ? (
                  <div className="flex flex-row justify-between mb-5">
                    <Typography className="text-sm font-semibold text-[#BDBDBD]">
                      {t('seedsEvent.payment.receipt.serviceFee')}
                    </Typography>
                    <Typography className="text-sm font-semibold text-[#262626]">
                      {orderDetail?.currency !== undefined &&
                      orderDetail.grossAmount !== undefined
                        ? `${orderDetail.currency} ${formatCurrency(
                            qRisList[0]?.service_fee ?? 0
                          )}`
                        : ''}
                    </Typography>
                  </div>
                ) : (
                  ''
                )}

                {/* Discount Fee */}
                {paymentSelected.length > 0 && (
                  <div>
                    {paymentSelected[0]?.is_promo_available && (
                      <div className="flex flex-row justify-between mb-5">
                        <Typography className="text-sm font-semibold text-[#BDBDBD]">
                          {t('seedsEvent.payment.receipt.discountFee')}
                        </Typography>
                        <Typography className="text-sm font-semibold text-[#262626]">
                          {orderDetail?.currency !== undefined
                            ? `- ${orderDetail.currency} ${formatCurrency(
                                paymentSelected.length > 0
                                  ? paymentSelected[0]?.promo_price ?? 0
                                  : 0
                              )}`
                            : ''}
                        </Typography>
                      </div>
                    )}
                  </div>
                )}

                {/* Discount Fee QRIS */}
                {qRisList !== undefined &&
                  orderDetail?.paymentMethod === 'OTHER_QRIS' && (
                    <div>
                      {qRisList[0]?.is_promo_available && (
                        <div className="flex flex-row justify-between mb-5">
                          <Typography className="text-sm font-semibold text-[#BDBDBD]">
                            {t('seedsEvent.payment.receipt.discountFee')}
                          </Typography>
                          <Typography className="text-sm font-semibold text-[#262626]">
                            {orderDetail?.currency !== undefined
                              ? `- ${orderDetail.currency} ${formatCurrency(
                                  qRisList !== undefined
                                    ? qRisList[0]?.promo_price ?? 0
                                    : 0
                                )}`
                              : ''}
                          </Typography>
                        </div>
                      )}
                    </div>
                  )}

                {/* Discount Coins */}
                <div>
                  {orderDetail?.currency !== undefined
                    ? paymentSelected[0]?.admin_fee +
                        paymentSelected[0]?.service_fee -
                        orderDetail.grossAmount -
                        paymentSelected[0]?.promo_price >
                        0 && (
                        <div className="flex flex-row justify-between mb-5">
                          <Typography className="text-sm font-semibold text-[#BDBDBD]">
                            {t('seedsEvent.payment.receipt.discountCoins')}
                          </Typography>
                          <Typography className="text-sm font-semibold text-[#262626]">
                            {`- ${orderDetail.currency} ${formatCurrency(
                              paymentSelected[0]?.admin_fee +
                                paymentSelected[0]?.service_fee -
                                orderDetail.grossAmount
                            )}`}
                          </Typography>
                        </div>
                      )
                    : ''}
                </div>

                {/* Discount Coins QRIS */}
                <div>
                  {orderDetail?.currency !== undefined &&
                  orderDetail?.paymentMethod === 'OTHER_QRIS' &&
                  qRisList !== undefined
                    ? qRisList[0]?.admin_fee +
                        qRisList[0]?.service_fee -
                        orderDetail.grossAmount -
                        qRisList[0]?.promo_price >
                        0 && (
                        <div className="flex flex-row justify-between mb-5">
                          <Typography className="text-sm font-semibold text-[#BDBDBD]">
                            {t('seedsEvent.payment.receipt.discountCoins')}
                          </Typography>
                          <Typography className="text-sm font-semibold text-[#262626]">
                            {`- ${orderDetail.currency} ${formatCurrency(
                              qRisList[0]?.admin_fee +
                                qRisList[0]?.service_fee -
                                orderDetail?.grossAmount
                            )}`}
                          </Typography>
                        </div>
                      )
                    : ''}
                </div>
                <hr />

                {/* Total Amount */}
                <div className="flex flex-row justify-between my-5">
                  <Typography className="text-sm font-semibold text-[#BDBDBD]">
                    {t('seedsEvent.payment.receipt.totalAmount')}
                  </Typography>
                  <Typography className="text-sm font-semibold text-[#262626]">
                    {orderDetail?.currency !== undefined &&
                      `${orderDetail?.currency} ${formatCurrency(
                        orderDetail?.grossAmount
                      )}`}
                  </Typography>
                </div>

                {/* ID Transaction */}
                <div className="flex flex-row justify-between mb-5">
                  <Typography className="text-sm font-semibold text-[#BDBDBD]">
                    {t('seedsEvent.payment.receipt.idTransaction')}
                  </Typography>
                  <Typography className="text-sm font-semibold text-[#262626] text-right">
                    {orderDetail?.transactionId ?? 'Loading...'}
                  </Typography>
                </div>
              </Card>

              {
                orderDetail !== undefined &&
                  <VirtualAccountStep
                    setIsLoading={setIsLoadingHowToPay}
                    orderDetail={orderDetail}
                    id={orderId}
                  />
              }

              <div className="flex gap-2 w-full justify-start items-center my-4">
                <div className="w-[16px] h-[16px] flex justify-center items-center">
                  <Image
                    src={EventBookInfo}
                    alt={'EventBookInfo'}
                    width={20}
                    height={20}
                  />
                </div>
                <Typography className="font-poppins text-sm text-[#3C49D6]">
                  {orderDetail?.transactionStatus === 'SUCCESS' ||
                  orderDetail?.transactionStatus === 'SETTLEMENT' ||
                  orderDetail?.transactionStatus === 'SUCCEEDED'
                    ? t('seedsEvent.payment.receipt.messageComplete')
                    : t('seedsEvent.payment.receipt.messageUncomplete')}
                </Typography>
              </div>

              {/* Navigation Button */}
              <div className="w-full flex flex-col items-center justify-center">
                {
                  (orderDetail?.paymentMethod?.includes('BNC') ?? false) &&
                    <Button
                      className="w-full text-sm font-semibold bg-seeds-button-green mt-10 rounded-full capitalize"
                      onClick={async () => {
                        void handleViewQR();
                      }}
                    >
                      {t('bnc.seeQRCode')}
                    </Button>
                }
                <Button
                  className={`${
                    orderDetail?.paymentMethod?.includes('BNC') ?? false
                      ? 'mt-4'
                      : 'mt-10'
                  } w-full text-sm font-semibold bg-seeds-button-green rounded-full capitalize`}
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
                  {orderDetail?.transactionStatus === 'SUCCESS' ||
                  orderDetail?.transactionStatus === 'SETTLEMENT' ||
                  orderDetail?.transactionStatus === 'SUCCEEDED'
                    ? t('seedsEvent.payment.receipt.seeTicket')
                    : t('seedsEvent.payment.receipt.refreshPage')}
                </Button>
              </div>
            </Card>
          </div>
        </CardGradient>
      </PageGradient>
    </div>
  );
};

export default withAuth(SuccessPaymentPage);
