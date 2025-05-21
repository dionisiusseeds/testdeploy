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
import { getSubscriptionPlan } from '@/repository/subscription.repository';
import { formatCurrency } from '@/utils/common/currency';
import {
  type DataPlanI,
  type PlanI
} from '@/utils/interfaces/subscription.interface';
import { Button, Card, Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Pending } from 'public/assets/circle';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

interface PaymentList {
  admin_fee: number;
  id: string;
  is_active: boolean;
  logo_url: string;
  payment_gateway: string;
  payment_method: string;
  payment_type: string;
  service_fee: number;
  is_promo_available: boolean;
  promo_price: number;
}

interface QrisDetail {
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
  const { t } = useTranslation();
  const id = router.query.orderId as string;
  const paymentUrl = router.query.paymentUrl as string;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [eWalletList, setEWalletList] = useState([]);
  const [orderDetail, setOrderDetail] = useState<undefined | ReceiptDetail>();
  const [qRisList, setQRisList] = useState<QrisDetail[]>([]);
  const [vaList, setVaList] = useState<QrisDetail[]>([]);
  const [dataPlan, setDataPlan] = useState<PlanI>();

  const fetchOrderDetail = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await getPaymentDetail(id);
      setOrderDetail(response);
    } catch (error) {
      toast.error(`Error fetching order detail: ${error as string}`);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPaymentList = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const data = await getPaymentList();
      setQRisList(data.type_qris);
      setEWalletList(data.type_ewallet);
      setVaList(data.type_va);
    } catch (error) {
      toast.error(`Error fetching payment list: ${error as string}`);
    } finally {
      setIsLoading(false);
    }
  };

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

  const getPlanList = async (): Promise<void> => {
    try {
      const response: DataPlanI = await getSubscriptionPlan();
      const id = orderDetail?.itemId ?? '';
      const { SILVER, GOLD, PLATINUM } = response.data;
      const mappedPlan = [...SILVER, ...GOLD, ...PLATINUM];
      const selectedPlan = mappedPlan.find(plan => plan.id === id);
      if (selectedPlan !== null) {
        setDataPlan(selectedPlan);
      } else {
        toast.error('Invalid plan package');
      }
    } catch (error) {
      toast((error as Error).message, { type: 'error' });
    }
  };

  useEffect(() => {
    void getPlanList();
  }, [id, orderDetail]);

  useEffect(() => {
    void fetchOrderDetail();
    void fetchPaymentList();
  }, [id, orderDetail?.howToPayApi]);

  const handleViewQR = async (): Promise<void> => {
    const query = paymentUrl !== '' ? { paymentUrl } : undefined;

    await router
      .replace(
        {
          pathname:
            `/seedsplan/payment/receipt/${id}` +
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
      {isLoading && <Loading />}
      <PageGradient
        defaultGradient
        className="relative overflow-hidden h-full flex flex-col items-center sm:p-0 sm:pb-16 w-full"
      >
        <CardGradient
          defaultGradient
          className={`relative overflow-hidden w-full h-full sm:min-w-[90%] sm:rounded-[18px] sm:min-h-[36rem] bg-white sm:px-20 py-8 ${
            width !== undefined && width < 370
              ? 'min-h-[38rem]'
              : width !== undefined && width < 400
              ? 'min-h-[45rem]'
              : width !== undefined && width < 415
              ? 'min-h-[48rem]'
              : ''
          } bg-white`}
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
                {orderDetail?.transactionStatus !== 'SETTLEMENT' &&
                orderDetail?.transactionStatus !== 'SUCCESS' &&
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
                {orderDetail?.transactionStatus !== 'SETTLEMENT' &&
                orderDetail?.transactionStatus !== 'SUCCESS' &&
                orderDetail?.transactionStatus !== 'SUCCEEDED'
                  ? t('seedsPlan.payment.pendingPaidSubscription')
                  : t('seedsPlan.payment.paymentSuccessful')}
              </Typography>
              <Typography className="text-2xl font-semibold text-white text-center">
                {orderDetail?.transactionStatus !== 'SETTLEMENT' &&
                orderDetail?.transactionStatus !== 'SUCCESS' &&
                orderDetail?.transactionStatus !== 'SUCCEEDED'
                  ? `${orderDetail?.currency ?? 'IDR'} ${formatCurrency(
                      orderDetail?.grossAmount ?? 0
                    )}`
                  : t('seedsPlan.payment.paymentSuccessful')}
              </Typography>
              <Typography className="text-sm font-normal text-white text-center">
                {(orderDetail?.transactionStatus === 'SETTLEMENT' ||
                  orderDetail?.transactionStatus === 'SUCCESS' ||
                  orderDetail?.transactionStatus === 'SUCCEEDED') &&
                  t('seedsPlan.payment.recurringSaved')}
              </Typography>

              <Card className="p-5 mt-8 bg-white w-full">
                <Typography className="text-sm font-semibold text-[#BDBDBD] text-center">
                  {orderDetail?.vaNumber !== undefined
                    ? t('seedsPlan.payment.virtualNumber')
                    : t('seedsPlan.payment.paymentMethod')}
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

                {/* Subscription Fee */}
                <div className="flex flex-row justify-between my-5">
                  <Typography className="text-sm font-semibold text-[#BDBDBD]">
                    {t('seedsPlan.payment.subscriptionFee')}
                  </Typography>
                  <Typography className="text-sm font-semibold text-[#262626] text-right">
                    {orderDetail?.currency !== undefined &&
                    orderDetail.grossAmount !== undefined
                      ? `${orderDetail.currency} ${formatCurrency(
                          dataPlan?.is_promo ?? false
                            ? dataPlan?.price_after_promo ?? 0
                            : dataPlan?.price ?? 0
                        )}`
                      : ''}
                  </Typography>
                </div>

                {/* Admin Fee */}
                {paymentSelected !== undefined &&
                paymentSelected[0]?.admin_fee > 0 ? (
                  <div className="flex flex-row justify-between mb-5">
                    <Typography className="text-sm font-semibold text-[#BDBDBD]">
                      {t('seedsPlan.payment.adminFee')}
                    </Typography>
                    <Typography className="text-sm font-semibold text-[#262626] text-right">
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
                      {t('seedsPlan.payment.adminFee')}
                    </Typography>
                    <Typography className="text-sm font-semibold text-[#262626] text-right">
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
                      {t('seedsPlan.payment.serviceFee')}
                    </Typography>
                    <Typography className="text-sm font-semibold text-[#262626] text-right">
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
                      {t('seedsPlan.payment.serviceFee')}
                    </Typography>
                    <Typography className="text-sm font-semibold text-[#262626] text-right">
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
                          {t('seedsPlan.payment.discountFee')}
                        </Typography>
                        <Typography className="text-sm font-semibold text-[#262626] text-right">
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
                            {t('seedsPlan.payment.discountFee')}
                          </Typography>
                          <Typography className="text-sm font-semibold text-[#262626] text-right">
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
                  {orderDetail?.currency !== undefined && dataPlan !== undefined
                    ? (dataPlan?.is_promo
                        ? dataPlan?.price_after_promo ?? 0
                        : dataPlan?.price ?? 0) +
                        paymentSelected[0]?.admin_fee +
                        paymentSelected[0]?.service_fee -
                        orderDetail.grossAmount -
                        paymentSelected[0]?.promo_price >
                        0 && (
                        <div className="flex flex-row justify-between mb-5">
                          <Typography className="text-sm font-semibold text-[#BDBDBD]">
                            {t('seedsPlan.payment.discountCoins')}
                          </Typography>
                          <Typography className="text-sm font-semibold text-[#262626] text-right">
                            {`- ${orderDetail.currency} ${formatCurrency(
                              (dataPlan?.is_promo
                                ? dataPlan?.price_after_promo ?? 0
                                : dataPlan?.price ?? 0) +
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
                  dataPlan !== undefined &&
                  orderDetail?.paymentMethod === 'OTHER_QRIS' &&
                  qRisList !== undefined
                    ? (dataPlan?.is_promo
                        ? dataPlan?.price_after_promo ?? 0
                        : dataPlan?.price ?? 0) +
                        qRisList[0]?.admin_fee +
                        qRisList[0]?.service_fee -
                        orderDetail.grossAmount -
                        qRisList[0]?.promo_price >
                        0 && (
                        <div className="flex flex-row justify-between mb-5">
                          <Typography className="text-sm font-semibold text-[#BDBDBD]">
                            {t('seedsPlan.payment.discountCoins')}
                          </Typography>
                          <Typography className="text-sm font-semibold text-[#262626] text-right">
                            {`- ${orderDetail.currency} ${formatCurrency(
                              (dataPlan?.is_promo
                                ? dataPlan?.price_after_promo ?? 0
                                : dataPlan?.price ?? 0) +
                                qRisList[0]?.admin_fee +
                                qRisList[0]?.service_fee -
                                orderDetail.grossAmount
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
                    {t('seedsPlan.payment.totalAmount')}
                  </Typography>
                  <Typography className="text-sm font-semibold text-[#262626] text-right">
                    {orderDetail?.currency !== undefined &&
                      `${orderDetail.currency} ${formatCurrency(
                        orderDetail.grossAmount
                      )}`}
                  </Typography>
                </div>
                <div className="flex flex-row justify-between mb-5">
                  <Typography className="text-sm font-semibold text-[#BDBDBD]">
                    {t('seedsPlan.payment.idTransaction')}
                  </Typography>
                  <Typography className="text-sm font-semibold text-[#262626] text-right">
                    {(orderDetail?.transactionId ?? '') === ''
                      ? '-'
                      : orderDetail?.transactionId}
                  </Typography>
                </div>
              </Card>

              {
                orderDetail !== undefined &&
                  <VirtualAccountStep
                    setIsLoading={setIsLoading}
                    orderDetail={orderDetail}
                    id={id}
                  />
              }

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
                  onClick={() => {
                    void router.replace(`/seedsplan`);
                  }}
                >
                  {t('seedsPlan.payment.close')}
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
