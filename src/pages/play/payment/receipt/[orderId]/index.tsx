import Loading from '@/components/popup/Loading';
import CardGradient from '@/components/ui/card/CardGradient';
import PageGradient from '@/components/ui/page-gradient/PageGradient';
import VirtualAccountStep from '@/components/VirtualAccountStep';
import { CeklisCircle } from '@/constants/assets/icons';
import { swtracker } from '@/constants/swtracker';
import { standartCurrency } from '@/helpers/currency';
import TrackerEvent from '@/helpers/GTM';
import withAuth from '@/helpers/withAuth';
import useWindowInnerWidth from '@/hooks/useWindowInnerWidth';
import {
  getPaymentDetail,
  getPaymentList
} from '@/repository/payment.repository';
import { getUserInfo } from '@/repository/profile.repository';
import { getQuizById } from '@/repository/quiz.repository';
import { setPromoCodeValidationResult } from '@/store/redux/features/promo-code';
import { type IDetailQuiz } from '@/utils/interfaces/quiz.interfaces';
import { Button, Card, Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Pending } from 'public/assets/circle';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
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

export interface ReceiptDetail {
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
}

interface QrisDetail {
  admin_fee: number;
  id: string;
  is_active: boolean;
  is_priority: boolean;
  is_promo_available: boolean;
  logo_url: string;
  minimum_withdrawal: 0;
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
  const dispatch = useDispatch();
  const id = router.query.orderId as string;
  const paymentUrl = router.query.paymentUrl as string;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [orderDetail, setOrderDetail] = useState<undefined | ReceiptDetail>();
  const [eWalletList, setEWalletList] = useState([]);
  const [vaList, setVaList] = useState<QrisDetail[]>([]);
  const [qRisList, setQRisList] = useState<QrisDetail[]>([]);
  const [detailQuiz, setDetailQuiz] = useState<IDetailQuiz>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setVirtualAccountInfo] = useState<any>();
  const [userInfo, setUserInfo] = useState();

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

  useEffect(() => {
    void fetchOrderDetail();
    void fetchPaymentList();
  }, [id, orderDetail?.howToPayApi]);

  const getDetail = useCallback(async () => {
    try {
      setIsLoading(true);
      const dataInfo = await getUserInfo();
      setUserInfo(dataInfo);
      const resp: IDetailQuiz = await getQuizById({
        id: orderDetail?.itemId as string,
        currency:
          dataInfo.preferredCurrency !== undefined
            ? dataInfo.preferredCurrency
            : 'IDR'
      });
      setDetailQuiz(resp);
    } catch (error) {
      toast(`ERROR fetch quiz ${error as string}`);
    } finally {
      setIsLoading(false);
    }
  }, [orderDetail]);

  useEffect(() => {
    void getDetail();
    dispatch(setPromoCodeValidationResult(0));
  }, [id, orderDetail]);

  const handleViewQR = async (): Promise<void> => {
    const query = paymentUrl !== '' ? { paymentUrl } : undefined;

    await router
      .replace(
        {
          pathname:
            `/play/payment/receipt/${id}` +
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
      ...eWalletList?.filter(
        el => el?.payment_method === orderDetail?.paymentMethod
      ),
      ...vaList?.filter(
        el => el?.payment_method === orderDetail?.paymentMethod
      ),
      ...qRisList?.filter(
        el => el?.payment_method === orderDetail?.paymentMethod
      )
    ];

    return paymentSelected.length > 0 ? paymentSelected : [];
  };

  const paymentSelected = getSelectedPayment(
    eWalletList,
    vaList,
    qRisList,
    orderDetail
  );

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
                orderDetail?.transactionStatus !== 'SUCCESS' ? (
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
                orderDetail?.transactionStatus !== 'SUCCESS'
                  ? t('quiz.payment.pendingPaidQuiz')
                  : t('quiz.payment.paymentSuccessful')}
              </Typography>
              <Typography className="text-2xl font-semibold text-white text-center">
                {orderDetail?.transactionStatus !== 'SETTLEMENT' &&
                orderDetail?.transactionStatus !== 'SUCCESS'
                  ? `${(
                      orderDetail?.currency ?? 'IDR'
                    )?.toUpperCase()} ${standartCurrency(
                      orderDetail?.grossAmount ?? 0
                    )}`
                  : t('quiz.payment.paymentSuccessful')}
              </Typography>
              <Typography className="text-sm font-normal text-white text-center">
                {(orderDetail?.transactionStatus === 'SETTLEMENT' ||
                  orderDetail?.transactionStatus === 'SUCCESS') &&
                  t('quiz.payment.recurringSaved')}
              </Typography>

              <Card className="p-5 mt-8 bg-white w-full">
                <Typography className="text-sm font-semibold text-[#BDBDBD] text-center">
                  {orderDetail?.vaNumber !== undefined
                    ? t('quiz.payment.virtualNumber')
                    : t('quiz.payment.paymentMethod')}
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

                {/* Quiz Fee */}
                {orderDetail?.currency !== undefined &&
                  orderDetail?.grossAmount !== undefined && (
                    <div className="flex flex-row justify-between my-5">
                      <Typography className="text-sm font-semibold text-[#BDBDBD]">
                        {t('quiz.payment.quizFeeTotal')}
                      </Typography>
                      <Typography className="text-sm font-semibold text-[#262626] text-right">
                        {orderDetail?.currency !== undefined &&
                        orderDetail?.grossAmount !== undefined
                          ? `${
                              orderDetail?.currency?.toUpperCase() ?? 'IDR'
                            } ${standartCurrency(
                              (orderDetail?.grossAmount ?? 0) === 0
                                ? 0
                                : (orderDetail?.grossAmount ?? 0) -
                                    orderDetail?.admin_fee -
                                    orderDetail?.service_fee +
                                    (orderDetail?.is_promo_available ?? false
                                      ? orderDetail?.promo_price ?? 0
                                      : 0)
                            )}`
                          : ''}
                      </Typography>
                    </div>
                  )}

                {/* Admin Fee */}
                {(orderDetail?.grossAmount ?? 0) > 0 &&
                qRisList !== undefined &&
                (orderDetail?.admin_fee ?? 0) > 0 ? (
                  <div className="flex flex-row justify-between mb-5">
                    <Typography className="text-sm font-semibold text-[#BDBDBD]">
                      {t('quiz.payment.adminFee')}
                    </Typography>
                    <Typography className="text-sm font-semibold text-[#262626]">
                      {orderDetail?.currency !== undefined &&
                        `${(
                          orderDetail?.currency ?? 'IDR'
                        )?.toUpperCase()} ${standartCurrency(
                          orderDetail?.admin_fee ?? 0
                        )}`}
                    </Typography>
                  </div>
                ) : (
                  ''
                )}

                {/* Service Fee */}
                {(orderDetail?.grossAmount ?? 0) > 0 &&
                (orderDetail?.service_fee ?? 0) > 0 ? (
                  <div className="flex flex-row justify-between mb-5">
                    <Typography className="text-sm font-semibold text-[#BDBDBD]">
                      {t('quiz.payment.serviceFee')}
                    </Typography>
                    <Typography className="text-sm font-semibold text-[#262626]">
                      {orderDetail?.currency !== undefined &&
                      orderDetail.grossAmount !== undefined
                        ? `${(
                            orderDetail?.currency ?? 'IDR'
                          )?.toUpperCase()} ${standartCurrency(
                            orderDetail?.service_fee ?? 0
                          )}`
                        : ''}
                    </Typography>
                  </div>
                ) : (
                  ''
                )}

                {/* Discount Fee */}
                {(orderDetail?.grossAmount ?? 0) > 0 &&
                  paymentSelected?.length > 0 && (
                    <div>
                      {(orderDetail?.is_promo_available ?? false) && (
                        <div className="flex flex-row justify-between mb-5">
                          <Typography className="text-sm font-semibold text-[#BDBDBD]">
                            {t('quiz.payment.discountFee')}
                          </Typography>
                          <Typography className="text-sm font-semibold text-[#262626]">
                            {orderDetail?.currency !== undefined
                              ? `- ${(
                                  orderDetail?.currency ?? 'IDR'
                                )?.toUpperCase()} ${standartCurrency(
                                  orderDetail?.promo_price ?? 0
                                )}`
                              : ''}
                          </Typography>
                        </div>
                      )}
                    </div>
                  )}

                {/* Discount Coins */}
                <div>
                  {orderDetail?.currency !== undefined &&
                    orderDetail?.seeds_coin !== undefined &&
                    (orderDetail?.grossAmount ?? 0) > 0 &&
                    detailQuiz !== undefined &&
                    orderDetail?.seeds_coin !== 0 && (
                      <div className="flex flex-row justify-between mb-5">
                        <Typography className="text-sm font-semibold text-[#BDBDBD]">
                          {t('quiz.payment.discountCoins')}
                        </Typography>
                        <Typography className="text-sm font-semibold text-[#262626]">
                          {`- ${(
                            orderDetail?.currency ?? 'IDR'
                          )?.toUpperCase()} ${standartCurrency(
                            orderDetail?.seeds_coin ?? 0
                          )}`}
                        </Typography>
                      </div>
                    )}
                </div>
                <hr />

                {/* Total Amount */}
                <div className="flex flex-row justify-between my-5">
                  <Typography className="text-sm font-semibold text-[#BDBDBD]">
                    {t('quiz.payment.totalAmount')}
                  </Typography>
                  <Typography className="text-sm font-semibold text-[#262626]">
                    {orderDetail?.currency !== undefined &&
                      `${(
                        orderDetail?.currency ?? 'IDR'
                      )?.toUpperCase()} ${standartCurrency(
                        orderDetail?.grossAmount ?? 0
                      )}`}
                  </Typography>
                </div>
                <div className="flex flex-row justify-between mb-5">
                  <Typography className="text-sm font-semibold text-[#BDBDBD]">
                    {t('quiz.payment.idTransaction')}
                  </Typography>
                  <Typography className="text-sm font-semibold text-[#262626] text-right truncate">
                    {orderDetail?.transactionId === ''
                      ? '-'
                      : `${orderDetail?.transactionId ?? ''}`}
                  </Typography>
                </div>
              </Card>

              {orderDetail !== undefined && (
                <VirtualAccountStep
                  setIsLoading={setIsLoading}
                  orderDetail={orderDetail}
                  id={id}
                />
              )}

              <div className="w-full flex flex-col items-center justify-center">
                {(orderDetail?.paymentMethod?.includes('BNC') ?? false) && (
                  <Button
                    className="w-full text-sm font-semibold bg-seeds-button-green mt-10 rounded-full capitalize"
                    onClick={async () => {
                      void handleViewQR();
                    }}
                  >
                    {t('bnc.seeQRCode')}
                  </Button>
                )}
                <Button
                  className={`${
                    orderDetail?.paymentMethod?.includes('BNC') ?? false
                      ? 'mt-4'
                      : 'mt-10'
                  } w-full text-sm font-semibold bg-seeds-button-green rounded-full capitalize`}
                  onClick={() => {
                    const formattedText = (text: string): string => {
                      return text
                        .split('|')[1]
                        .replaceAll(/[^a-zA-Z0-9_-]/g, '_');
                    };
                    TrackerEvent({
                      event: swtracker.quiz.payment,
                      userData: userInfo,
                      paymentData: {
                        ...orderDetail,
                        itemName:
                          formattedText(orderDetail?.itemName as string)
                            .length > 50
                            ? formattedText(
                                orderDetail?.itemName as string
                              ).substring(0, 50)
                            : formattedText(orderDetail?.itemName as string),
                        statusPayment: 'PAID'
                      }
                    });
                    void router.replace(
                      `/play/quiz/${orderDetail?.itemId as string}/start`
                    );
                  }}
                >
                  {t('quiz.payment.close')}
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
