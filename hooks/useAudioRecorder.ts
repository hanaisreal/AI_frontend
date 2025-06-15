import { useState, useRef, useCallback } from 'react';

export enum RecordingState {
  IDLE = 'idle',
  REQUESTING_PERMISSION = 'requesting_permission',
  PERMISSION_DENIED = 'permission_denied',
  RECORDING = 'recording',
  STOPPED = 'stopped',
  ERROR = 'error',
}

interface AudioRecorderResult {
  recordingState: RecordingState;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  audioBlob: Blob | null;
  audioUrl: string | null;
  error: string | null;
  duration: number; // in seconds
  resetRecorder: () => void;
}

const useAudioRecorder = (): AudioRecorderResult => {
  const [recordingState, setRecordingState] = useState<RecordingState>(RecordingState.IDLE);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [duration, setDuration] = useState<number>(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<number | null>(null); // Changed NodeJS.Timeout to number
  const startTimeRef = useRef<number>(0);

  const resetRecorder = useCallback(() => {
    setRecordingState(RecordingState.IDLE);
    setAudioBlob(null);
    setAudioUrl(null);
    setError(null);
    setDuration(0);
    mediaRecorderRef.current = null;
    audioChunksRef.current = [];
    if(timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    timerIntervalRef.current = null; // Ensure it's nulled out
    startTimeRef.current = 0;
  }, []);

  const startRecording = useCallback(async () => {
    resetRecorder();
    setRecordingState(RecordingState.REQUESTING_PERMISSION);
    setError(null);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError("MediaDevices API not supported on this browser.");
        setRecordingState(RecordingState.ERROR);
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setRecordingState(RecordingState.RECORDING);
      
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const completeBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' }); // Or 'audio/webm' etc.
        setAudioBlob(completeBlob);
        const url = URL.createObjectURL(completeBlob);
        setAudioUrl(url);
        setRecordingState(RecordingState.STOPPED);
        stream.getTracks().forEach(track => track.stop()); // Release microphone
        if(timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      };
      
      mediaRecorderRef.current.onerror = (event) => {
        const mediaRecorderError = event as unknown as { error: DOMException };
        console.error("MediaRecorder error:", mediaRecorderError.error);
        setError(`Recording error: ${mediaRecorderError.error.message}`);
        setRecordingState(RecordingState.ERROR);
        if(timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      startTimeRef.current = Date.now();
      timerIntervalRef.current = window.setInterval(() => { // Use window.setInterval for clarity
        setDuration(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 1000);

    } catch (err) {
      console.error("Error accessing microphone:", err);
      if (err instanceof Error && (err.name === "NotAllowedError" || err.name === "PermissionDeniedError")) {
        setError("Microphone permission denied. Please enable it in your browser settings.");
        setRecordingState(RecordingState.PERMISSION_DENIED);
      } else {
        setError("Could not access microphone. Please ensure it's connected and permissions are allowed.");
        setRecordingState(RecordingState.ERROR);
      }
    }
  }, [resetRecorder]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && recordingState === RecordingState.RECORDING) {
      mediaRecorderRef.current.stop();
      // onstop handler will set state to STOPPED
    }
    if(timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  }, [recordingState]);

  return { recordingState, startRecording, stopRecording, audioBlob, audioUrl, error, duration, resetRecorder };
};

export default useAudioRecorder;