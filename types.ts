export enum Page {
  Landing,
  UserOnboarding,
  CaricatureGenerationIntro, // New pre-generation narration page
  CaricatureGeneration,
  TalkingPhotoGenerationIntro, // New pre-generation narration page
  TalkingPhotoGeneration,
  DeepfakeIntroduction, // New page for the introduction to deepfake technology
  ModuleSelection,
  FakeNewsModule,
  IdentityTheftModule,
  Completion,
}

export interface UserData {
  userId: string;
  name: string;
  age: string; // Keeping as string for form input simplicity
  gender: string;
  // Pre-generated content URLs (from hybrid pre-generation strategy)
  lottery_faceswap_url?: string;
  crime_faceswap_url?: string;
  lottery_video_url?: string;
  crime_video_url?: string;
  investment_call_audio_url?: string;
  accident_call_audio_url?: string;
  pre_generation_status?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}


export interface ModuleStep {
  id: string;
  title: string;
  type: 'info' | 'caseStudy' | 'quiz' | 'interactive' | 'narration' | 'video_identification_quiz' | 'video_case_study' | 'faceswap_scenario' | 'voice_call_scenario' | 'video_call_scenario';
  content?: string | React.ReactNode;
  caseStudyId?: string;
  quizId?: string; // For traditional quizzes
  videoQuizData?: PersonIdentificationData[]; // For the new video identification quiz
  videoUrl?: string; // For case study videos
  narrationScript?: string;
  requires?: Array<'userImage' | 'userVoice' | 'userCaricature'>;
  
  // New properties for scenario steps
  baseImageMale?: string; // Base image for male users in faceswap scenarios
  baseImageFemale?: string; // Base image for female users in faceswap scenarios
  audioScript?: string; // Audio script for voice/video scenarios
  audioUrl?: string; // Pre-recorded audio URL for voice dubbing scenarios
  scenarioType?: 'lottery' | 'crime' | 'investment_call' | 'accident_call'; // Type of scenario
  callType?: 'voice' | 'video'; // Type of call simulation
}

export enum NarrationSpeed {
  Slow = 0.75,
  Normal = 1.0,
  Fast = 1.25,
}

export enum VoiceGender {
  Male = "male",
  Female = "female",
  Neutral = "neutral",
}

export interface PersonIdentificationData {
  id: string;
  name: string; // e.g., "Case 1"
  isFake: boolean;
  explanation: string;
  videoUrl?: string; // URL to the individual case video
  // thumbnailUrl?: string; // Future: if we have individual images
}

export interface UserAnswerForVideoQuiz {
  personId: string;
  userChoice: 'fake' | 'real';
  isCorrect: boolean;
}

export interface QuizAnswerData {
  userId: number;
  module: string;
  answers: Record<string, any>;
}
