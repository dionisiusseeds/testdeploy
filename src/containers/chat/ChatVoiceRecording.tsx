import { Typography } from '@material-tailwind/react';
import Image from 'next/image';
import {
  closeIcon,
  voiceNotesDeleteIcon,
  voiceNotesDeleteIconRed,
  voiceNotesMicIcon,
  voiceNotesPauseIcon,
  voiceNotesSendIcon,
  voiceNotesSendIconDisabled
} from 'public/assets/chat';
import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction
} from 'react';
import { AudioVisualizer, LiveAudioVisualizer } from 'react-audio-visualize';
import { toast } from 'react-toastify';

interface props {
  setLoading: Dispatch<SetStateAction<boolean>>;
  setAudio: Dispatch<SetStateAction<File | null>>;
  audio: File | null;
  postMedia: (mediaFile: File) => Promise<void>;
  setIsVoiceRecording: Dispatch<SetStateAction<boolean>>;
}

export const ChatVoiceRecorder: React.FC<props> = ({
  setLoading,
  setAudio,
  postMedia,
  setIsVoiceRecording,
  audio
}) => {
  const [recording, setRecording] = useState<boolean>(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const [blob, setBlob] = useState<Blob | null>(null);

  const [time, setTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (recording) {
        setTime(prevTime => prevTime + 100);
      }
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, [recording]);

  const pad = (number: number, size: number = 2): string => {
    let padded: string = String(number);
    while (padded.length < size) {
      padded = '0' + padded;
    }
    return padded;
  };

  const formatTime = (time: number): string => {
    const seconds: number = Math.floor(time / 1000);
    const milliseconds: number = Math.floor((time % 1000) / 10);

    return `${seconds}.${pad(milliseconds)}`;
  };

  const startRecording = (): void => {
    setLoading(false);
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(stream => {
        mediaRecorder.current = new MediaRecorder(stream);
        mediaRecorder.current.start();

        setRecording(true);

        mediaRecorder.current.ondataavailable = event => {
          audioChunks.current.push(event.data);
        };

        mediaRecorder.current.onstop = async () => {
          const audioBlob = new Blob(audioChunks.current, {
            type: 'audio/mpeg'
          });

          setBlob(audioBlob);

          const currentDatetime = new Date();
          const filename = `Recording-${currentDatetime.toISOString()}.mpeg`;
          const audioFile = new File([audioBlob], filename, {
            type: audioBlob.type,
            lastModified: currentDatetime.getTime()
          });

          setAudio(audioFile);
          audioChunks.current = [];
        };
      })
      .catch(error => {
        toast(error.message);
      });
  };

  const stopRecording = async (): Promise<void> => {
    setLoading(false);
    setTime(0);
    if (mediaRecorder.current !== null && mediaRecorder.current !== undefined) {
      mediaRecorder.current.stop();
      setRecording(false);
    }
  };

  const sendRecording = async (): Promise<void> => {
    try {
      if (audio !== null) {
        await postMedia(audio);
        setIsVoiceRecording(false);
      }
    } catch (error: any) {
      toast(error?.message);
    } finally {
      setIsVoiceRecording(false);
    }
  };

  return (
    <div className="w-full flex flex-col md:flex-row justify-center items-center mb-4 md:mb-0">
      <div
        onClick={() => {
          setAudio(null);
          setBlob(null);
          setIsVoiceRecording(false);
        }}
        className="flex justify-center items-center w-[36px] h-auto md:mr-2 mt-4 md:mt-0"
      >
        <Image
          src={closeIcon}
          alt="closeIcon"
          width={100}
          height={100}
          className="h-auto w-full cursor-pointer hover:scale-125 duration-300"
        />
      </div>
      <div className="flex flex-col justify-center items-center md:hidden mt-4 mb-6">
        <Typography className="font-poppins text-black font-medium text-lg">
          Voice Notes
        </Typography>
        <div>
          {recording ? (
            <Typography className="text-[#BDBDBD] font-poppins">
              {formatTime(time)}
            </Typography>
          ) : (
            <Typography className="text-[#BDBDBD] font-poppins">
              00:00
            </Typography>
          )}
        </div>
      </div>
      <div
        className={`flex md:hidden ${audio !== null ? 'mb-8' : ''} ${
          recording ? 'mb-8' : ''
        }`}
      >
        {audio !== null && blob !== null ? (
          <div className="w-full">
            {blob !== null && (
              <AudioVisualizer
                blob={blob}
                width={300}
                height={100}
                barWidth={4}
                gap={3}
                barColor={'#7555DA'}
              />
            )}
          </div>
        ) : recording ? (
          <div className="w-full">
            {mediaRecorder?.current != null && (
              <LiveAudioVisualizer
                mediaRecorder={mediaRecorder?.current}
                width={300}
                height={100}
                barWidth={4}
                gap={3}
                barColor={'#7555DA'}
              />
            )}
          </div>
        ) : null}
      </div>
      <div className="flex justify-center items-center w-full gap-4 xl:gap-8">
        <div className="flex justify-center items-center gap-4">
          <div
            onClick={() => {
              setAudio(null);
              setBlob(null);
            }}
            className="flex justify-center items-center w-[28px] h-auto"
          >
            <Image
              src={
                audio !== null ? voiceNotesDeleteIconRed : voiceNotesDeleteIcon
              }
              alt="voiceNotesDeleteIcon"
              width={100}
              height={100}
              className="h-auto w-full cursor-pointer hover:scale-125 duration-300"
            />
          </div>
          <Typography className="hidden lg:flex font-poppins text-black text-sm font-medium">
            Voice Notes
          </Typography>
        </div>
        <div className="hidden lg:flex w-[80px] justify-center items-center">
          {recording ? (
            <Typography className="text-[#BDBDBD] font-poppins">
              {formatTime(time)}
            </Typography>
          ) : (
            <Typography className="text-[#BDBDBD] font-poppins">
              00:00
            </Typography>
          )}
        </div>
        <div className="hidden md:flex">
          {audio !== null && blob !== null ? (
            <div>
              {blob !== null && (
                <AudioVisualizer
                  blob={blob}
                  width={200}
                  height={75}
                  barWidth={3}
                  gap={2}
                  barColor={'#7555DA'}
                />
              )}
            </div>
          ) : recording ? (
            <div>
              {mediaRecorder?.current !== null && (
                <LiveAudioVisualizer
                  mediaRecorder={mediaRecorder?.current}
                  width={150}
                  height={75}
                  barWidth={3}
                  gap={2}
                  barColor={'#7555DA'}
                />
              )}
            </div>
          ) : null}
        </div>
        <div
          className={`rounded-full md:my-2 ${
            recording
              ? 'border-2 border-[#DCFCE4] p-[2px] animate-shadow-voicenotes'
              : ''
          }`}
        >
          <button
            onClick={recording ? stopRecording : startRecording}
            type="button"
            className={`flex justify-center items-center rounded-full bg-[#DCFCE4]
              ${recording ? 'h-[52px] w-[52px]' : 'h-[60px] w-[60px]'}  
            `}
          >
            {recording ? (
              <div className="flex justify-center items-center w-[32px] h-auto hover:w-[36px] duration-300">
                <Image
                  width={100}
                  height={100}
                  src={voiceNotesPauseIcon}
                  alt="voiceNotesPauseIcon"
                  className="w-full h-auto"
                />
              </div>
            ) : (
              <div className="flex justify-center items-center w-[32px] h-auto hover:w-[36px] duration-300">
                <Image
                  width={100}
                  height={100}
                  src={voiceNotesMicIcon}
                  alt="voiceNotesMicIcon"
                  className="w-full h-auto"
                />
              </div>
            )}
          </button>
        </div>
        <div className="flex justify-center items-center w-[32px] h-auto">
          <Image
            onClick={async () => {
              audio !== null && (await sendRecording());
            }}
            src={
              audio !== null ? voiceNotesSendIcon : voiceNotesSendIconDisabled
            }
            alt="voiceNotesSendIcon"
            width={100}
            height={100}
            className={`w-full h-auto ${
              audio !== null
                ? 'cursor-pointer hover:scale-125 duration-300'
                : ''
            }`}
          />
        </div>
      </div>
    </div>
  );
};
