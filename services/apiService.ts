import { UserData, QuizAnswerData } from '../types.ts';

// Smart narration request interface
interface SmartNarrationRequest {
  user_id: number;
  current_step_id: string;
  current_script: string;
  voice_id: string;
  preload_next_step_id?: string;
  preload_next_script?: string;
}

interface SmartNarrationResponse {
  current_audio_url: string;
  current_audio_type: string;
  cache_hit: boolean;
  preload_started: boolean;
  message?: string;
}

// Smart API URL detection - works for both local development and Vercel deployment
const getApiBaseUrl = () => {
  
  // If VITE_API_BASE_URL is explicitly set, use it
  if (import.meta.env.VITE_API_BASE_URL) {
    console.log(`🔧 Using VITE_API_BASE_URL: ${import.meta.env.VITE_API_BASE_URL}`);
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // Auto-detect based on current hostname
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    console.log(`🔍 Detecting API URL for hostname: ${hostname}`);
    
    // Local development
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      console.log(`🏠 Local development detected`);
      return 'http://localhost:8000';
    }
    
    // Vercel deployment - be more specific
    if (hostname.includes('vercel.app') || hostname.includes('ai-frontend')) {
      console.log(`☁️ Vercel deployment detected`);
      return 'https://ai-backend-mu-self.vercel.app';
    }
  }
  
  // Production fallback - use production API
  console.log(`🌐 Using production API fallback`);
  return 'https://ai-backend-mu-self.vercel.app';
};

const API_BASE_URL = getApiBaseUrl();

// Debug logging
console.log(`🌐 API Base URL: ${API_BASE_URL}`);

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

// Smart narration with caching and preloading (hybrid strategy)
export const generateSmartNarration = async (
  userId: number,
  stepId: string, 
  script: string, 
  voiceId: string,
  nextStepId?: string,
  nextScript?: string
): Promise<{ audioUrl: string; audioType: string; cacheHit: boolean }> => {
  console.log(`FRONTEND: Calling smart narration for step ${stepId}, user ${userId}`);
  
  const request: SmartNarrationRequest = {
    user_id: userId,
    current_step_id: stepId,
    current_script: script,
    voice_id: voiceId,
    preload_next_step_id: nextStepId,
    preload_next_script: nextScript
  };
  
  const response = await fetch(`${API_BASE_URL}/api/smart-narration`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });
  
  const result: SmartNarrationResponse = await handleApiResponse(response);
  
  return {
    audioUrl: result.current_audio_url,
    audioType: result.current_audio_type,
    cacheHit: result.cache_hit
  };
};

// Legacy narration function (fallback)
export const generateNarration = async (script: string, voiceId: string | null): Promise<{ audioData: string; audioType: string }> => {
  console.log(`FRONTEND: Calling legacy /api/generate-narration with voiceId: ${voiceId}, script: "${script.substring(0,30)}..."`);
  
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

// Get pre-generated scenario content from database (hybrid strategy)
export const getPreGeneratedScenarioContent = async (userId: number): Promise<{
  lottery_faceswap_url?: string;
  crime_faceswap_url?: string;
  investment_faceswap_url?: string;
  accident_faceswap_url?: string;
  lottery_video_url?: string;
  crime_video_url?: string;
  investment_video_url?: string;
  accident_video_url?: string;
  investment_call_audio_url?: string;
  accident_call_audio_url?: string;
  pre_generation_status?: string;
}> => {
  console.log(`FRONTEND: Getting pre-generated content for user ${userId}`);
  
  const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  const user = await handleApiResponse(response);
  
  return {
    lottery_faceswap_url: user.lottery_faceswap_url,
    crime_faceswap_url: user.crime_faceswap_url,
    investment_faceswap_url: user.investment_faceswap_url,
    accident_faceswap_url: user.accident_faceswap_url,
    lottery_video_url: user.lottery_video_url,
    crime_video_url: user.crime_video_url,
    investment_video_url: user.investment_video_url,
    accident_video_url: user.accident_video_url,
    investment_call_audio_url: user.investment_call_audio_url,
    accident_call_audio_url: user.accident_call_audio_url,
    pre_generation_status: user.pre_generation_status
  };
};

// Get scenario generation status
export const getScenarioGenerationStatus = async (userId: number): Promise<{
  status: string;
  started_at?: string;
  completed_at?: string;
  error?: string;
}> => {
  console.log(`FRONTEND: Getting scenario status for user ${userId}`);
  
  const response = await fetch(`${API_BASE_URL}/api/scenario-status/${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  return await handleApiResponse(response);
};

// Legacy face swap function (fallback)
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
  
  console.log(`FRONTEND: Response status: ${response.status}`);
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('FRONTEND: Complete onboarding failed with error:', errorText);
    throw new Error(`API Error ${response.status}: ${errorText}`);
  }
  
  const result = await response.json();
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

export const startVoiceGeneration = async (voiceId: string): Promise<{
  message: string;
  status: string;
  user_data: {
    name: string;
  };
}> => {
  console.log(`FRONTEND: Starting voice generation for voice ID: ${voiceId}`);
  
  const response = await fetch(`${API_BASE_URL}/api/start-voice-generation`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ voiceId }),
  });
  
  const result = await handleApiResponse(response);
  console.log('Voice generation started:', result);
  return result;
};

export const startScenarioGeneration = async (voiceId: string): Promise<{
  message: string;
  status: string;
  user_data: {
    name: string;
    gender: string;
    pre_generation_status: string;
  };
}> => {
  console.log(`FRONTEND: Starting scenario generation for voice ID: ${voiceId}`);
  
  const response = await fetch(`${API_BASE_URL}/api/start-scenario-generation`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ voiceId }),
  });
  
  const result = await handleApiResponse(response);
  console.log('Scenario generation started:', result);
  return result;
};

