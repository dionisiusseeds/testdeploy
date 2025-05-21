import CCard from '@/components/CCard';
import { SubcriptionButton } from '@/components/homepage/SubcriptionButton';
import UseGetStatusSubcriptionPlan from '@/hooks/plans/UseGetStatusSubcriptions';

const SubscriptionSection = (): JSX.Element => {
  const { isLoading, selectedPlan } = UseGetStatusSubcriptionPlan();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return selectedPlan != null ? (
    <section className="w-full flex flex-col gap-12">
      <CCard className="p-3 mb-5 h-auto rounded-none shadow-none flex-col gap-2">
        <SubcriptionButton {...selectedPlan} />
      </CCard>
    </section>
  ) : (
    <></>
  ); // Jika tidak ada paket yang dipilih, tidak menampilkan apa pun
};

export default SubscriptionSection;
