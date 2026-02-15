/**
 * Language Configuration for AI Awareness Project
 *
 * To switch between Korean and English:
 * 1. Change the CURRENT_LANGUAGE constant below to 'en' or 'ko'
 * 2. All components importing from this file will automatically use the selected language
 *
 * Usage in components:
 *   import { SCRIPTS, QUIZZES, UI_TEXT, FAKE_NEWS_MODULE_STEPS, ... } from './lang';
 */

// ========================================
// LANGUAGE SELECTION - CHANGE THIS TO SWITCH LANGUAGES
// ========================================
export const CURRENT_LANGUAGE: 'ko' | 'en' = 'en';  // Change to 'ko' for Korean, 'en' for English
// ========================================

// Import both language versions
import * as KoreanConstants from './constants.tsx';
import * as EnglishConstants from './constants.en.tsx';

// Select the appropriate constants based on current language
const Constants = CURRENT_LANGUAGE === 'en' ? EnglishConstants : KoreanConstants;

// Re-export all constants from the selected language
export const SCRIPTS = Constants.SCRIPTS;
export const QUIZZES = Constants.QUIZZES;
export const FAKE_NEWS_MODULE_STEPS = Constants.FAKE_NEWS_MODULE_STEPS;
export const IDENTITY_THEFT_MODULE_STEPS = Constants.IDENTITY_THEFT_MODULE_STEPS;
export const NARRATOR_VOICE_ID = Constants.NARRATOR_VOICE_ID;
export const MOCK_VOICE_ID = Constants.MOCK_VOICE_ID;
export const MOCK_CARICATURE_URL = Constants.MOCK_CARICATURE_URL;
export const MOCK_TALKING_PHOTO_URL = Constants.MOCK_TALKING_PHOTO_URL;
export const MOCK_FACESWAP_IMAGE_URL = Constants.MOCK_FACESWAP_IMAGE_URL;
export const PLACEHOLDER_USER_IMAGE = Constants.PLACEHOLDER_USER_IMAGE;
export const DEFAULT_NARRATION_VOICE = Constants.DEFAULT_NARRATION_VOICE;
export const DEEPFAKE_IDENTIFICATION_VIDEO_URL = Constants.DEEPFAKE_IDENTIFICATION_VIDEO_URL;
export const DEEPFAKE_PEOPLE_DATA = Constants.DEEPFAKE_PEOPLE_DATA;

// UI Text - only available in English version, provide fallbacks for Korean
export const UI_TEXT = CURRENT_LANGUAGE === 'en'
  ? EnglishConstants.UI_TEXT
  : {
      // Korean fallback UI text
      landingTitle: "딥페이크란 무엇일까",
      startButton: "시작하기",
      stepTitles: ["환영합니다", "안내 사항", "사용자 정보 입력 및 음성 녹음"],
      enterInfo: "사용자 정보 입력",
      pleaseEnterInfo: "인적사항을 입력해주세요.",
      nameLabel: "성함",
      ageLabel: "나이",
      genderLabel: "성별",
      selectGender: "선택...",
      female: "여성",
      male: "남성",
      photoUpload: "사진 업로드",
      submitButton: "제출하기",
      submitting: "제출 중...",
      submitConsent: "제출 버튼을 누르면, 제공된 정보의 처리에 동의하는 것으로 간주됩니다.",
      pleaseSubmit: "제출하기 버튼을 눌러주세요.",
      voiceRecording: "음성 녹음",
      voiceRecordingInstruction: "여러분이 강의를 한다 생각하고 다음 대본을 큰 소리로 읽어주세요~",
      fontSize: "글자 크기:",
      imageUpload: "이미지 업로드",
      changeFile: "파일 변경",
      uploadFile: "파일 업로드",
      orDragDrop: "또는 드래그 앤 드롭",
      fileTypes: "PNG, JPG, GIF (iPhone 사진 자동 압축)",
      preview: "미리보기",
      fakeNewsModule: "가짜 뉴스",
      identityTheftModule: "신원 도용",
      projectComplete: "프로젝트 완료!",
      returnToWelcome: "환영 페이지로 돌아가기",
      next: "다음",
      previous: "이전",
      continue: "계속",
      loading: "로딩 중...",
      error: "오류가 발생했습니다. 다시 시도해주세요.",
      footer: "AI 인식 프로젝트. 교육 목적으로만 사용됩니다.",
      // Voice recording questions
      voiceQuestion1: "1. 오늘 기분은 어떠신가요? 이유는요?",
      voiceQuestion2: "2. 아침은 주로 무엇을 드시나요?",
      voiceQuestion3: "3. 하루 중 언제가 가장 기분이 좋으세요? 이유는요?",
      voiceQuestion4: "4. 가장 좋아하는 계절은 언제인가요? 그 이유는 무엇인가요?",
      voiceQuestion5: "5. 주말에는 주로 무엇을 하며 시간을 보내세요?",
      // Error messages
      imageCompressionFailed: "이미지 압축 실패, 원본 사용",
      imageLoadFailed: "이미지 로드 실패, 원본 사용",
      imageCompressing: "이미지가 큽니다. 압축 중...",
      imageCompressed: "이미지 압축",
      imageSelected: "이미지 선택",
      imagePreviewGenerated: "이미지 미리보기 생성 완료",
      imagePreviewFailed: "이미지 미리보기 실패",
      voiceRecordingComplete: "음성 녹음 완료",
    };

// Helper function to check current language
export const isEnglish = () => CURRENT_LANGUAGE === 'en';
export const isKorean = () => CURRENT_LANGUAGE === 'ko';

// Type exports
export type { QuizQuestion, ModuleStep, PersonIdentificationData } from './types.ts';
