import PaymentList from '@/containers/subscription/payment/PaymentList';
import withAuth from '@/helpers/withAuth';

const PlayPayment = (): JSX.Element => {
  return <PaymentList />;
};

export default withAuth(PlayPayment);
