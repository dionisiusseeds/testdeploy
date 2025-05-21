import React from 'react';
import { useTranslation } from 'react-i18next';
import { IoCloseSharp } from 'react-icons/io5';

interface TncProps {
  isOpen: boolean;
  onClose: () => void;
  tnc: string;
}

const TncSeedsplan: React.FC<TncProps> = ({ isOpen, onClose, tnc }) => {
  const { t } = useTranslation();
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black opacity-50 z-40" />
      <div className="fixed inset-0 flex items-end justify-center md:items-center z-50">
        <div className="bg-white rounded-t-2xl md:rounded-2xl overflow-hidden w-full md:w-3/4 lg:w-1/2 border-2 py-4 px-8">
          <div className="flex justify-between py-4">
            <div className="font-semibold">{t('seedsPlan.button1')}</div>
            <button
              onClick={onClose}
              className="transform scale-100 hover:scale-110 transition-transform duration-300"
            >
              <IoCloseSharp size={30} />
            </button>
          </div>
          <div className="overflow-y-auto h-60 pe-2 tnc-seedsplan-custom-scroll">
            <div
              className="text-justify"
              dangerouslySetInnerHTML={{ __html: tnc }}
            />
          </div>
          <div className="py-4 flex flex-col gap-3 items-center">
            <button
              onClick={onClose}
              className="w-full md:w-1/2 bg-[#3AC4A0] font-semibold py-2 px-4 rounded-3xl transform scale-100 hover:scale-105 transition-transform duration-300"
            >
              {t('seedsPlan.button4')}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TncSeedsplan;
