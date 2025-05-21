import talk from '@/assets/circle-page/talk.svg';
import { Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { IoMdArrowRoundBack } from 'react-icons/io';

interface Props {
  setPages: (page: string) => void;
  setLoading: any;
  setAudio: any;
  audio: any;
}

export const VoiceRecorder: React.FC<Props> = ({
  setPages,
  setLoading,
  setAudio,
  audio
}) => {
  const [recording, setRecording] = useState(false);
  const [time, setTime] = useState(0);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (recording) {
      timerRef.current = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    } else {
      if (timerRef.current != null) {
        clearInterval(timerRef.current);
      }
    }
    return () => {
      if (timerRef.current != null) clearInterval(timerRef.current);
    };
  }, [recording]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(
      remainingSeconds
    ).padStart(2, '0')}`;
  };

  const startRecording = async (): Promise<void> => {
    setLoading(false);
    setTime(0);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      mediaRecorder.current.start();

      setRecording(true);

      mediaRecorder.current.ondataavailable = event => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/mpeg' });
        const filename = `Recording-${new Date().toISOString()}.mpeg`;
        const audioFile = new File([audioBlob], filename, {
          type: audioBlob.type,
          lastModified: new Date().getTime()
        });

        setAudio(audioFile);
        audioChunks.current = [];
      };
    } catch (error) {
      console.error('Error getting audio stream:', error);
    }
  };

  const stopRecording = (): void => {
    setLoading(false);
    if (mediaRecorder.current != null) {
      mediaRecorder.current.stop();
      setRecording(false);
      setPages('text');
    }
  };

  return (
    <div className="flex items-center flex-col">
      <div className="sm:flex hidden justify-start items-center w-full ">
        <button
          onClick={() => {
            setPages('text');
          }}
          className="mr-4"
        >
          <IoMdArrowRoundBack />
        </button>
        <Typography className="">Voice Message</Typography>
      </div>

      {/* Tombol Rekam */}
      <div className="relative">
        <button
          onClick={recording ? stopRecording : startRecording}
          type="button"
          className={`p-8 m-2 border-[5px] rounded-full transition-all relative overflow-hidden ${
            recording ? 'recording-border' : 'idle-border'
          }`}
        >
          {/* Efek Background Transparan */}
          <span
            className={`absolute inset-0 bg-gradient-to-r ${
              recording
                ? 'bg-gradient-to-tl from-seeds-green to-seeds-purple opacity-30'
                : 'bg-white border-gray-300'
            }`}
          ></span>

          {/* Efek Border Animasi */}
          {recording && (
            <div className="absolute inset-0 w-full h-full rounded-full border-4 animate-border-spin"></div>
          )}

          {/* Image Tetap di Atas */}
          <span className="relative z-10">
            <Image width={32} height={32} src={talk} alt="talk" />
          </span>
        </button>
      </div>

      {/* Timer Saat Recording */}
      {recording ? (
        <Typography className="text-red-500 text-lg font-bold mt-2">
          {formatTime(time)}
        </Typography>
      ) : (
        <Typography className="text-gray-400 text-center text-lg mt-2">
          Tap and hold to record and send voice messages
        </Typography>
      )}
    </div>
  );
};
