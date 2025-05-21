import Loading from '@/components/popup/Loading';
import CardGradient from '@/components/ui/card/CardGradient';
import PageGradient from '@/components/ui/page-gradient/PageGradient';
import VirtualAccountStep from '@/components/VirtualAccountStep';
import { CeklisCircle } from '@/constants/assets/icons';
import withAuth from '@/helpers/withAuth';
import useWindowInnerWidth from '@/hooks/useWindowInnerWidth';
import {
  getPaymentDetail,
  getPaymentList
} from '@/repository/payment.repository';
import { setPromoCodeValidationResult } from '@/store/redux/features/promo-code';
import { formatCurrency } from '@/utils/common/currency';
import {
  type PaymentOption,
  type PaymentOptionList,
  type PaymentStatus
} from '@/utils/interfaces/team-battle.interface';
import { Button, Card, Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Pending } from 'public/assets/circle';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

const Receipt: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const width = useWindowInnerWidth();
  const router = useRouter();

  const id = router?.query?.id as string;
  const orderId = router?.query?.orderId as string;
  const paymentUrl = router?.query?.paymentUrl as string;
  const [qRisList, setQRisList] = useState<PaymentOption[]>([]);
  const [virtualList, setVirtualList] = useState<PaymentOption[]>([]);
  const [eWalletList, setEWalletList] = useState<PaymentOption[]>([]);
  const [orderDetail, setOrderDetail] = useState<PaymentStatus>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchOrderDetail = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await getPaymentDetail(orderId);
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
      const response: PaymentOptionList = await getPaymentList();
      setQRisList(response.type_qris);
      setVirtualList(response.type_va);
      setEWalletList(response.type_ewallet);
    } catch (error) {
      toast.error(`Error fetching payment list: ${error as string}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchOrderDetail();
    void fetchPaymentList();
    dispatch(setPromoCodeValidationResult(0));
  }, [orderId]);

  const getSelectedPayment = (
    eWalletList: PaymentOption[],
    vaList: PaymentOption[],
    qRisList: PaymentOption[],
    orderDetail: PaymentStatus | undefined
  ): PaymentOption[] => {
    if (orderDetail === null) {
      return [];
    }

    const paymentSelected: PaymentOption[] = [
      ...eWalletList?.filter((el) => el?.payment_method === orderDetail?.paymentMethod),
      ...vaList?.filter((el) => el?.payment_method === orderDetail?.paymentMethod),
      ...qRisList?.filter((el) => el?.payment_method === orderDetail?.paymentMethod),
    ];

    return paymentSelected.length > 0 ? paymentSelected : [];
  };

  const selectedPayment = getSelectedPayment(
    eWalletList,
    virtualList,
    qRisList,
    orderDetail
  );

  const handleViewQR = async (): Promise<void> => {
    const query = paymentUrl !== '' ? { paymentUrl } : undefined;

    await router
      .replace(
        {
          pathname:
            `/play/team-battle/${id}/payment/receipt/${orderId}` +
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
                {orderDetail?.transactionStatus === 'SETTLEMENT' ||
                orderDetail?.transactionStatus === 'SUCCEEDED' ||
                orderDetail?.transactionStatus === 'SUCCESS'
                  ? ''
                  : t('tournament.payment.pendingPaidTeamBattle')}
              </Typography>
              <Typography className="text-2xl font-semibold text-white text-center">
                {orderDetail?.transactionStatus === 'SETTLEMENT' ||
                orderDetail?.transactionStatus === 'SUCCEEDED' ||
                orderDetail?.transactionStatus === 'SUCCESS'
                  ? t('tournament.payment.successful')
                  : `${orderDetail?.currency ?? 'IDR'} ${formatCurrency(
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
                {selectedPayment?.length > 0 && (
                  <div className="flex items-center justify-center mb-9 mt-3">
                    <Image
                      src={selectedPayment[0]?.logo_url}
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

                {/* Team Battle Fee */}
                {orderDetail?.currency !== undefined &&
                orderDetail?.grossAmount !== undefined &&
                orderDetail?.paymentMethod !== 'OTHER_QRIS' ? (
                  <div className="flex flex-row justify-between my-5">
                    <Typography className="text-sm font-semibold text-[#BDBDBD]">
                      {t('tournament.payment.teamBattleFee')}
                    </Typography>
                    <Typography className="text-sm font-semibold text-[#262626] text-right">
                      {`${orderDetail?.currency} ${formatCurrency(
                        (orderDetail?.grossAmount ?? 0) === 0
                          ? 0
                          : orderDetail?.grossAmount -
                              ((selectedPayment[0]?.admin_fee ?? 0) +
                                (selectedPayment[0]?.service_fee ?? 0)) +
                              (selectedPayment[0]?.is_promo_available ?? false
                                ? selectedPayment[0]?.promo_price ?? 0
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
                      {t('tournament.payment.teamBattleFee')}
                    </Typography>
                    <Typography className="text-sm font-semibold text-[#262626]">
                      {`${orderDetail?.currency} ${formatCurrency(
                        (orderDetail?.grossAmount ?? 0) === 0
                          ? 0
                          : orderDetail?.grossAmount -
                              ((qRisList[0]?.admin_fee ?? 0) +
                                (qRisList[0]?.service_fee ?? 0)) +
                              (selectedPayment[0]?.is_promo_available ?? false
                                ? selectedPayment[0]?.promo_price ?? 0
                                : 0)
                      )}`}
                    </Typography>
                  </div>
                ) : (
                  ''
                )}

                {/* Admin Fee */}
                {(orderDetail?.grossAmount ?? 0) > 0 &&
                selectedPayment !== undefined &&
                selectedPayment[0]?.admin_fee > 0 ? (
                  <div className="flex flex-row justify-between mb-5">
                    <Typography className="text-sm font-semibold text-[#BDBDBD]">
                      {t('tournament.payment.adminFee')}
                    </Typography>
                    <Typography className="text-sm font-semibold text-[#262626]">
                      {orderDetail?.currency !== undefined &&
                        `${orderDetail.currency} ${formatCurrency(
                          selectedPayment[0].admin_fee ?? 0
                        )}`}
                    </Typography>
                  </div>
                ) : (
                  ''
                )}

                {/* Service Fee */}
                {(orderDetail?.grossAmount ?? 0) > 0 &&
                selectedPayment[0]?.service_fee > 0 ? (
                  <div className="flex flex-row justify-between mb-5">
                    <Typography className="text-sm font-semibold text-[#BDBDBD]">
                      {t('tournament.payment.serviceFee')}
                    </Typography>
                    <Typography className="text-sm font-semibold text-[#262626]">
                      {orderDetail?.currency !== undefined &&
                      orderDetail.grossAmount !== undefined
                        ? `${orderDetail.currency} ${formatCurrency(
                            selectedPayment[0]?.service_fee ?? 0
                          )}`
                        : ''}
                    </Typography>
                  </div>
                ) : (
                  ''
                )}

                {/* Discount Fee */}
                {(orderDetail?.grossAmount ?? 0) > 0 &&
                  selectedPayment.length > 0 && (
                    <div>
                      {selectedPayment[0]?.is_promo_available && (
                        <div className="flex flex-row justify-between mb-5">
                          <Typography className="text-sm font-semibold text-[#BDBDBD]">
                            {t('tournament.payment.discountFee')}
                          </Typography>
                          <Typography className="text-sm font-semibold text-[#262626]">
                            {orderDetail?.currency !== undefined
                              ? `- ${orderDetail.currency} ${formatCurrency(
                                  selectedPayment.length > 0
                                    ? selectedPayment[0]?.promo_price ?? 0
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
                    ? selectedPayment[0]?.admin_fee +
                        selectedPayment[0]?.service_fee -
                        orderDetail.grossAmount -
                        selectedPayment[0]?.promo_price >
                        0 && (
                        <div className="flex flex-row justify-between mb-5">
                          <Typography className="text-sm font-semibold text-[#BDBDBD]">
                            {t('tournament.payment.discountCoins')}
                          </Typography>
                          <Typography className="text-sm font-semibold text-[#262626]">
                            {`- ${orderDetail.currency} ${formatCurrency(
                              selectedPayment[0]?.admin_fee +
                                selectedPayment[0]?.service_fee -
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
                    {t('tournament.payment.totalAmount')}
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
                    {t('tournament.payment.idTransaction')}
                  </Typography>
                  <Typography className="text-sm font-semibold text-[#262626] truncate">
                    {orderDetail?.transactionId === ''
                      ? '-'
                      : `${(orderDetail?.transactionId ?? '').slice(0, 20)}${
                          (orderDetail?.transactionId ?? '').length > 20
                            ? '...'
                            : ''
                        }`}
                  </Typography>
                </div>
              </Card>

              {
                orderDetail !== undefined &&
                  <VirtualAccountStep
                    setIsLoading={setIsLoading}
                    orderDetail={orderDetail}
                    id={orderId}
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
                    if (
                      orderDetail?.transactionStatus === 'SUCCESS' ||
                      orderDetail?.transactionStatus === 'SETTLEMENT' ||
                      orderDetail?.transactionStatus === 'SUCCEEDED'
                    ) {
                      void router.replace(
                        `/play/team-battle/${orderDetail?.itemId}`
                      );
                    } else {
                      void router.replace(
                        `/play/team-battle/${orderDetail?.itemId as string}`
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

export default withAuth(Receipt);
