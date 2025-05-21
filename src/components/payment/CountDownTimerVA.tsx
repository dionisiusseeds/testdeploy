import { Typography } from '@material-tailwind/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface CountDownProps {
  className?: string;
  expiredDate: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const defaultClassName =
  'text-md text-[#DD2525] font-semibold mt-2 font-poppins';

const parseExpiredDate = (expiredDate: string): Date => {
  const year = parseInt(expiredDate.substring(0, 4), 10);
  const month = parseInt(expiredDate.substring(4, 6), 10) - 1;
  const day = parseInt(expiredDate.substring(6, 8), 10);
  const hours = parseInt(expiredDate.substring(8, 10), 10);
  const minutes = parseInt(expiredDate.substring(10, 12), 10);
  const seconds = parseInt(expiredDate.substring(12, 14), 10);

  return new Date(year, month, day, hours, minutes, seconds);
};

const CountdownTimerVA: React.FC<CountDownProps> = ({ expiredDate, className }) => {
  const { t } = useTranslation();
  const deadline = parseExpiredDate(expiredDate);

  const calculateTimeLeft = (): TimeLeft => {
    const difference = +deadline - +new Date();
    let timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => { clearInterval(timer); };
  }, []);

  const formatTime = (value: number): string => (value < 10 ? `0${value}` : `${value}`);

  const formatTimeLeft = (timeLeft: TimeLeft): string => {
    const parts = [];

    if (timeLeft.days !== 0) {
      parts.push(
        timeLeft.days > 1
          ? `${formatTime(timeLeft.days)} ${t('bnc.clock.days')}`
          : `${formatTime(timeLeft.days)} ${t('bnc.clock.day')}`
      );
    }
    if (timeLeft.hours !== 0) {
      parts.push(
        timeLeft.hours > 1
          ? `${formatTime(timeLeft.hours)} ${t('bnc.clock.hours')}`
          : `${formatTime(timeLeft.hours)} ${t('bnc.clock.hour')}`
      );
    }
    if (timeLeft.minutes !== 0) {
      parts.push(
        timeLeft.minutes > 1
          ? `${formatTime(timeLeft.minutes)} ${t('bnc.clock.minutes')}`
          : `${formatTime(timeLeft.minutes)} ${t('bnc.clock.minute')}`
      );
    }
    if (timeLeft.seconds !== 0) {
      parts.push(
        timeLeft.seconds > 1
          ? `${formatTime(timeLeft.seconds)} ${t('bnc.clock.seconds')}`
          : `${formatTime(timeLeft.seconds)} ${t('bnc.clock.second')}`
      );
    }

    if (parts.length === 0) return '';

    if (parts.length === 1) return parts[0];

    const lastPart = parts.pop();
    return parts.join(', ') + ` ${t('bnc.clock.and')} ` + `${lastPart ?? ''}`;
  };

  if (
    timeLeft.days === 0 &&
    timeLeft.hours === 0 &&
    timeLeft.minutes === 0 &&
    timeLeft.seconds === 0
  ) {
    return (
      <div>
        <Typography className="text-lg text-[#DD2525] mt-2 font-semibold font-poppins">
          {t('bnc.expired.text3')}
        </Typography>
      </div>
    );
  } else {
    return (
      <div>
				<Typography
					className={`${className ?? defaultClassName} ${
						timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes < 5
							? 'text-[#DD2525]'
							: 'text-seeds-button-green'
					}`}
				>
					{formatTimeLeft(timeLeft)}
				</Typography>
      </div>
    );
  }
};

export default CountdownTimerVA;