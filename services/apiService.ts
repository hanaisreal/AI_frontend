import { UserData, QuizAnswerData } from '../types.ts';

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

export const generateNarration = async (script: string, voiceId: string | null): Promise<{ audioData: string; audioType: string }> => {
  console.log(`FRONTEND: Calling /api/generate-narration with voiceId: ${voiceId}, script: "${script.substring(0,30)}..."`);
  
  const response = await fetch(`${API_BASE_URL}/api/generate-narration`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ script, voiceId }),
  });
  
  const result = await handleApiResponse(response);
  return { audioData: result.audioData, audioType: result.audioType };
};

export const generateVoiceDub = async (audioUrl: string, voiceId: string, scenarioType: string): Promise<{ audioData: string; audioType: string; dubbingId: string }> => {
  console.log(`FRONTEND: Calling /api/generate-voice-dub`);
  console.log(`  - Audio URL: ${audioUrl}`);
  console.log(`  - Voice ID: ${voiceId}`);
  console.log(`  - Scenario Type: ${scenarioType}`);
  
  const response = await fetch(`${API_BASE_URL}/api/generate-voice-dub`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ audioUrl, voiceId, scenarioType }),
  });
  
  const result = await handleApiResponse(response);
  return { audioData: result.audioData, audioType: result.audioType, dubbingId: result.dubbingId };
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


export const completeOnboarding = async (
  userData: Omit<UserData, 'userId'>, 
  imageFile: File, 
  audioBlob: Blob
): Promise<{ 
  success: boolean; 
  userId: string; 
  user: any;
  imageUrl: string; 
  voiceId: string; 
  voiceName: string;
}> => {
  console.log('FRONTEND: Calling /complete-onboarding with all user data');
  
  const formData = new FormData();
  formData.append('name', userData.name);
  formData.append('age', userData.age.toString());
  formData.append('gender', userData.gender);
  formData.append('image', imageFile);
  formData.append('voice', audioBlob, 'voice_recording.wav');
  
  const response = await fetch(`${API_BASE_URL}/api/complete-onboarding`, {
    method: 'POST',
    body: formData,
  });
  
  const result = await handleApiResponse(response);
  return {
    success: result.success,
    userId: result.userId,
    user: result.user,
    imageUrl: result.imageUrl,
    voiceId: result.voiceId,
    voiceName: result.voiceName
  };
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

export const generateCaricature = async (facialFeatures: Record<string, any>, promptDetails: string): Promise<{ caricatureUrl: string; taskId: string }> => {
  console.log(`FRONTEND: Calling /generate-caricature. Prompt: "${promptDetails.substring(0,50)}..."`, facialFeatures);
  
  const response = await fetch(`${API_BASE_URL}/api/generate-caricature`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ facialFeatures, promptDetails }),
  });
  
  const result = await handleApiResponse(response);
  return { caricatureUrl: result.caricatureUrl, taskId: result.taskId };
};


export const generateTalkingPhoto = async (caricatureUrl: string, userName: string, voiceId: string, audioScript?: string, scenarioType?: string): Promise<{ videoUrl: string; taskId?: string; message?: string; isSample?: boolean }> => {
  console.log(`FRONTEND: Calling /api/generate-talking-photo`);
  console.log(`  - Caricature URL: ${caricatureUrl}`);
  console.log(`  - User Name: ${userName}`);
  console.log(`  - Voice ID: ${voiceId}`);
  console.log(`  - Audio Script: ${audioScript || 'Default script'}`);
  console.log(`  - Scenario Type: ${scenarioType || 'default'}`);
  
  const response = await fetch(`${API_BASE_URL}/api/generate-talking-photo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ caricatureUrl, userName, voiceId, audioScript, scenarioType }),
  });

  const result = await handleApiResponse(response);
  return { 
    videoUrl: result.videoUrl, 
    taskId: result.taskId,
    message: result.message,
    isSample: result.isSample
  };
};

export const getProgress = async (taskId: string): Promise<{
  progress: number;
  message: string;
  completed: boolean;
  timestamp: number;
}> => {
  const response = await fetch(`${API_BASE_URL}/api/progress/${taskId}`);
  return await handleApiResponse(response);
};


export const updateUserProgress = async (userId: number, progress: {
  currentPage?: string;
  currentStep?: number;
  caricatureUrl?: string;
  talkingPhotoUrl?: string;
  completedModules?: string[];
}) => {
  console.log(`FRONTEND: Updating user ${userId} progress:`, progress);
  
  const response = await fetch(`${API_BASE_URL}/api/users/${userId}/progress`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(progress)
  });
  
  return handleApiResponse(response);
};

export const getUserProgress = async (userId: number) => {
  console.log(`FRONTEND: Getting user ${userId} progress`);
  
  const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  
  console.log('API Response status:', response.status);
  const data = await handleApiResponse(response);
  console.log('API Response data:', data);
  return data;
};

