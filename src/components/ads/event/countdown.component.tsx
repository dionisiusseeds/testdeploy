import React, { useEffect, useState } from 'react';

const CountdownTimer = ({
  targetDate
}: {
  targetDate: string;
}): React.ReactElement => {
  const calculateTimeLeft = (): {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } => {
    const difference = new Date(targetDate).getTime() - new Date().getTime();
    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    }
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [targetDate]);

  return (
    <div
      className={`flex text-sm font-semibold font-poppins text-white rounded-full item-center justify-center py-1 px-2`}
    >
      <div className="flex justify-center items-center gap-3 lg:gap-4">
        <div className="w-12 lg:w-20 flex justify-center items-center aspect-square bg-white rounded-lg lg:rounded-2xl">
          <p className="text-[#106B6E] text-2xl font-semibold">
            {timeLeft.hours + timeLeft.days * 24}
          </p>
        </div>
        <p className="text-white text-base lg:text-5xl font-semibold">:</p>
        <div className="w-12 lg:w-20 flex justify-center items-center aspect-square bg-white rounded-lg lg:rounded-2xl">
          <p className="text-[#106B6E] text-2xl font-semibold">
            {timeLeft.minutes}
          </p>
        </div>
        <p className="text-white text-base lg:text-5xl font-semibold">:</p>
        <div className="w-12 lg:w-20 flex justify-center items-center aspect-square bg-white rounded-lg lg:rounded-2xl">
          <p className="text-[#106B6E] text-2xl font-semibold">
            {timeLeft.seconds}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;
