import ChangePlan from '@/assets/seedsplan/change-plan.svg';
import { Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { IoCloseSharp } from 'react-icons/io5';

interface ModalChangePlanProps {
  isOpen: boolean;
  onClose: () => void;
  packagePlan: string;
}

const ModalChangePlan: React.FC<ModalChangePlanProps> = ({
  isOpen,
  onClose,
  packagePlan
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  if (!isOpen) return null;
  return (
    <>
      <div className="fixed inset-0 bg-black opacity-50 z-40" />
      <div className="fixed inset-0 flex items-end justify-center md:items-center z-50">
        <div className="bg-white lg:rounded-[30px] rounded-t-[30px] overflow-hidden w-full lg:w-[535px] max-h-[570px] border-2 p-2">
          <div className="flex justify-end mr-2 mt-2">
            <button
              onClick={onClose}
              className="transform scale-100 hover:scale-110 transition-transform duration-300"
            >
              <IoCloseSharp size={30} />
            </button>
          </div>
          <div className="flex flex-col justify-center items-center gap-5">
            <Image
              src={ChangePlan}
              alt="Change Plan"
              width={185}
              height={215}
            />
            <div className="flex flex-col justify-center items-center gap-3 max-w-[400px]">
              <Typography className="lg:text-2xl text-xl font-poppins font-semibold">
                {t('seedsPlan.modalChangePlan.title')}
              </Typography>
              <Typography className="lg:text-xl text-base font-poppins lg:font-light font-normal text-center">
                {t('seedsPlan.modalChangePlan.description')}
              </Typography>
            </div>
          </div>
          <div className="flex justify-center items-center flex-row my-4 gap-4 mx-4">
            <div
              onClick={onClose}
              className="w-full md:w-[90%] text-base text-[#3AC4A0] border border-[#3AC4A0] font-semibold text-center rounded-full py-2 cursor-pointer transform scale-100 hover:scale-105 transition-transform duration-300"
            >
              {t('seedsPlan.modalChangePlan.button1')}
            </div>
            <div
              onClick={async () => {
                await router.push(`/seedsplan/payment?type=${packagePlan}`);
              }}
              className="w-full md:w-[90%] text-base text-[#262626] bg-[#3AC4A0] border border-[#3AC4A0] font-semibold text-center rounded-full py-2 cursor-pointer transform scale-100 hover:scale-105 transition-transform duration-300"
            >
              {t('seedsPlan.modalChangePlan.button2')}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalChangePlan;
