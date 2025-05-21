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
      className={`flex text-sm font-semibold font-poppins ${
        timeLeft.days === 0 &&
        timeLeft.hours === 0 &&
        timeLeft.minutes === 0 &&
        timeLeft.seconds === 0
          ? ''
          : 'text-[#3AC4A0]'
      } rounded-full item-center justify-center py-1 px-2`}
    >
      {timeLeft.days === 0 &&
      timeLeft.hours === 0 &&
      timeLeft.minutes === 0 &&
      timeLeft.seconds === 0 ? (
        'ENDED'
      ) : (
        <div className="flex w-[170px] justify-center">
          <span>
            {timeLeft.days} Days, {timeLeft.hours}h {timeLeft.minutes}m{' '}
            {timeLeft.seconds}s
          </span>
        </div>
      )}
    </div>
  );
};

export default CountdownTimer;
