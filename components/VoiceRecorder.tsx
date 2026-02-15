import React, { useEffect } from 'react';
import useAudioRecorder, { RecordingState } from '../hooks/useAudioRecorder.ts';
import Button from './Button.tsx';
import { UI_TEXT, isEnglish } from '../lang';

interface VoiceRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
  scriptToRead?: string;
  maxDuration?: number; // in seconds, e.g., 30
  isActive?: boolean; // For highlighting when this field should be filled
}

const MIN_DURATION = 20; // Minimum 20 seconds for better voice cloning

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onRecordingComplete, scriptToRead, maxDuration = 60, isActive = false }) => {
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
  const [fontSize, setFontSize] = React.useState<'small' | 'medium' | 'large'>('medium');
  
  // Remove pulsing effect as requested by user
  
  const getFontSizeClasses = () => {
    switch (fontSize) {
      case 'small': return 'text-lg leading-relaxed';
      case 'medium': return 'text-xl leading-relaxed';
      case 'large': return 'text-2xl leading-relaxed';
    }
  };

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

  // Removed automatic stop at maxDuration - users can record as long as they want
  
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
    <div className="w-full">
      {/* Title section */}
      <label className="block text-base font-semibold text-slate-700 mb-3">{UI_TEXT.voiceRecording}</label>
      
      <div className={`border-2 rounded-lg transition-all duration-300 ${
        isActive 
          ? 'border-orange-300 bg-orange-50 shadow-md' 
          : 'border-slate-300 bg-slate-50 hover:border-orange-500 hover:bg-orange-50'
      }`}>
        {scriptToRead && (
          <div className="p-6 border-b border-slate-200">
            <div className="text-center mb-6">
              <p className="text-lg font-semibold text-slate-700 mb-4">{isEnglish() ? 'Imagine you are giving a lecture and read the following script out loud.' : '여러분이 강의를 한다 생각하고 다음 대본을 큰 소리로 읽어주세요~'}</p>
              <div className="flex items-center justify-center space-x-3">
                <span className="text-sm text-slate-500">{UI_TEXT.fontSize}</span>
                <button
                  onClick={() => setFontSize('small')}
                  className={`px-3 py-1 text-sm rounded transition-colors ${
                    fontSize === 'small'
                      ? 'bg-orange-500 text-white'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  {isEnglish() ? 'Small' : '작게'}
                </button>
                <button
                  onClick={() => setFontSize('medium')}
                  className={`px-3 py-1 text-sm rounded transition-colors ${
                    fontSize === 'medium'
                      ? 'bg-orange-500 text-white'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  {isEnglish() ? 'Medium' : '보통'}
                </button>
                <button
                  onClick={() => setFontSize('large')}
                  className={`px-3 py-1 text-sm rounded transition-colors ${
                    fontSize === 'large'
                      ? 'bg-orange-500 text-white'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  {isEnglish() ? 'Large' : '크게'}
                </button>
              </div>
              
              
              {/* Recording button and instructions moved here */}
              {recordingState === RecordingState.IDLE && (
                <div className="mt-6 text-center">
                  <p className="text-base text-slate-600 mb-4">{isEnglish() ? 'Click the "Start Recording" button below and read the script.' : '아래 "녹음 시작" 버튼을 클릭하고 대본을 읽어주세요.'}</p>
                  <Button onClick={startRecording} variant="primary" size="lg" className="w-full md:w-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
                    </svg>
                    {isEnglish() ? 'Start Recording' : '녹음 시작'}
                  </Button>
                </div>
              )}
            </div>
            
            {/* Script content section with better spacing */}
            <div className="px-6 py-4 bg-white">
              <p className={`text-slate-700 ${getFontSizeClasses()} whitespace-pre-line break-words text-center`}>
                {scriptToRead}
              </p>
            </div>
          </div>
        )}

        {/* Recording status and controls section */}
        <div className="flex flex-col items-center space-y-6 p-6">
          {recordingState === RecordingState.REQUESTING_PERMISSION && (
            <p className="text-orange-600 text-lg">{isEnglish() ? 'Requesting microphone permission...' : '마이크 권한 요청 중...'}</p>
          )}

          {recordingState === RecordingState.RECORDING && (
            <>
              <Button onClick={stopRecording} variant="danger" size="lg" className="w-full md:w-auto">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 7.5A2.25 2.25 0 0 1 7.5 5.25h9a2.25 2.25 0 0 1 2.25 2.25v9a2.25 2.25 0 0 1-2.25 2.25h-9a2.25 2.25 0 0 1-2.25-2.25v-9Z" />
                </svg>
                {isEnglish() ? 'Stop Recording' : '녹음 중지'}
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-3.5 h-3.5 bg-red-500 rounded-full animate-pulse"></div>
                <p className="text-slate-700 text-lg">{isEnglish() ? 'Recording:' : '녹음 중:'} {formatTime(duration)}</p>
              </div>
            </>
          )}

          {recordingState === RecordingState.STOPPED && audioUrl && (
            <div className="text-center w-full space-y-4">
              <p className="text-green-600 text-lg">{isEnglish() ? 'Recording complete! Duration:' : '녹음 완료! 길이:'} {formatTime(duration)}</p>
              <audio controls src={audioUrl} className="w-full"></audio>
              {isTooShort && (
                <p className="text-red-600 text-base bg-red-100 p-3 rounded-lg">
                  {isEnglish() ? `Please record at least ${MIN_DURATION} seconds for better voice cloning.` : `더 나은 음성 복제를 위해 최소 ${MIN_DURATION}초 이상 녹음해주세요.`}
                </p>
              )}
              <div className="flex justify-center">
                <Button onClick={handleReset} variant="secondary" size="md">{isEnglish() ? 'Record Again' : '다시 녹음'}</Button>
              </div>
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
      </div>
    </div>
  );
};

export default VoiceRecorder;
