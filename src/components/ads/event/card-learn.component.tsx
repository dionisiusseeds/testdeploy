import Image, { type StaticImageData } from 'next/image';
import React from 'react';
import { FiCheck } from 'react-icons/fi';

const CardLearn = ({
  img,title,list
}: {
  img: StaticImageData;
  title: string;
  list: string[];
}): React.ReactElement => {
  return (
    <div className='flex flex-col gap-6 lg:gap-8'>
      <Image src={img} alt={title} />
      <div className="flex flex-col gap-3">
        <p className="font-semibold text-neutral-medium lg:text-2xl text-base">{title}</p>
        {list?.map((v, i) => (
          <div className="flex gap-3" key={i}>
            <FiCheck className="text-[#4FE6AF] rounded-full bg-[#DCFCE4] p-1 w-5 h-5 md:w-7 md:h-7 flex-shrink-0" />
            <p className="text-neutral-soft w-fit text-sm md:text-base">
              <span className="font-semibold text-neutral-medium">{v}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardLearn