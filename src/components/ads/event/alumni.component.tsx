import { Button, Card } from "@material-tailwind/react";
import Image from "next/image";
import Link from 'next/link';
import andi from 'public/assets/ads/andi.png';
import dimas from 'public/assets/ads/dimas.png';
import rian from 'public/assets/ads/rian.png';
import rina from 'public/assets/ads/rina.png';
import star from 'public/assets/ads/star.png';

const testimony = [
  {
    avatar: rina,
    name: 'Rina',
    title: 'Web3 Enthusiast',
    comment:
      '"Belajar di Seeds Academy itu seru dan aplikatif! Materinya up-to-date dan langsung bisa dipraktikkan."',
    star: 5
  },
  {
    avatar: dimas,
    name: 'Dimas',
    title: 'Investor Pemula',
    comment:
      '"Dari nol sampai paham konsep blockchain dan investasi! Komunitasnya juga suportif banget."',
    star: 4
  },
  {
    avatar: andi,
    name: 'Andi',
    title: 'Web3 Enthusiast',
    comment:
      '"Mentornya profesional dan pembelajarannya interaktif, investasi jadi lebih mudah!"',
    star: 4
  },
  {
    avatar: rian,
    name: 'Rian',
    title: 'Investor Pemula',
    comment:
      '"Seeds Academy benar-benar membuka wawasan! Sekarang aku lebih percaya diri dalam dunia Web3 & investasi."',
    star: 5
  }
];

const Alumni = (): React.ReactElement => {
  return (
    <div className="w-full bg-[#eff9f8] lg:px-20 lg:py-0 px-4 py-10 flex flex-col md:flex-row items-center gap-8 md:gap-0">
      <div className="w-full lg:w-1/2 xl:w-1/3 flex flex-col gap-6 items-center md:items-start">
        <div className="flex flex-col gap-2 lg:gap-6 text-center md:text-left">
          <p className="font-semibold text-neutral-medium text-base lg:text-xl xl:text-3xl">
            Kata Alumni: Bukti Nyata Perubahan!
          </p>
          <p className="font-normal text-neutral-medium text-sm lg:text-lg xl:text-2xl">
            Dengar langsung cerita mereka yang telah berkembang bersama Seeds
            Academy!
          </p>
        </div>
        <Link href="http://bit.ly/RspvSeedsAcademy" target="_blank">
          <Button className="w-fit rounded-full capitalize font-poppins font-semibold lg:text-lg xl:text-xl text-base bg-[#3AC4A0]">
            Daftar Sekarang
          </Button>
        </Link>
      </div>
      <div className="w-full lg:w-1/2 xl:w-2/3 flex gap-6 justify-center lg:justify-end 2xl:justify-center">
        <div className="flex flex-col gap-8 h-[414px] justify-center items-center overflow-hidden">
          {Array.from({ length: 2 }).map((_, k) => (
            <div className="flex flex-col gap-8 animate-vertical-line" key={k}>
              {[...testimony, ...testimony].map((v, j) => (
                <Card
                  className="flex flex-col justify-between gap-5 w-80 p-8 bg-[#F3F3F3]"
                  key={j}
                >
                  <i className="font-light text-lg text-[#201B1C]">
                    {v.comment}
                  </i>
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
                  <div className="flex gap-1 items-center">
                    <p>{v.star}/5</p>
                    {Array.from({ length: v.star }).map((_, i) => (
                      <Image key={i} src={star} alt="star" />
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          ))}
        </div>
        <div className="sm:flex flex-col gap-8 h-[414px] justify-center items-center overflow-hidden hidden md:hidden xl:flex">
          {Array.from({ length: 2 }).map((_, k) => (
            <div
              className="flex flex-col gap-8 animate-vertical-line-reverse"
              key={k}
            >
              {[...testimony, ...testimony].map((v, j) => (
                <Card
                  className="flex flex-col justify-between gap-5 w-80 p-8 bg-[#F3F3F3]"
                  key={j}
                >
                  <i className="font-light text-lg text-[#201B1C]">
                    {v.comment}
                  </i>
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
                  <div className="flex gap-1 items-center">
                    <p>{v.star}/5</p>
                    {Array.from({ length: v.star }).map((_, i) => (
                      <Image key={i} src={star} alt="star" />
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Alumni