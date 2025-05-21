import TagEvent from './tag.component';

const PHK = (): React.ReactElement => {
  return (
    <div className="flex justify-center items-center px-4 md:px-0 md:py-16 py-6">
      <div className="flex flex-col justify-center items-center gap-2 md:gap-6 md:w-[85%]">
        <TagEvent text="Berita Terkini" />
        <p className="font-semibold lg:text-4xl text-base text-neutral-medium text-center">
          Inovasi Web3 Lainnya
        </p>
        <p className="text-sm lg:text-base text-neutral-soft text-left md:text-center">
          Beragam inovasi di sektor keuangan dan investasi terus berkembang,
          menghadirkan peluang serta solusi yang semakin menarik.
        </p>
      </div>
    </div>
  );
};

export default PHK;
