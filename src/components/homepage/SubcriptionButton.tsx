import { Typography } from '@material-tailwind/react';
import Image, { type StaticImageData } from 'next/image';
import Link from 'next/link';
import { HiMiniCheckBadge } from 'react-icons/hi2';
import { IoArrowForwardCircleOutline } from 'react-icons/io5';
import TagMember from '../../assets/homepage/subcription-buttons/acsesoris-button-subcription.png';
import GoldVector from '../../assets/homepage/subcription-buttons/gold-vector.png';
import PlatinumVector from '../../assets/homepage/subcription-buttons/platinum-vector.png';
import SilverVector from '../../assets/homepage/subcription-buttons/silver-vector.png';
import TagVector from '../../assets/homepage/subcription-buttons/tag-vector.png';
import SubcriptionVector from '../../assets/homepage/subcription-buttons/vektor-1.png';
import CButton from '../CButton';

interface SubcriptionButtonProps {
  onClick?: () => void;
  classname?: string;
  classNameText?: string;
  href: string;
  tagText?: string;
  title: string | null;
  description: string;
  icon: StaticImageData;
  type: 'subscribe' | 'silver' | 'gold' | 'platinum';
}

export const SubcriptionButton: React.FC<SubcriptionButtonProps> = ({
  classname,
  onClick,
  href,
  tagText = null,
  classNameText = null,
  title,
  description,
  icon,
  type = 'subscribe'
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const bgColors: Record<string, string> = {
    subscribe: 'bg-gradient-to-r from-[#7555DA] to-[#6643d8]', // Ungu
    silver: 'bg-gradient-to-r from-gray-100 to-gray-300', // Silver
    gold: 'bg-gradient-to-b from-[#FDBA22] via-[#FEDE7B] to-[#FDBA22]', // Gold
    platinum: 'bg-gradient-to-b from-[#106B6E] via-[#50A68B] to-[#38C19E]' // Platinum
  };

  return (
    <Link href={href ?? '/'} passHref>
      <div className="relative">
        {/* Tag Vector di pojok kanan atas */}
        {type === 'subscribe' && tagText !== null ? (
          <div className="relative">
            <div className="absolute w-[200px] h-auto z-10 -right-[18px] top-0">
              {/* Image sebagai patokan posisi */}
              <Image src={TagVector} alt={'#'} className="w-full h-auto" />

              {/* Text di dalam div yang mengikuti ukuran Image */}
              <div className="absolute top-0 left-0 h-full gap-2 pb-4 text-white w-full flex items-center justify-center">
                <Typography className="font-extrabold sm:text-lg text-[16px]">
                  {tagText}
                </Typography>
                <HiMiniCheckBadge size={24} />
              </div>
            </div>
          </div>
        ) : (
          tagText !== null && (
            <div className="relative">
              <div className="absolute w-[180px] z-10 -right-[26px] -top-[1rem]">
                {/* Image sebagai patokan posisi */}
                <Image src={TagMember} alt={'#'} />

                {/* Text di dalam div yang mengikuti ukuran Image */}
                <Typography className=" absolute top-[52px] right-[4px] w-full h-[40px] text-center text-white text-[16px] font-extrabold flex items-center justify-center rotate-[43deg] -translate-y-2 translate-x-4">
                  {tagText}
                </Typography>
              </div>
            </div>
          )
        )}
        <CButton
          onClick={onClick ?? (() => {})}
          className={`w-full h-40 ${
            bgColors[type] ?? bgColors.subscribe
          } relative rounded-2xl overflow-hidden px-4 py-4`}
        >
          {type === 'subscribe' ? (
            <Image
              src={SubcriptionVector}
              alt={'#'}
              objectFit="cover"
              className="absolute  left-0  2xl:w-[25%] xl:w-[40%]  lg:w-[60%] w-[70%] z-0"
            />
          ) : (
            <Image
              src={
                type === 'silver'
                  ? SilverVector
                  : type === 'gold'
                  ? GoldVector
                  : PlatinumVector
              }
              alt={'#'}
              className="absolute -left-[50px] 2xl:-top-[50%] xl:-top-[40%] sm:-top-[50%] -top-[25%]  2xl:w-[600px] xl:w-[550px] lg:w-[500px] w-[600px]  z-0"
            />
          )}
          <div className="relative flex flex-col justify-start items-start h-full w-full">
            <div className="flex flex-row justify-between ">
              <div className="bg-gray-400 bg-opacity-20 p-2 rounded-full">
                <Image src={icon} alt={'#'} className="w-[60px]" />
              </div>
            </div>
            <div
              className={`flex flex-row justify-between items-end w-full ${
                classNameText !== null ? classNameText : ''
              }`}
            >
              <div className="flex flex-col items-start justify-start text-start">
                <Typography className="font-bold xl:text-xl sm:text-lg text-sm">
                  {title}
                </Typography>
                <Typography className="font-medium sm:text-sm text-[11px] ">
                  {description}
                </Typography>
              </div>
              <div
                className={`flex flex-col justify-end items-end h-full ${
                  type !== 'subscribe' ? 'mt-2' : ''
                }`}
              >
                <IoArrowForwardCircleOutline size={40} />
              </div>
            </div>
          </div>
        </CButton>
      </div>
    </Link>
  );
};
