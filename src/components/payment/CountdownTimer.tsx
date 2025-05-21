import { Typography } from '@material-tailwind/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface CountDownProps {
  className?: string;
  deadline?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const defaultClassName =
  'text-md text-[#DD2525] font-semibold mt-2 font-poppins';
const defaultDeadline = '2099-12-31T00:00:00Z';

const CountdownTimer: React.FC<CountDownProps> = ({ deadline, className }) => {
  const { t } = useTranslation();

  const calculateTimeLeft = (): TimeLeft => {
    const difference = +new Date(deadline ?? defaultDeadline) - +new Date();
    let timeLeft = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [timeLeft]);

  const formatTime = (value: number): string => {
    return value < 10 ? `0${value}` : `${value}`;
  };

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
          {t('bnc.expired.text1')}
        </Typography>
      </div>
    );
  } else {
    return (
      <div>
        <Typography className={className ?? defaultClassName}>
          {formatTimeLeft(timeLeft)}
        </Typography>
      </div>
    );
  }
};

export default CountdownTimer;
