import music_effect from '@/assets/social/music_effect.gif';
import music_effect_off from '@/assets/social/music_effect.svg';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { IoIosPause } from 'react-icons/io';
import { IoPlay } from 'react-icons/io5';

interface AudioWithFile {
  audioFile: File;
  src?: never; // src tidak boleh ada jika audioFile ada
  className?: string;
  showDuration?: boolean;
}

interface AudioWithSrc {
  src: string;
  audioFile?: never; // audioFile tidak boleh ada jika src ada
  className?: string;
  showDuration?: boolean;
}

type AudioPlayerProps = AudioWithFile | AudioWithSrc;

const ShowAudioPlayer = ({
  audioFile,
  src,
  className,
  showDuration = false
}: AudioPlayerProps): JSX.Element => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioSrc, setAudioSrc] = useState('');

  useEffect(() => {
    if (audioFile != null) {
      const url = URL.createObjectURL(audioFile);
      setAudioSrc(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setAudioSrc(src);
    }
  }, [audioFile]);

  useEffect(() => {
    const audio = audioRef.current;
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!audio || !audioSrc) return;

    const handleLoadedMetadata = (): void => {
      // Check if duration is valid
      if (
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        audio.duration &&
        !isNaN(audio.duration) &&
        isFinite(audio.duration)
      ) {
        setDuration(audio.duration);
        // setIsLoading(false);
      }
    };

    // Some browsers might have the duration immediately
    if (audio.readyState >= 2) {
      handleLoadedMetadata();
    }

    // For browsers that need to load metadata
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);

    // For some browsers that might need more data
    audio.addEventListener('durationchange', () => {
      if (
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        audio.duration &&
        !isNaN(audio.duration) &&
        isFinite(audio.duration)
      ) {
        setDuration(audio.duration);
        // setIsLoading(false);
      }
    });

    // Force load metadata without playing
    audio.preload = 'metadata';

    // Some browsers need this to trigger loading
    audio.load();

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('durationchange', handleLoadedMetadata);
    };
  }, [audioSrc]);

  // useEffect(() => {
  //   if (audioRef.current != null) {
  //     const audio = audioRef.current;
  //     console.log('length', audioFile);
  //     audio.src = URL.createObjectURL(audioFile);
  //     audio.preload = 'metadata';

  //     console.log('audio', audio.duration);
  //     const updateDuration = (): void => {
  //       console.log('audio duration', audio.duration);
  //       if (audio.duration > 0 && !isNaN(audio.duration)) {
  //         console.log('masujk keisini ', audio.duration);
  //         setDuration(audio.duration);
  //       }
  //     };

  //     audio.addEventListener('loadedmetadata', updateDuration);
  //     audio.addEventListener('canplaythrough', updateDuration);
  //     console.log('audio', audio.duration);
  //     setTimeout(() => {
  //       if (audio.duration > 0 && !isNaN(audio.duration)) {
  //         console.log('masujk keisini ', audio.duration);
  //         setDuration(audio.duration);
  //       }
  //     }, 300);

  //     return () => {
  //       audio.removeEventListener('loadedmetadata', updateDuration);
  //       audio.removeEventListener('canplaythrough', updateDuration);
  //     };
  //   }
  // }, [audioFile]);

  const togglePlay = (): void => {
    const audio = audioRef.current;
    if (audio == null) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(error => {
        console.error('Play error:', error);
      });
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = (): void => {
    const audio = audioRef.current;
    if (audio == null) return;

    setCurrentTime(audio.currentTime);
  };

  const handleAudioEnd = (): void => {
    if (audioRef.current != null) {
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentTime(0);
    }
  };

  const formatTime = (time: number): string => {
    if (isNaN(time) || time === Infinity) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div
      className={`flex items-center gap-2 p-2 border rounded-xl border-seeds-green max-w-md ${
        className ?? 'w-fit'
      }`}
    >
      {/* Play/Pause Button */}
      <button
        type="button"
        onClick={togglePlay}
        className="text-seeds-green hover:text-seeds-button-green"
      >
        {isPlaying ? <IoIosPause size={30} /> : <IoPlay size={30} />}
      </button>
      <div className="relative w-full flex-1 h-8 flex items-center justify-start">
        {isPlaying ? (
          <Image
            src={music_effect}
            alt="Music Effect"
            width={170}
            height={32}
            className="opacity-50"
          />
        ) : (
          <Image
            src={music_effect_off}
            alt="Music Effect"
            width={170}
            height={32}
            className="opacity-50"
          />
        )}
      </div>
      {/* Duration */}
      {showDuration && (
        <span className="text-gray-600 text-sm">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
      )}

      {/* Audio Element (Hidden) */}
      <audio
        src={audioSrc}
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleAudioEnd}
        preload="metadata"
        hidden
      ></audio>
    </div>
  );
};

export default ShowAudioPlayer;
