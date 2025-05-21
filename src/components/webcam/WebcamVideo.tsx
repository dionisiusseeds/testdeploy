import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaExchangeAlt, FaStop } from 'react-icons/fa';
import { FaPause, FaPlay } from 'react-icons/fa6';
import { IoSend } from 'react-icons/io5';
import { MdOutlineCameraswitch } from 'react-icons/md';
import { toast } from 'react-toastify';
import Webcam from 'react-webcam';

interface WebcamVideoProps {
  type: boolean;
  onCapture: (video: File, text?: string) => void;
  isInputMessage?: boolean;
  setIsSending: React.Dispatch<React.SetStateAction<boolean>>;
  isSending: boolean;
}

const FACING_MODE_USER = 'user';
const FACING_MODE_ENVIRONMENT = 'environment';

const WebcamVideo: React.FC<WebcamVideoProps> = ({
  type,
  onCapture,
  isInputMessage,
  setIsSending,
  isSending
}) => {
  const { t } = useTranslation();
  const webcamRef = useRef<Webcam | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);

  const [facingMode, setFacingMode] = useState<string>(FACING_MODE_USER);
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [inputText, setInputText] = useState<string>('');

  const [mirrored, setMirrored] = useState<boolean>(false);
  const [capturing, setCapturing] = useState<boolean>(false);
  const [paused, setPaused] = useState<boolean>(false);

  const [recordTime, setRecordTime] = useState<number>(0);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (capturing && !paused) {
      timer = setInterval(() => {
        setRecordTime(prevTime => prevTime + 1);
      }, 1000);
    }
    return () => {
      if (timer != null) clearInterval(timer);
    };
  }, [capturing, paused]);

  const handleStartCapture = useCallback(() => {
    setCapturing(true);
    setRecordTime(0);
    setRecordedChunks([]);
    if (webcamRef.current?.video != null) {
      const stream = webcamRef.current.video.srcObject as MediaStream;
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'video/webm'
      });
      mediaRecorderRef.current.ondataavailable = event => {
        if (event.data.size > 0) {
          setRecordedChunks(prev => prev.concat(event.data));
          const blob = new Blob([event.data], { type: 'video/webm' });
          const previewURL = URL.createObjectURL(blob);
          setPreviewURL(previewURL);
        }
      };
      mediaRecorderRef.current.start();
    }
  }, [webcamRef, mediaRecorderRef]);

  const handlePauseCapture = useCallback(() => {
    if (mediaRecorderRef.current != null && !paused) {
      mediaRecorderRef.current.pause();
      setPaused(true);
    }
  }, [paused]);

  const handleResumeCapture = useCallback(() => {
    if (mediaRecorderRef.current != null && paused) {
      mediaRecorderRef.current.resume();
      setPaused(false);
    }
  }, [paused]);

  const handleStopCapture = useCallback(() => {
    if (mediaRecorderRef.current != null) {
      mediaRecorderRef.current.stop();
      setCapturing(false);

      if (recordedChunks.length > 0) {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        const previewURL = URL.createObjectURL(blob);
        setPreviewURL(previewURL);
      }
    }
  }, [recordedChunks]);

  const handleSendVideo = useCallback(async () => {
    if (recordedChunks.length > 0) {
      setIsSending(true);
      try {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        const file = new File([blob], 'recorded-video.webm', {
          type: 'video/webm'
        });
        onCapture(file, inputText);
        setRecordedChunks([]);
      } catch (error) {
        toast.error('Oops! Error when try to send video');
      } finally {
        setIsSending(false);
      }
    }
  }, [recordedChunks, onCapture, inputText]);

  const videoConstraints: MediaTrackConstraintSet = {
    facingMode,
    width: !type ? 940 : window.innerWidth,
    height: !type ? 440 : window.innerHeight
  };

  const audioConstraints: MediaTrackConstraints = {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true
  };

  const toggleFacingMode = useCallback(() => {
    setFacingMode(prevMode =>
      prevMode === FACING_MODE_USER ? FACING_MODE_ENVIRONMENT : FACING_MODE_USER
    );
  }, []);

  const toggleMirror = useCallback(() => {
    setMirrored(prevMirror => !prevMirror);
  }, []);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className={`${
        isInputMessage === true
          ? `${isSending ? 'h-full' : ''} bg-white rounded-2xl`
          : ''
      }`}
    >
      {isSending ? (
        <div className="flex items-center justify-center w-full h-full">
          <div className="my-4">
            <div className="animate-spinner w-14 h-14 border-8 border-gray-200 border-t-seeds-button-green rounded-full" />
          </div>
        </div>
      ) : (
        <>
          {previewURL !== null ? (
            <div className="relative">
              <video
                src={previewURL}
                autoPlay
                controls
                className={`w-full ${
                  isInputMessage === true
                    ? 'md:rounded-none'
                    : 'md:rounded-b-2xl'
                } rounded-none`}
                width={!type ? 940 : window.innerWidth}
                height={!type ? 440 : window.innerHeight}
              />
              <button
                onClick={() => {
                  setPreviewURL(null);
                }}
                className="absolute top-3 left-3 bg-white/40 hover:bg-white/80 duration-150 text-black font-poppins font-normal px-4 py-2 rounded-lg"
              >
                {t('chat.retake')}
              </button>
            </div>
          ) : (
            <div className="relative">
              <Webcam
                className={`${
                  isInputMessage === true
                    ? 'md:rounded-none'
                    : 'md:rounded-b-2xl'
                } rounded-none`}
                ref={webcamRef}
                audio={true}
                audioConstraints={audioConstraints}
                muted={true}
                videoConstraints={videoConstraints}
                mirrored={mirrored}
              />
              {capturing && (
                <div className="absolute top-3 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-1 rounded-lg">
                  {t('chat.record')}: {formatTime(recordTime)}
                </div>
              )}
              {capturing ? (
                <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 w-32 bg-white/40 rounded-full px-4 py-3 flex flex-row-reverse justify-between items-center gap-3">
                  <div
                    onClick={handleStopCapture}
                    className="cursor-pointer hover:scale-105 duration-200"
                  >
                    <div className="flex items-center justify-center">
                      <FaStop size={30} color="#FF6565" />
                    </div>
                  </div>
                  <div className="cursor-pointer">
                    {paused ? (
                      <div
                        onClick={handleResumeCapture}
                        className="hover:scale-105 duration-200"
                      >
                        <FaPlay size={30} color="white" />
                      </div>
                    ) : (
                      <div
                        onClick={handlePauseCapture}
                        className="hover:scale-105 duration-200"
                      >
                        <FaPause size={30} color="white" />
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <div
                    onClick={handleStartCapture}
                    className="absolute bottom-3 left-1/2 transform -translate-x-1/2 cursor-pointer hover:scale-105 duration-200"
                  >
                    <div className="md:w-16 w-14 md:h-16 h-14 rounded-full bg-transparent border-[3px] border-white flex items-center justify-center">
                      <div className="md:w-12 w-10 md:h-12 h-10 bg-[#FF6565] rounded-full"></div>
                    </div>
                  </div>
                  <div
                    onClick={toggleMirror}
                    className="absolute bottom-6 md:left-[35%] left-[20%] cursor-pointer hover:scale-105 duration-200"
                  >
                    <FaExchangeAlt size={30} color="white" />
                  </div>
                  <div
                    onClick={toggleFacingMode}
                    className="absolute bottom-6 md:right-[35%] right-[20%] cursor-pointer hover:scale-105 duration-200"
                  >
                    <MdOutlineCameraswitch size={30} color="white" />
                  </div>
                </>
              )}
            </div>
          )}
          {isInputMessage === true &&
            previewURL !== null &&
            recordedChunks.length > 0 && (
              <div className="flex flex-row items-center gap-2 px-4 py-2">
                <input
                  type="text"
                  placeholder={
                    t('chat.createMessagePlaceholder') ?? 'Create Message'
                  }
                  value={inputText}
                  onChange={e => {
                    setInputText(e.target.value);
                  }}
                  className="w-full p-2 border border-gray-300 rounded-full outline-none"
                />
                <button
                  onClick={handleSendVideo}
                  className="bg-[#3AC4A0] md:w-10 w-8 md:h-10 h-8 flex items-center justify-center rounded-full"
                >
                  <IoSend className="md:w-6 md:h-6 w-4 h-4" color="white" />
                </button>
              </div>
            )}
        </>
      )}
    </div>
  );
};

export default WebcamVideo;
