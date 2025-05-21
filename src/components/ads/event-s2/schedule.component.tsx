import { Card } from '@material-tailwind/react';
import Image from 'next/image';
import Circle1 from 'public/assets/ads/1-circle.png';
import Circle2 from 'public/assets/ads/2-circle.png';
import Circle3 from 'public/assets/ads/3-circle.png';
import Circle4 from 'public/assets/ads/4-circle.png';
import calendar from 'public/assets/ads/calendar.png';
import clock from 'public/assets/ads/clock.png';
import flow from 'public/assets/ads/flow.png';
import schedules from 'public/assets/ads/schedules.png';
import zoom from 'public/assets/ads/zoom.png';
import TagEvent from '../event/tag.component';

const list = [
  {
    img: schedules,
    title: 'Timeline Bootcamp',
    list: [
      {
        img: calendar,
        txt: (
          <p className="text-sm lg:text-base text-neutral-soft">
            Sabtu, 24 Mei 2025
          </p>
        )
      },
      {
        img: clock,
        txt: (
          <p className="text-sm lg:text-base text-neutral-soft">
            Pukul 09.00 WIB - 12.00 WIB
          </p>
        )
      },
      {
        img: zoom,
        txt: (
          <p className="text-sm lg:text-base text-neutral-soft">
            Via Zoom Online
          </p>
        )
      }
    ]
  },
  {
    img: flow,
    title: 'Cara Bergabung?',
    list: [
      {
        img: Circle1,
        txt: (
          <p className="text-sm lg:text-base text-neutral-soft">
            Daftar diri kamu dengan mengklik{' '}
            <span className="font-semibold text-neutral-medium">
              Daftar Sekarang
            </span>
          </p>
        )
      },
      {
        img: Circle2,
        txt: (
          <p className="text-sm lg:text-base text-neutral-soft">
            Lakukan{' '}
            <span className="font-semibold text-neutral-medium">
              step by step
            </span>{' '}
            yang di arahkan
          </p>
        )
      },
      {
        img: Circle3,
        txt: (
          <p className="text-sm lg:text-base text-neutral-soft">
            Jika sudah{' '}
            <span className="font-semibold text-neutral-medium">
              Berhasil Registrasi
            </span>
            , Tunggu tanggal mulai nya
          </p>
        )
      },
      {
        img: Circle4,
        txt: (
          <p className="text-sm lg:text-base text-neutral-soft">
            <span className="font-semibold text-neutral-medium">
              Ikuti bootcamp seeds academy
            </span>{' '}
            nya sampai dengan akhir
          </p>
        )
      }
    ]
  }
];

const Schedule = (): React.ReactElement => {
  return (
    <div className="flex justify-center items-center px-4 md:px-0 md:py-16 py-6">
      <div className="flex flex-col justify-center items-center gap-6 md:w-[85%]">
        <TagEvent text="Investasi Masa Depan" />
        <p className="font-semibold lg:text-4xl text-base text-neutral-medium text-center">
          Kapan Pelaksanaannya & Bagaimana Cara Bergabung ?
        </p>
        <div className="w-full flex gap-8 flex-col sm:flex-row">
          {list.map((v, i) => (
            <Card
              key={i}
              className="w-full flex flex-col gap-4 lg:gap-6 p-4 lg:p-6"
            >
              <Image src={v.img} alt="image" />
              <p className="text-sm lg:text-2xl text-neutral-medium font-semibold text-left">
                {v.title}
              </p>
              <div className="w-full flex-col flex gap-3 lg:gap-4">
                {v.list.map((vl, j) => (
                  <div key={j} className="flex gap-2.5">
                    <Image src={vl.img} alt="imageList" className='flex-shrink-0 w-6 h-6' />
                    {vl.txt}
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Schedule;
