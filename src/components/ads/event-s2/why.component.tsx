import Image from 'next/image';
import meet from 'public/assets/ads/meet.png';
import { FiCheck } from 'react-icons/fi';

const why = [
  {
    title: 'Belajar dari Ahli ',
    sub: '– Langsung dari praktisi Financial & Investment terbaik.'
  },
  {
    title: 'Pelatihan Praktis ',
    sub: '– Materi berbasis studi kasus & hands-on experience.'
  },
  {
    title: 'Komunitas Eksklusif ',
    sub: '– Bangun koneksi dengan traders lainnya.'
  },
  {
    title: 'Peluang Karier ',
    sub: '– Siapkan diri untuk industri digital masa depan.'
  }
];

const Why = (): React.ReactElement => {
  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-16">
      <div className="flex justify-center items-center lg:w-1/2 w-full">
        <Image src={meet} alt="meet" />
      </div>
      <div className="flex flex-col gap-3 lg:w-1/2 w-full justify-center">
        <div className="flex flex-col gap-2">
          <p className="font-semibold text-neutral-medium text-base md:text-2xl">
            Kenapa Kamu Harus Ikut Program Ini?
          </p>
        </div>
        <div className="flex flex-col gap-3">
          {why.map((v, i) => (
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
          Investasi Masa Depanmu? Hanya 🔥{' '}
          <span className="font-bold line-through text-base md:text-lg">
            Rp 150.000
          </span>{' '}
          <span className="font-bold text-red-500 text-lg md:text-xl">
            Rp 50.000
          </span>{' '}
          untuk{' '}
          <span className="font-bold text-neutral-medium text-lg md:text-xl">
            100
          </span>{' '}
          <span className="font-semibold text-neutral-medium">
            pendaftar pertama!
          </span>
        </p>
      </div>
    </div>
  );
};

export default Why;
