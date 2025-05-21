import { getQuizLeaderboard } from '@/repository/quiz.repository';
import Image from 'next/image';
import blurBottom from 'public/assets/ads/blur-bottom.png';
import blurTop from 'public/assets/ads/blur-top.png';
import first from 'public/assets/ads/first.png';
import kotak from 'public/assets/ads/kotak.png';
import second from 'public/assets/ads/second.png';
import third from 'public/assets/ads/third.png';
import React, { useCallback, useEffect, useState } from 'react';

interface Root {
  id: string;
  quiz_id: string;
  user_id: string;
  name: string;
  seeds_tag: string;
  bio: string;
  avatar: string;
  verified: boolean;
  is_followed: boolean;
  scores: number;
  total_play: number;
  total_win: number;
  total_lose: number;
  win_rate: number;
  current_rank: number;
  created_at: string;
  updated_at: string;
  total_prizes: number;
}

const PodiumQuiz = (): React.ReactElement => {
  const [data, setData] = useState<Root[]>([]);

  const handleRes = useCallback(async () => {
    const res = await getQuizLeaderboard({ page: 1, limit: 6 });
    setData(res.data);
  }, []);
  useEffect(() => {
    void handleRes();
  }, []);
  return (
    <div className="flex flex-col gap-8 md:gap-16 items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-2 md:gap-4">
        <p className="font-semibold text-base md:text-4xl text-center text-neutral-medium">
          🏆 Siapa yang Memimpin Permainan?
        </p>
        <p className="font-normal text-neutral-soft text-xs md:text-base text-center">
          Persaingan semakin seru! 🔥 Lihat papan peringkat dan cek posisimu di
          antara para pemain terbaik. Terus bermain, kumpulkan poin, dan raih
          posisi teratas untuk hadiah eksklusif!
        </p>
      </div>
      <div className="flex flex-col">
        <div className="relative">
          <div className="absolute flex justify-between w-full h-full ps-[11%] pe-[9%]">
            <div className="flex flex-col items-center w-[18%] mt-[3%]">
              <p className="font-semibold text-neutral-medium text-xs sm:text-sm md:text-xl text-center">
                {data.find(v => v?.current_rank === 2)?.name ?? 'Winner'}
              </p>
              <div className="relative w-full">
                <img
                  src={data.find(v => v?.current_rank === 2)?.avatar}
                  alt={data.find(v => v?.current_rank === 2)?.name}
                  className="w-full rounded-full aspect-square bg-[#F4CE9B]"
                />
                <Image
                  src={second}
                  alt="second"
                  className="absolute w-[70%] rounded-full aspect-square -right-[20%] -bottom-[20%]"
                />
              </div>
              <div className="mt-[15%] sm:gap-4 flex flex-col justify-center items-center">
                <p className="font-semibold text-neutral-medium text-xl sm:text-3xl md:text-4xl lg:text-5xl">
                  2
                </p>
                <p className="font-semibold text-neutral-medium text-xs sm:text-sm md:text-base lg:text-xl text-center">
                  Runner Up
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center w-[21%] -mt-[5%]">
              <p className="font-semibold text-neutral-medium text-xs sm:text-sm md:text-xl text-center">
                {data.find(v => v?.current_rank === 1)?.name ?? 'Winner'}
              </p>
              <div className="relative w-full">
                <img
                  className="w-full rounded-full aspect-square bg-[#B4E5BC]"
                  src={data.find(v => v?.current_rank === 1)?.avatar}
                  alt={data.find(v => v?.current_rank === 1)?.name}
                />
                <Image
                  src={first}
                  alt="first"
                  className="absolute w-[70%] rounded-full aspect-square -right-[20%] -bottom-[20%]"
                />
              </div>
              <div className="mt-[15%] sm:gap-4 flex flex-col justify-center items-center">
                <p className="font-semibold text-neutral-medium text-xl sm:text-3xl md:text-4xl lg:text-5xl">
                  1
                </p>
                <p className="font-semibold text-neutral-medium text-xs sm:text-sm md:text-base lg:text-xl text-center">
                  Champion
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center w-[18%] mt-[3%]">
              <p className="font-semibold text-neutral-medium text-xs sm:text-sm md:text-xl text-center">
                {data.find(v => v?.current_rank === 3)?.name ?? 'Winner'}
              </p>
              <div className="relative w-full">
                <img
                  className="w-full rounded-full aspect-square bg-[#F3ABA7]"
                  src={data.find(v => v?.current_rank === 3)?.avatar}
                  alt={data.find(v => v?.current_rank === 3)?.name}
                />
                <Image
                  src={third}
                  alt="third"
                  className="absolute w-[70%] rounded-full aspect-square -right-[20%] -bottom-[20%]"
                />
              </div>
              <div className="mt-[15%] sm:gap-4 flex flex-col justify-center items-center">
                <p className="font-semibold text-neutral-medium text-xl sm:text-3xl md:text-4xl lg:text-5xl">
                  3
                </p>
                <p className="font-semibold text-neutral-medium text-xs sm:text-sm md:text-base lg:text-xl text-center">
                  Third Place
                </p>
              </div>
            </div>
          </div>
          <Image src={kotak} alt="kotak" />
          <Image
            src={blurTop}
            alt="blurTop"
            className="absolute z-10 -bottom-[13%] w-full"
          />
        </div>
        <div className="relative flex">
          <table className="w-full border-collapse z-20">
            <thead>
              <tr className="text-center text-sm sm:text-xl">
                <th className="font-normal text-neutral-medium text-left">
                  Peserta
                </th>
                <th className="font-normal text-neutral-medium">Hadiah</th>
              </tr>
            </thead>
            <tbody>
              {data?.slice(3, 6)?.map((participant, index) => (
                <tr key={index} className="text-center">
                  <td className="py-2 sm:py-4 sm:px-6 flex items-center gap-2 sm:gap-8 text-left">
                    <span className="font-semibold text-sm sm:text-xl text-neutral-medium">
                      {index + 3}
                    </span>
                    <img
                      src={participant?.avatar}
                      alt={participant?.name}
                      className="rounded-full w-8 sm:w-16 object-cover bg-black"
                    />
                    <span className="font-semibold text-xs sm:text-base text-neutral-medium">
                      {participant?.name}
                    </span>
                  </td>
                  <td className="font-semibold text-xs sm:text-base text-neutral-medium">
                    {Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      maximumFractionDigits: 0
                    }).format(participant?.total_prizes) ?? 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Image
            src={blurBottom}
            alt="blurBottom"
            className="absolute z-30 -bottom-[17%] md:-bottom-[25%] w-full"
          />
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-2 md:gap-4">
        <p className="font-semibold text-base md:text-4xl text-center text-neutral-medium">
          Main Sekarang & Lihat Papan Peringkat Lengkap!
        </p>
        <p className="font-normal text-neutral-medium text-xs md:text-base lg:text-2xl text-center">
          Jangan sampai ketinggalan siapa yang memimpin! Tantang dirimu,
          kumpulkan poin, dan raih hadiah luar biasa! 🔥
        </p>
      </div>
    </div>
  );
};

export default PodiumQuiz;
