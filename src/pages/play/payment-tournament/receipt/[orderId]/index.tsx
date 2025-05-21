import Loading from '@/components/popup/Loading';
import CardGradient from '@/components/ui/card/CardGradient';
import PageGradient from '@/components/ui/page-gradient/PageGradient';
import VirtualAccountStep from '@/components/VirtualAccountStep';
import { CeklisCircle } from '@/constants/assets/icons';
import { standartCurrency } from '@/helpers/currency';
import withAuth from '@/helpers/withAuth';
import useWindowInnerWidth from '@/hooks/useWindowInnerWidth';
import { type ReceiptDetail } from '@/pages/play/payment/receipt/[orderId]';
import {
  getPaymentDetail,
  getPaymentList
} from '@/repository/payment.repository';
import { getPlayById } from '@/repository/play.repository';
import { setPromoCodeValidationResult } from '@/store/redux/features/promo-code';
import { type IDetailTournament } from '@/utils/interfaces/tournament.interface';
import { Button, Card, Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Pending } from 'public/assets/circle';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
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

export interface QRList {
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
  const dispatch = useDispatch();
  const id = router.query.orderId as string;
  const paymentUrl = router.query.paymentUrl as string;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [eWalletList, setEWalletList] = useState([]);
  const [orderDetail, setOrderDetail] = useState<undefined | ReceiptDetail>();
  const [qRisList, setQRisList] = useState<QRList[]>([]);
  const [vaList, setVaList] = useState<QRList[]>([]);
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);
  const [detailTournament, setDetailTournament] = useState<IDetailTournament>();

  const fetchOrderDetail = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await getPaymentDetail(id);
      setOrderDetail(response);
    } catch (error) {
      toast.error(`Error fetching order detail ${error as string}`);
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
      toast.error(`Error fetching order detail ${error as string}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (orderDetail?.itemId !== undefined) {
      void fetchTournamentData(orderDetail?.itemId);
    }
    void fetchOrderDetail();
    void fetchPaymentList();
    dispatch(setPromoCodeValidationResult(0));
  }, [id, orderDetail?.itemId, orderDetail?.howToPayApi]);

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

  const fetchTournamentData = async (itemId: string): Promise<void> => {
    try {
      setLoading(true);
      const resp: IDetailTournament = await getPlayById(itemId);
      setDetailTournament(resp);
    } catch (error) {
      toast(`Error fetch tournament ${error as string}`);
    } finally {
      setLoading(false);
    }
  };

  const isStarted = (): boolean => {
    const playTime = detailTournament?.play_time ?? '2024-12-31T17:00:00Z';
    const timeStart = new Date(playTime).getTime();
    const timeNow = Date.now();

    return timeStart < timeNow;
  };

  const handleViewQR = async (): Promise<void> => {
    const query = paymentUrl !== '' ? { paymentUrl } : undefined;

    await router
      .replace(
        {
          pathname:
            `/play/payment-tournament/receipt/${id}` +
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
      {isLoading || (loading && <Loading />)}
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
                {orderDetail?.transactionStatus === 'SETTLEMENT' ||
                orderDetail?.transactionStatus === 'SUCCEEDED' ||
                orderDetail?.transactionStatus === 'SUCCESS'
                  ? ''
                  : t('tournament.payment.pendingPaidTournament')}
              </Typography>
              <Typography className="text-2xl font-semibold text-white text-center">
                {orderDetail?.transactionStatus === 'SETTLEMENT' ||
                orderDetail?.transactionStatus === 'SUCCEEDED' ||
                orderDetail?.transactionStatus === 'SUCCESS'
                  ? t('tournament.payment.successful')
                  : `${orderDetail?.currency ?? 'IDR'} ${standartCurrency(
                      orderDetail?.grossAmount ?? 0
                    )}`}
              </Typography>
              <Typography className="text-sm font-normal text-white text-center">
                {orderDetail?.transactionStatus === 'SETTLEMENT' ||
                  orderDetail?.transactionStatus === 'SUCCEEDED' ||
                  (orderDetail?.transactionStatus === 'SUCCESS' &&
                    t('tournament.payment.recurringSaved'))}
              </Typography>

              <Card className="p-5 mt-8 bg-white w-full">
                <Typography className="text-sm font-semibold text-[#BDBDBD] text-center">
                  {orderDetail?.vaNumber !== undefined
                    ? t('tournament.payment.virtualNumber')
                    : t('tournament.payment.paymentMethod')}
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
                <div className="flex justify-between relative bottom-3 z-50">
                  <div className="bg-[#3AC4A0] h-6 rounded-full w-6 -mx-8 outline-none" />
                  <div className="bg-[#3AC4A0] h-6 rounded-full w-6 -mx-8 outline-none" />
                </div>

                {/* Tournament Fee */}
                {orderDetail?.currency !== undefined &&
                orderDetail?.grossAmount !== undefined &&
                orderDetail?.paymentMethod !== 'OTHER_QRIS' ? (
                  <div className="flex flex-row justify-between my-5">
                    <Typography className="text-sm font-semibold text-[#BDBDBD]">
                      {t('tournament.payment.tournamentFee')}
                    </Typography>
                    <Typography className="text-sm font-semibold text-[#262626]">
                      {`${orderDetail?.currency} ${standartCurrency(
                        (orderDetail?.grossAmount ?? 0) === 0
                          ? 0
                          : orderDetail?.grossAmount -
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

                {/* Tournament Fee QRIS */}
                {orderDetail?.currency !== undefined &&
                orderDetail.grossAmount !== undefined &&
                orderDetail?.paymentMethod === 'OTHER_QRIS' ? (
                  <div className="flex flex-row justify-between my-5">
                    <Typography className="text-sm font-semibold text-[#BDBDBD]">
                      {t('tournament.payment.tournamentFee')}
                    </Typography>
                    <Typography className="text-sm font-semibold text-[#262626]">
                      {`${orderDetail?.currency} ${standartCurrency(
                        (orderDetail?.grossAmount ?? 0) === 0
                          ? 0
                          : orderDetail?.grossAmount -
                              ((qRisList[0]?.admin_fee ?? 0) +
                                (qRisList[0]?.service_fee ?? 0)) +
                              (paymentSelected[0]?.is_promo_available ?? false
                                ? paymentSelected[0]?.promo_price ?? 0
                                : 0)
                      )}`}
                    </Typography>
                  </div>
                ) : (
                  ''
                )}

                {/* Admin Fee */}
                {(orderDetail?.grossAmount ?? 0) > 0 &&
                paymentSelected !== undefined &&
                paymentSelected[0]?.admin_fee > 0 ? (
                  <div className="flex flex-row justify-between mb-5">
                    <Typography className="text-sm font-semibold text-[#BDBDBD]">
                      {t('tournament.payment.adminFee')}
                    </Typography>
                    <Typography className="text-sm font-semibold text-[#262626]">
                      {orderDetail?.currency !== undefined &&
                        `${orderDetail.currency} ${standartCurrency(
                          paymentSelected[0].admin_fee ?? 0
                        )}`}
                    </Typography>
                  </div>
                ) : (
                  ''
                )}

                {/* Admin Fee QRIS */}
                {(orderDetail?.grossAmount ?? 0) > 0 &&
                qRisList !== undefined &&
                qRisList[0]?.admin_fee > 0 &&
                orderDetail?.paymentMethod === 'OTHER_QRIS' ? (
                  <div className="flex flex-row justify-between mb-5">
                    <Typography className="text-sm font-semibold text-[#BDBDBD]">
                      {t('tournament.payment.adminFee')}
                    </Typography>
                    <Typography className="text-sm font-semibold text-[#262626]">
                      {orderDetail?.currency !== undefined &&
                        `${orderDetail.currency} ${standartCurrency(
                          qRisList[0]?.admin_fee ?? 0
                        )}`}
                    </Typography>
                  </div>
                ) : (
                  ''
                )}

                {/* Service Fee */}
                {(orderDetail?.grossAmount ?? 0) > 0 &&
                paymentSelected[0]?.service_fee > 0 ? (
                  <div className="flex flex-row justify-between mb-5">
                    <Typography className="text-sm font-semibold text-[#BDBDBD]">
                      {t('tournament.payment.serviceFee')}
                    </Typography>
                    <Typography className="text-sm font-semibold text-[#262626]">
                      {orderDetail?.currency !== undefined &&
                      orderDetail.grossAmount !== undefined
                        ? `${orderDetail.currency} ${standartCurrency(
                            paymentSelected[0]?.service_fee ?? 0
                          )}`
                        : ''}
                    </Typography>
                  </div>
                ) : (
                  ''
                )}

                {/* Service Fee QRIS */}
                {(orderDetail?.grossAmount ?? 0) > 0 &&
                qRisList !== undefined &&
                qRisList[0]?.service_fee > 0 &&
                orderDetail?.paymentMethod === 'OTHER_QRIS' ? (
                  <div className="flex flex-row justify-between mb-5">
                    <Typography className="text-sm font-semibold text-[#BDBDBD]">
                      {t('tournament.payment.serviceFee')}
                    </Typography>
                    <Typography className="text-sm font-semibold text-[#262626]">
                      {orderDetail?.currency !== undefined &&
                      orderDetail.grossAmount !== undefined
                        ? `${orderDetail.currency} ${standartCurrency(
                            qRisList[0]?.service_fee ?? 0
                          )}`
                        : ''}
                    </Typography>
                  </div>
                ) : (
                  ''
                )}

                {/* Discount Fee */}
                {(orderDetail?.grossAmount ?? 0) > 0 &&
                  paymentSelected.length > 0 && (
                    <div>
                      {paymentSelected[0]?.is_promo_available && (
                        <div className="flex flex-row justify-between mb-5">
                          <Typography className="text-sm font-semibold text-[#BDBDBD]">
                            {t('tournament.payment.discountFee')}
                          </Typography>
                          <Typography className="text-sm font-semibold text-[#262626]">
                            {orderDetail?.currency !== undefined
                              ? `- ${orderDetail.currency} ${standartCurrency(
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
                {(orderDetail?.grossAmount ?? 0) > 0 &&
                  qRisList !== undefined &&
                  orderDetail?.paymentMethod === 'OTHER_QRIS' && (
                    <div>
                      {qRisList[0]?.is_promo_available && (
                        <div className="flex flex-row justify-between mb-5">
                          <Typography className="text-sm font-semibold text-[#BDBDBD]">
                            {t('tournament.payment.discountFee')}
                          </Typography>
                          <Typography className="text-sm font-semibold text-[#262626]">
                            {orderDetail?.currency !== undefined
                              ? `- ${orderDetail.currency} ${standartCurrency(
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
                  {(orderDetail?.grossAmount ?? 0) > 0 &&
                  orderDetail?.currency !== undefined
                    ? paymentSelected[0]?.admin_fee +
                        paymentSelected[0]?.service_fee -
                        orderDetail.grossAmount -
                        paymentSelected[0]?.promo_price >
                        0 && (
                        <div className="flex flex-row justify-between mb-5">
                          <Typography className="text-sm font-semibold text-[#BDBDBD]">
                            {t('tournament.payment.discountCoins')}
                          </Typography>
                          <Typography className="text-sm font-semibold text-[#262626]">
                            {`- ${orderDetail.currency} ${standartCurrency(
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
                  (orderDetail?.grossAmount ?? 0) > 0 &&
                  qRisList !== undefined
                    ? qRisList[0]?.admin_fee +
                        qRisList[0]?.service_fee -
                        orderDetail.grossAmount -
                        qRisList[0]?.promo_price >
                        0 && (
                        <div className="flex flex-row justify-between mb-5">
                          <Typography className="text-sm font-semibold text-[#BDBDBD]">
                            {t('tournament.payment.discountCoins')}
                          </Typography>
                          <Typography className="text-sm font-semibold text-[#262626]">
                            {`- ${orderDetail.currency} ${standartCurrency(
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
                    {t('tournament.payment.totalAmount')}
                  </Typography>
                  <Typography className="text-sm font-semibold text-[#262626]">
                    {orderDetail?.currency !== undefined &&
                      `${orderDetail?.currency} ${standartCurrency(
                        orderDetail?.grossAmount
                      )}`}
                  </Typography>
                </div>

                {/* ID Transaction */}
                <div className="flex flex-row justify-between mb-5">
                  <Typography className="text-sm font-semibold text-[#BDBDBD]">
                    {t('tournament.payment.idTransaction')}
                  </Typography>
                  <Typography className="text-sm font-semibold text-[#262626] truncate">
                    {orderDetail?.transactionId === ''
                      ? '-'
                      : `${orderDetail?.transactionId ?? ''}`}
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
                    if (isStarted()) {
                      if (
                        orderDetail?.transactionStatus === 'SUCCESS' ||
                        orderDetail?.transactionStatus === 'SETTLEMENT' ||
                        orderDetail?.transactionStatus === 'SUCCEEDED'
                      ) {
                        void router.replace(
                          `/play/tournament/${orderDetail?.itemId}/home`
                        );
                      } else {
                        void router.replace(
                          `/play/tournament/${orderDetail?.itemId as string}`
                        );
                      }
                    } else {
                      void router.replace(
                        `/play/tournament/${orderDetail?.itemId as string}`
                      );
                    }
                  }}
                >
                  {t('tournament.payment.close')}
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
