import { Button } from '@material-tailwind/react';
import { useState } from 'react';

const Buttonmarket = (): JSX.Element => {
  const [activeButton, setActiveButton] = useState('idStock');
  const handleButtonClick = (buttonName: string): void => {
    setActiveButton(buttonName);
  };

  return (
    <div className="flex flex-row gap-2">
      <Button
        className={`${
          activeButton === 'idStock'
            ? 'bg-[#3AC4A0]'
            : 'bg-white border-2 border-[#BDBDBD] text-[#BDBDBD]'
        }`}
        onClick={() => {
          handleButtonClick('idStock');
        }}
      >
        Id Stock
      </Button>

      <Button
        className={`${
          activeButton === 'usStock'
            ? 'bg-[#3AC4A0]'
            : 'bg-white border-2 border-[#BDBDBD] text-[#BDBDBD]'
        }`}
        onClick={() => {
          handleButtonClick('usStock');
        }}
      >
        Us Stock
      </Button>

      <Button
        className={`${
          activeButton === 'crypto'
            ? 'bg-[#3AC4A0]'
            : 'bg-white border-2 border-[#BDBDBD] text-[#BDBDBD]'
        }`}
        onClick={() => {
          handleButtonClick('crypto');
        }}
      >
        Crypto
      </Button>
    </div>
  );
};

export default Buttonmarket;
