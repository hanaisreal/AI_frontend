export enum Page {
  Landing,
  IntroductionEducation,
  UserOnboarding,
  CaricatureGeneration,
  TalkingPhotoGeneration,
  ModuleSelection,
  FakeNewsModule,
  IdentityTheftModule,
  Completion,
}

export interface UserData {
  name: string;
  age: string; // Keeping as string for form input simplicity
  gender: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  type: 'image' | 'video' | 'text' | 'instagram';
  description: string | React.ReactNode;
  contentUrl?: string;
  instagramUrl?: string;
  narrationScript?: string;
}

export interface ModuleStep {
  id: string;
  title: string;
  type: 'info' | 'caseStudy' | 'quiz' | 'interactive' | 'narration' | 'video_identification_quiz';
  content?: string | React.ReactNode;
  caseStudyId?: string;
  quizId?: string; // For traditional quizzes
  videoQuizData?: PersonIdentificationData[]; // For the new video identification quiz
  videoUrl?: string; // For the video identification quiz
  narrationScript?: string;
  requires?: Array<'userImage' | 'userVoice' | 'userCaricature'>;
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
