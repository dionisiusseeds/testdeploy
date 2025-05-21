import PromoCode from '@/containers/promo-code';
import withAuth from '@/helpers/withAuth';

const PromoCodeBattle: React.FC = () => {
  return (
    <div>
      <PromoCode spotType={'Paid Battle'} />
    </div>
  );
};

export default withAuth(PromoCodeBattle);
