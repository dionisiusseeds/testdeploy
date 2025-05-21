import Image from 'next/image';
import phone from 'public/assets/ads/phone.png';
import { FiCheck } from 'react-icons/fi';

const benefit = [
  {
    title: 'Trading Virtual ',
    sub: '– Uji strategi investasimu tanpa risiko.'
  },
  {
    title: 'Belajar Sambil Main ',
    sub: '– Materi investasi dikemas seru dengan gamifikasi.'
  },
  {
    title: 'Komunitas Investor ',
    sub: '– Diskusi, berbagi insight, dan berkembang bersama.'
  },
  {
    title: 'Edukasi Lengkap ',
    sub: '– Bangun pemahaman investasi yang kuat dari para ahli.'
  }
];

const Benefit = (): React.ReactElement => {
  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
      <div className="flex justify-center items-center lg:w-1/2 w-full">
        <Image src={phone} alt="phone" />
      </div>
      <div className="flex flex-col gap-3 lg:w-1/2 w-full justify-center">
        <div className="flex flex-col gap-2">
          <p className="font-medium md:font-semibold text-[#3AC4A0] text-sm md:text-lg">
            Jadi Investor Cerdas dengan Cara Seru!
          </p>
          <p className="font-semibold text-neutral-medium text-base md:text-2xl">
            Keuntungan Gabung di Seeds
          </p>
        </div>
        <div className="flex flex-col gap-3">
          {benefit.map((v, i) => (
            <div className="flex gap-3" key={i}>
              <FiCheck className="text-[#4FE6AF] rounded-full bg-[#DCFCE4] p-1 w-5 h-5 md:w-7 md:h-7 flex-shrink-0" />
              <p className="text-neutral-soft w-fit text-sm md:text-base">
                <span className="font-semibold text-neutral-medium">
                  {v.title}
                </span>
                {v.sub}
              </p>
            </div>
          ))}
        </div>
        <p className="text-neutral-soft text-sm md:text-base">
          Gabung Seeds sekarang dan mulai perjalanan investasimu dengan cara
          yang lebih seru & cerdas!
        </p>
      </div>
    </div>
  );
};

export default Benefit;
