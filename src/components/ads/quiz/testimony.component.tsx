import testi1 from '@/assets/landing-page/testi1.jpg';
import testi2 from '@/assets/landing-page/testi2.jpg';
import testi3 from '@/assets/landing-page/testi3.jpg';
import testi4 from '@/assets/landing-page/testi4.jpg';
import testi5 from '@/assets/landing-page/testi5.jpg';
import { Card } from '@material-tailwind/react';
import Image from 'next/image';
import line from 'public/assets/ads/line.svg';
import star from 'public/assets/ads/star.png';
import React from 'react';

const testimony = [
  {
    avatar: testi1,
    name: 'Andhika',
    title: 'Juara 1 US Stocks',
    comment:
      '“Seru dan menantang! Bisa belajar investasi sambil bersaing dengan pemain”',
    star: 5
  },
  {
    avatar: testi2,
    name: 'Amiyeri',
    title: 'Juara 2 Indo Stocks',
    comment:
      '“Hadiah jutaan rupiah bikin makin semangat! Kuisnya juga bermanfaat banget.”',
    star: 4
  },
  {
    avatar: testi3,
    name: 'Ariandra',
    title: 'Juara 3 Web3',
    comment:
      '“Seru! Bisa uji pengetahuan kripto sambil naik peringkat di leaderboard!”',
    star: 4
  },
  {
    avatar: testi4,
    name: 'Syalwa',
    title: 'Juara 1 Finance',
    comment:
      '“Bersaing di leaderboard itu nagih! Ditambah hadiahnya bikin makin semangat.”',
    star: 5
  },
  {
    avatar: testi5,
    name: 'Fitria',
    title: 'Juara 2 Forex',
    comment:
      '“Seru banget! Bisa belajar, bersaing, dan dapat hadiah. Bikin ketagihan!”',
    star: 3
  }
];

const Testimony = ():React.ReactElement => {
  return (
          <section className="px-4 md:px-0 flex flex-col gap-4 md:gap-12">
            <p className="font-semibold text-base md:text-4xl text-center text-neutral-medium">
              Apa Kata Pemain Tentang Kuis Kami?
            </p>
            <div className="relative flex gap-8 h-96 justify-center items-center overflow-hidden">
              <div className="flex gap-8 animate-infinite-line z-10">
                {[...testimony, ...testimony].map((v, j) => (
                  <Card
                    className="flex flex-col justify-between gap-5 w-80 h-72 z-10 p-8 bg-[#F3F3F3]"
                    key={j}
                  >
                    <div className="flex gap-3 items-center">
                      <Image
                        className="w-16 rounded-full aspect-square "
                        src={v.avatar}
                        alt={v.name}
                      />
                      <div className="flex flex-col gap-1 justify-center">
                        <p className="font-semibold text-[#201B1C] text-xl">
                          {v.name}
                        </p>
                        <p className="font-light text-[#106B6E] text-base">
                          {v.title}
                        </p>
                      </div>
                    </div>
                    <i className="font-light text-lg text-[#201B1C]">{v.comment}</i>
                    <div className="flex gap-1 items-center">
                      <p>{v.star}/5</p>
                      {Array.from({ length: v.star }).map((_, i) => (
                        <Image key={i} src={star} alt="star" />
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
              <div className="flex gap-8 animate-infinite-line z-10">
                {[...testimony, ...testimony].map((v, j) => (
                  <Card
                    className="flex flex-col justify-between gap-5 w-80 h-72 z-10 p-8 bg-[#F3F3F3]"
                    key={j}
                  >
                    <div className="flex gap-3 items-center">
                      <Image
                        className="w-16 rounded-full aspect-square "
                        src={v.avatar}
                        alt={v.name}
                      />
                      <div className="flex flex-col gap-1 justify-center">
                        <p className="font-semibold text-[#201B1C] text-xl">
                          {v.name}
                        </p>
                        <p className="font-light text-[#106B6E] text-base">
                          {v.title}
                        </p>
                      </div>
                    </div>
                    <i className="font-light text-lg text-[#201B1C]">{v.comment}</i>
                    <div className="flex gap-1 items-center">
                      <p>{v.star}/5</p>
                      {Array.from({ length: v.star }).map((_, i) => (
                        <Image key={i} src={star} alt="star" className="h-full" />
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
              <Image src={line} alt="line" className="absolute z-0" />
            </div>
          </section>
  )
}

export default Testimony