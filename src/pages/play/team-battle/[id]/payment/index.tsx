import PaymentList from '@/containers/team-battle/payment/PaymentList';
import withAuth from '@/helpers/withAuth';

const PaymentBattle: React.FC = () => {
  return <PaymentList />;
};

export default withAuth(PaymentBattle);
