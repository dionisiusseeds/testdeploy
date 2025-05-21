import CardGradient from '@/components/ui/card/CardGradient';
import PageGradient from '@/components/ui/page-gradient/PageGradient';
interface props {
  children: React.ReactNode;
}

const CirclePaymentLayout: React.FC<props> = ({ children }) => {
  return (
    <PageGradient className="z-0 relative flex flex-col items-center">
      <CardGradient
        extraClasses={`w-[100%] sm:rounded-[18px] h-fit bg-white sm:p-6 py-6 rounded-[16px] shadow-md`}
      >
        {children}
      </CardGradient>
    </PageGradient>
  );
};

export default CirclePaymentLayout;
