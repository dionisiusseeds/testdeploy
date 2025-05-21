const WhatSeeds = (): React.ReactElement => {
  return (
    <div className="flex flex-col-reverse md:flex-row gap-8 md:gap-16">
      <div className="flex flex-col gap-3 md:w-1/2 w-full justify-center">
        <div className="flex flex-col gap-2">
          <p className="font-medium md:font-semibold text-[#3AC4A0] text-sm md:text-lg">
            #MulaiDariSeeds
          </p>
          <p className="font-semibold text-neutral-medium text-base md:text-2xl">
            Seeds, Where Gaming Meets Investing!
          </p>
        </div>
        <p className="font-normal text-neutral-soft md:text-base text-sm text-justify">
          Seeds adalah{' '}
          <span className="text-[#3AC4A0] font-semibold">
            aplikasi investasi inovatif
          </span>{' '}
          yang menggabungkan{' '}
          <span className="text-[#3AC4A0] font-semibold">
            perdagangan virtual, gamifikasi, dan edukasi
          </span>{' '}
          dalam satu platform. Dengan pendekatan{' '}
          <span className="text-[#3AC4A0] font-semibold">social investing</span>
          , Seeds membantu kamu belajar, berlatih, dan berkembang sebagai
          investor yang lebih cerdas—dengan cara yang seru dan tanpa risiko!
          Mulai perjalanan investasimu sekarang dan tumbuh bersama komunitas
          Seeds!
        </p>
      </div>
      <div className="md:w-1/2 w-full flex justify-center items-center">
        <iframe
          src="https://youtube.com/embed/Du5qHkUxksg?autoplay=1&controls=0&modestbranding=1&showinfo=0&rel=0&mute=1&playsinline=1&loop=1&playlist=Du5qHkUxksg"
          title="Seeds ads"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-[171.33px] h-[304.67px] sm:w-[257px] sm:h-[457px] rounded-xl"
        ></iframe>
      </div>
    </div>
  );
};

export default WhatSeeds;
