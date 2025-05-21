import { setTranslationToLocalStorage } from '@/helpers/translation';
import LanguageContext from '@/store/language/language-context';
import {
  Button,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Typography
} from '@material-tailwind/react';
import Image from 'next/image';
import AuthArrowDown from 'public/assets/ads/AuthArrowDown.svg';
import AuthGlobeLanguage from 'public/assets/ads/AuthGlobeLanguage.svg';
import background from 'public/assets/ads/background-demo-play.png';
import backgroundLittle from 'public/assets/ads/background2.png';
import icon from 'public/assets/ads/playing.png';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';

const languageList = [
  { id: 1, language: 'ID' },
  { id: 2, language: 'EN' }
];

const Header = ({
  handleState
}: {
  handleState: () => void;
}): React.ReactElement => {
  const { t } = useTranslation();
  const languageCtx = useContext(LanguageContext);
  const [selectedLanguage, setSelectedLanguage] = useState<'EN' | 'ID'>('EN');

  const [open, setOpen] = useState(false);

  const handleLanguageChange = async (language: 'EN' | 'ID'): Promise<void> => {
    setSelectedLanguage(language);
    languageCtx.languageHandler(language);
    await setTranslationToLocalStorage(language);
    setOpen(!open);
  };

  return (
    <div className="relative flex flex-col sm:flex-row justify-center gap-5 sm:gap-[8%] items-center h-screen px-[4%] sm:py-[6%] pt-[6%] bg-[#5263F9]">
      <Image
        src={background}
        alt="background"
        className="absolute right-0 h-screen w-1/2 hidden sm:block"
      />
      <Image
        src={backgroundLittle}
        alt="background2"
        className="absolute bottom-0 right-0 w-1/2 sm:hidden"
      />

      <div className="font-poppins flex flex-col justify-center gap-5 z-10 h-1/2 md:h-auto">
        <Menu open={open} handler={setOpen}>
          <MenuHandler>
            <Button
              ripple={false}
              className="flex justify-between items-center lg:w-[136.62px] w-[97px] bg-white rounded-full lg:p-2.5 px-2.5 py-1"
            >
              <div className="flex lg:gap-1.5 gap-[3px] items-center">
                <Image
                  src={AuthGlobeLanguage}
                  alt="AuthGlobeLanguage"
                  className="w-[19px] lg:w-fit"
                />
                <Typography className="font-normal font-poppins text-xl text-[#5263F9]">
                  {selectedLanguage}
                </Typography>
              </div>

              <Image
                src={AuthArrowDown}
                alt="AuthArrowDown"
                className={`w-[12px] lg:w-fit ${
                  open ? 'transition-all rotate-180' : 'transition-all rotate-0'
                }`}
              />
            </Button>
          </MenuHandler>
          <MenuList
            className={`flex min-w-fit flex-col items-center p-0 bg-transparent border-none shadow-none`}
          >
            {languageList
              .filter(item => item.language !== selectedLanguage)
              .map((item, index) => {
                return (
                  <MenuItem
                    className="p-0 lg:w-[136.62px] w-[97px] bg-white rounded-full"
                    onClick={() => {
                      void handleLanguageChange(item.language as 'EN' | 'ID');
                    }}
                    key={index.toString()}
                  >
                    <Button
                      ripple={false}
                      className="flex justify-between items-center lg:w-[136.62px] w-[97px] bg-white rounded-full lg:p-2.5 px-2.5 py-1 hover:shadow-none shadow-none"
                    >
                      <div className="flex lg:gap-1.5 gap-[3px] items-center">
                        <Image
                          src={AuthGlobeLanguage}
                          alt="AuthGlobeLanguage"
                          className="w-[19px] lg:w-fit"
                        />
                        <Typography className="font-normal font-poppins text-xl text-[#5263F9]">
                          {item.language}
                        </Typography>
                      </div>
                    </Button>
                  </MenuItem>
                );
              })}
          </MenuList>
        </Menu>
        <p className="text-2xl sm:text-xl md:text-2xl lg:text-3xl xl:text-5xl text-white">
          {t('demo.text1')}
        </p>
        <p className="text-sm sm:text-base text-[#F9F9F9]">{t('demo.text2')}</p>
        <Button
          onClick={handleState}
          className="self-center sm:self-auto w-fit bg-gradient-to-b rounded-full capitalize font-poppins font-semibold lg:text-xl text-base border-b-2 border-b-[#96F7C1] bg-[#3AC4A0]"
        >
          Play Demo
        </Button>
      </div>
      <Image src={icon} alt="icon" className="w-full sm:w-1/2 z-10" />
    </div>
  );
};

export default Header;
