import TagEvent from '../event/tag.component';

const PHK = (): React.ReactElement => {
  return (
    <div className="flex justify-center items-center px-4 md:px-0 md:py-16 py-6">
      <div className="flex flex-col justify-center items-center gap-2 md:gap-6 md:w-[85%]">
        <TagEvent text="Berita Terkini" />
        <p className="font-semibold lg:text-4xl text-base text-neutral-medium text-center">
          Inovasi Web3 Lainnya
        </p>
        <p className="text-sm lg:text-base text-neutral-soft md:text-center text-justify">
          Di tengah tuntutan ekonomi yang semakin kompleks, banyak orang mulai
          mencari sumber penghasilan tambahan atau side income. Salah satu
          metode yang semakin populer adalah melalui CFD Trading. Meski
          terdengar rumit, sebenarnya CFD Trading bisa diakses oleh siapa saja
          yang ingin belajar dan konsisten. Lalu, apa sebenarnya CFD itu, dan
          bagaimana bisa menjadi sumber side income yang menjanjikan?
        </p>
      </div>
    </div>
  );
};

export default PHK;
