import { UserData, QuizAnswerData } from '../types.ts';
import { PLACEHOLDER_USER_IMAGE } from '../constants.tsx';

// Base URL for your backend API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const handleApiResponse = async (response: Response) => {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error ${response.status}: ${errorText}`);
  }
  return response.json();
};

// ===================================================================================
// API Calls to Your Backend - REAL IMPLEMENTATION
// These functions call the actual backend APIs
// ===================================================================================

export const generateNarration = async (script: string, voiceId: string | null): Promise<{ audioUrl: string }> => {
  console.log(`FRONTEND: Calling /api/generate-narration with voiceId: ${voiceId}, script: "${script.substring(0,30)}..."`);
  
  const response = await fetch(`${API_BASE_URL}/api/generate-narration`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ script, voiceId }),
  });
  
  const result = await handleApiResponse(response);
  return { audioUrl: result.audioUrl };
};

export const generateFaceswapImage = async (baseImageUrl: string, userImageUrl: string): Promise<{ resultUrl: string }> => {
  console.log(`FRONTEND: Calling /api/generate-faceswap-image. Base: ${baseImageUrl}, User: ${userImageUrl}`);
  
  const response = await fetch(`${API_BASE_URL}/api/generate-faceswap-image`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ baseImageUrl, userImageUrl }),
  });
  
  const result = await handleApiResponse(response);
  return { resultUrl: result.resultUrl };
};

export const generateFaceswapVideo = async (baseVideoUrl: string, userImageUrl: string): Promise<{ resultUrl: string }> => {
  console.log(`FRONTEND: Calling /api/generate-faceswap-video. Base: ${baseVideoUrl}, User: ${userImageUrl}`);
  
  const response = await fetch(`${API_BASE_URL}/api/generate-faceswap-video`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ baseVideoUrl, userImageUrl }),
  });
  
  const result = await handleApiResponse(response);
  return { resultUrl: result.resultUrl };
};

export const saveUserInfo = async (userData: UserData): Promise<{ success: boolean; userId: string }> => {
  console.log('FRONTEND: Calling /user-info to save user data', userData);
  
  const response = await fetch(`${API_BASE_URL}/api/user-info`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  
  const createdUser = await handleApiResponse(response);
  return { success: createdUser.success, userId: createdUser.userId };
};

export const uploadUserImage = async (imageFile: File): Promise<{ imageUrl: string }> => {
  console.log(`FRONTEND: Uploading /user-image: ${imageFile.name}`);
  
  const formData = new FormData();
  formData.append('file', imageFile);
  
  const response = await fetch(`${API_BASE_URL}/api/user-image`, {
    method: 'POST',
    body: formData,
  });
  
  const result = await handleApiResponse(response);
  return { imageUrl: result.imageUrl };
};

export const uploadUserVoice = async (audioBlob: Blob): Promise<{ voiceId: string }> => {
  console.log(`FRONTEND: Uploading /user-voice, size: ${audioBlob.size}`);
  
  const formData = new FormData();
  formData.append('file', audioBlob, 'voice_recording.wav');
  
  const response = await fetch(`${API_BASE_URL}/api/user-voice`, {
    method: 'POST',
    body: formData,
  });
  
  const result = await handleApiResponse(response);
  return { voiceId: result.voiceId };
};

export const analyzeFace = async (imageUrl: string): Promise<{ facialFeatures: Record<string, any> }> => {
  console.log(`FRONTEND: Calling /analyze-face for image: ${imageUrl}`);
  
  const response = await fetch(`${API_BASE_URL}/api/analyze-face`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ imageUrl }),
  });
  
  const result = await handleApiResponse(response);
  return { facialFeatures: result.facialFeatures };
};

export const generateCaricature = async (facialFeatures: Record<string, any>, promptDetails: string): Promise<{ caricatureUrl: string }> => {
  console.log(`FRONTEND: Calling /generate-caricature. Prompt: "${promptDetails.substring(0,50)}..."`, facialFeatures);
  
  const response = await fetch(`${API_BASE_URL}/api/generate-caricature`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ facialFeatures, promptDetails }),
  });
  
  const result = await handleApiResponse(response);
  return { caricatureUrl: result.caricatureUrl };
};


export const generateTalkingPhoto = async (caricatureUrl: string, userName: string, voiceId: string): Promise<{ videoUrl: string }> => {
  console.log(`FRONTEND: Calling /api/generate-talking-photo`);
  console.log(`  - Caricature URL: ${caricatureUrl}`);
  console.log(`  - User Name: ${userName}`);
  console.log(`  - Voice ID: ${voiceId}`);
  
  const response = await fetch(`${API_BASE_URL}/api/generate-talking-photo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ caricatureUrl, userName, voiceId }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Failed to generate talking photo' }));
    throw new Error(errorData.detail || 'Unknown error generating talking photo');
  }
  return response.json();
};

export const generateVoiceDub = async (mediaUrl: string, voiceId: string): Promise<{ dubbedMediaUrl: string }> => {
  console.log(`FRONTEND: Calling /api/generate-voice-dub with voiceId: ${voiceId} for media: ${mediaUrl}`);
  
  const response = await fetch(`${API_BASE_URL}/api/generate-voice-dub`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ mediaUrl, voiceId }),
  });
  
  const result = await handleApiResponse(response);
  return { dubbedMediaUrl: result.dubbedMediaUrl };
};

export const saveQuizAnswers = async (answerData: QuizAnswerData): Promise<any> => {
  console.log('FRONTEND: Calling /quiz-answers to save data', answerData);
  
  const response = await fetch(`${API_BASE_URL}/api/quiz-answers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(answerData),
  });
  
  return handleApiResponse(response);
};

