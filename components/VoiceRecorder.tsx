import React, { useEffect } from 'react';
import useAudioRecorder, { RecordingState } from '../hooks/useAudioRecorder.ts';
import Button from './Button.tsx';
import Card from './Card.tsx';

interface VoiceRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
  scriptToRead?: string;
  maxDuration?: number; // in seconds, e.g., 30
}

const MIN_DURATION = 20; // Minimum 20 seconds for better voice cloning

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onRecordingComplete, scriptToRead, maxDuration = 60 }) => {
  const {
    recordingState,
    startRecording,
    stopRecording,
    audioBlob,
    audioUrl,
    error,
    duration,
    resetRecorder
  } = useAudioRecorder();
  const [isTooShort, setIsTooShort] = React.useState(false);

  useEffect(() => {
    if (audioBlob && recordingState === RecordingState.STOPPED) {
      if (duration < MIN_DURATION) {
        setIsTooShort(true);
      } else {
        setIsTooShort(false);
        onRecordingComplete(audioBlob);
      }
    }
  }, [audioBlob, recordingState, onRecordingComplete, duration]);

  useEffect(() => {
    if (recordingState === RecordingState.RECORDING && duration >= maxDuration) {
      stopRecording();
    }
  }, [duration, maxDuration, recordingState, stopRecording]);
  
  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleReset = () => {
    setIsTooShort(false);
    resetRecorder();
  };

  return (
    <Card className="w-full">
      {scriptToRead && (
        <div className="mb-6 p-4 bg-slate-100 rounded-lg border border-slate-200">
          <p className="text-base font-semibold text-slate-700 mb-1">다음 스크립트를 큰 소리로 읽어주세요:</p>
          <p className="text-slate-700 italic text-lg">"{scriptToRead}"</p>
        </div>
      )}

      <div className="flex flex-col items-center space-y-6">
        {recordingState === RecordingState.IDLE && (
          <Button onClick={startRecording} variant="primary" size="lg" className="w-full md:w-auto">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
            </svg>
            녹음 시작 (최대 {maxDuration}초)
          </Button>
        )}

        {recordingState === RecordingState.REQUESTING_PERMISSION && (
          <p className="text-orange-600 text-lg">마이크 권한 요청 중...</p>
        )}

        {recordingState === RecordingState.RECORDING && (
          <>
            <Button onClick={stopRecording} variant="danger" size="lg" className="w-full md:w-auto">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2">
               <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 7.5A2.25 2.25 0 0 1 7.5 5.25h9a2.25 2.25 0 0 1 2.25 2.25v9a2.25 2.25 0 0 1-2.25 2.25h-9a2.25 2.25 0 0 1-2.25-2.25v-9Z" />
              </svg>
              녹음 중지
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-3.5 h-3.5 bg-red-500 rounded-full animate-pulse"></div>
              <p className="text-slate-700 text-lg">녹음 중: {formatTime(duration)} / {formatTime(maxDuration)}</p>
            </div>
          </>
        )}

        {recordingState === RecordingState.STOPPED && audioUrl && (
          <div className="text-center w-full">
            <p className="text-green-600 text-lg mb-3">녹음 완료! 길이: {formatTime(duration)}</p>
            <audio controls src={audioUrl} className="w-full mb-4"></audio>
            {isTooShort && (
              <p className="text-red-600 text-base mb-4 bg-red-100 p-3 rounded-lg">
                더 나은 음성 복제를 위해 최소 {MIN_DURATION}초 이상 녹음해주세요.
              </p>
            )}
            <Button onClick={handleReset} variant="secondary" size="md">다시 녹음</Button>
          </div>
        )}
        
        {(recordingState === RecordingState.PERMISSION_DENIED || recordingState === RecordingState.ERROR) && error && (
          <div className="text-red-700 text-center p-4 bg-red-100 border border-red-300 rounded-lg w-full">
             <p className="font-semibold text-lg">오류:</p>
             <p className="text-base">{error === "Microphone permission denied. Please enable it in your browser settings." ? "마이크 권한이 거부되었습니다. 브라우저 설정에서 활성화해주세요." : error === "Could not access microphone. Please ensure it's connected and permissions are allowed." ? "마이크에 접근할 수 없습니다. 연결되어 있고 권한이 허용되었는지 확인해주세요." : error}</p>
             {recordingState === RecordingState.PERMISSION_DENIED && <p className="mt-2 text-sm">마이크 접근을 허용하려면 브라우저의 사이트 설정을 확인하세요.</p>}
          </div>
        )}
      </div>
    </Card>
  );
};

export default VoiceRecorder;
