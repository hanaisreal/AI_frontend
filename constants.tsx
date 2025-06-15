import React from 'react';
import { QuizQuestion, CaseStudy, ModuleStep, PersonIdentificationData } from './types.ts';

export const APP_TITLE = "AI 기술(딥페이크, 딥보이스)란?";

export const SCRIPTS = {
  welcome: " 안녕하세요! 딥페이크와 딥보이스 기술 체험에 오신 것을 환영합니다.",
  introDeepfake: "딥페이크 기술은 AI를 사용하여 얼굴을 바꾸는 등의 방법으로 실제 같지만 가짜인 비디오나 이미지를 만듭니다. 음성 복제는 짧은 오디오 샘플로 사람의 목소리를 복제할 수 있습니다. 이것들은 재미를 위해 사용될 수도 있지만, 잘못된 정보나 사기에도 사용될 수 있습니다.", // This is main content, persona will introduce it
  onboardingComplete: "좋습니다! 우선 당신을 위한 특별한 캐릭터를 만들어 보겠습니다.",
  caricatureGenerated: "당신의 맞춤 캐릭터입니다!",
  talkingPhotoGenerated: " 짜잔! 이제 실제 시나리오를 살펴보겠습니다.",
  moduleSelection: "체험해보고 싶음 경험을 선택해 주세요.",
  fakeNewsIntro: "가짜 뉴스는, 거짓말인데 진짜처럼 보이는 소식이에요. 예를 들어, “이 약 먹으면 3일 만에 치매가 낫는다” 이런 말을 들으면 혹하죠. 하지만 알고 보면 사기인 경우가 많아요. AI가 어떻게 설득력 있지만 거짓된 뉴스 기사를 만드는 데 사용될 수 있는지 살펴보겠습니다.",
  fakeNewsTech: "AI는 실제 뉴스처럼 보이는 텍스트, 이미지, 심지어 비디오까지 생성할 수 있습니다. 이것들은 빠르게 확산되어 여론에 영향을 미칠 수 있습니다.",
  fakeNewsRisk: "개인화된 가짜 뉴스는 특히 해로울 수 있으며, 개인의 모습이나 목소리를 사용하여 신뢰할 수 있어 보이는 거짓 정보로 개인을 타겟팅합니다.",
  fakeNewsCountermeasures: "가짜 뉴스를 식별하려면 출처를 확인하고, 이미지/비디오에서 특이한 세부 정보를 찾고, 감정적으로 자극적인 헤드라인을 경계하십시오. 비판적 사고가 최선의 방어책입니다.",
  identityTheftIntro: "신원 도용이란, 누가 내 이름이나 주민번호를 훔쳐서 내가 아닌 사람이 나인 척하는 거예요. 누가 내 주민등록증을 몰래 주워서 내 이름으로 휴대폰을 사고, 돈도 빌리는 것처럼요.",
  identityTheftTech: "음성 피싱은 복제된 목소리를 사용하여 가족이나 은행 직원과 같은 신뢰할 수 있는 사람을 사칭하여 피해자가 민감한 정보를 공개하거나 돈을 보내도록 속입니다.",
  identityTheftRisk: "곤경에 처한 사랑하는 사람으로부터 긴급한 도움을 요청하는 전화를 받는다고 상상해보세요. 그들의 목소리가 복제되었다면 사기를 감지하기가 매우 어려울 수 있습니다.",
  identityTheftCountermeasures: "의심스러운 전화를 받으면 전화를 끊고 다른 신뢰할 수 있는 연락 방법을 통해 상황을 확인하세요. 아무리 설득력 있게 들리더라도 요청하지 않은 전화를 기반으로 개인 정보를 공유하거나 돈을 보내지 말아야해요. ",
  module1Complete: "가짜 뉴스 모듈을 완료했습니다! 다음 모듈을 선택해 주세요.",
  module2Complete: "신원 도용 모듈을 완료했습니다! 남은 모듈을 선택해 주세요.",
  allModulesComplete: "축하합니다! 모든 모듈을 완료했습니다. 이 경험이 디지털 세상을 더 안전하게 탐색하는 데 도움이 되기를 바랍니다.",
  genericQuizIntro: "자, 이제 당신의 이해도를 확인하기 위한 짧은 퀴즈입니다.", // For persona
  videoQuizIntro: "이제 네 가지 영상을 보여드릴게요. 각 영상을 주의 깊게 관찰하고, 진짜인지 AI로 생성된 가짜인지 판단해보세요. 준비되셨나요?", // For persona to introduce the whole quiz.

  // New scripts for persona transitions
  personaIntroDefault: "좋습니다, 다음으로 넘어가 봅시다!",
  personaIntroInfo: "이제 다음 내용을 살펴보겠습니다.",
  personaIntroCaseStudy: "다음 사례 연구를 함께 살펴보겠습니다.",
  personaIntroQuizGeneral: "이제 배운 내용을 확인해 볼 시간입니다. 다음 퀴즈를 풀어보세요.",
  personaIntroInteractive: "다음은 당신과 관련된 예제입니다!",
};

export const QUIZZES: { [key: string]: QuizQuestion[] } = {
  fakeNewsQuiz1: [
    { id: 'fnq1', question: "AI 생성 가짜 뉴스 이미지의 일반적인 특징은 무엇인가요?", options: ["항상 흐릿함", "미묘한 시각적 불일치를 포함할 수 있음", "흑백만 가능", "모든 경우에 완벽하게 현실적임"], correctAnswer: "미묘한 시각적 불일치를 포함할 수 있음", explanation: "AI가 발전하고 있지만, 생성된 이미지는 때때로 이상한 손이나 왜곡된 배경과 같은 이상한 세부 정보를 가질 수 있으며, 이는 단서가 될 수 있습니다." },
  ],
  fakeNewsQuiz2: [
    { id: 'fnq2', question: "뉴스 기사가 가짜라고 의심될 때 가장 먼저 해야 할 좋은 조치는 무엇인가요?", options: ["즉시 공유하기", "출처의 신뢰성 확인하기", "자신의 견해를 확인시켜주면 믿기", "무시하기"], correctAnswer: "출처의 신뢰성 확인하기", explanation: "정보 출처를 확인하는 것은 매우 중요합니다. 평판 좋은 뉴스 기관을 찾고 알려지지 않은 웹사이트나 소셜 미디어 게시물을 경계하십시오." },
  ],
  identityTheftQuiz1: [
    { id: 'itq1', question: "'비싱(vishing)'이란 무엇인가요?", options: ["컴퓨터 바이러스의 일종", "복제된 목소리를 사용한 음성 피싱", "안전한 메시징 앱", "새로운 비디오 게임"], correctAnswer: "복제된 목소리를 사용한 음성 피싱", explanation: "'비싱'은 종종 음성 복제 기술로 강화되어 누군가를 사칭하는 음성 채널을 통해 수행되는 피싱 공격을 구체적으로 지칭합니다." },
  ],
  identityTheftQuiz2: [
    { id: 'itq2', question: "사랑하는 사람처럼 들리더라도 긴급하고 예상치 못한 돈 요구 전화를 받으면 어떻게 해야 하나요?", options: ["즉시 돈 보내기", "은행 정보 공유하기", "전화를 끊고 독립적으로 확인하기", "가능한 한 오래 통화 유지하기"], correctAnswer: "전화를 끊고 독립적으로 확인하기", explanation: "사기꾼들은 긴급성과 감정적 조작에 의존합니다. 조치를 취하기 전에 항상 별도의 신뢰할 수 있는 통신 채널을 통해 그러한 요청을 확인하십시오." },
  ],
};

export const CASE_STUDIES: { [key: string]: CaseStudy } = {
  humorousDeepfake: {
    id: 'cs1',
    title: "딥페이크 기술 개념 소개",
    type: 'video',
    contentUrl: 'https://d3srmxrzq4dz1v.cloudfront.net/video-url/deepfake_concept.m4v',
    description: "딥페이크와 딥보이스 기술이 무엇인지, 어떻게 작동하는지 보여주는 개념 영상입니다. 이 기술들이 어떻게 현실적인 가짜 콘텐츠를 만들어낼 수 있는지 확인해보세요.",
    narrationScript: "이제 많은 애플리케이션들이 AI 캐릭터, 이미지, 비디오를 쉽게 만들 수 있게 해줍니다. 하지만 과연 우리는 무엇이 진짜이고 가짜인지 구별할 수 있을까요?", // This script can be part of the persona's intro to this case study.
  },
  fakeNewsImage: {
    id: 'cs_fn1',
    title: "가짜 뉴스 사례 연구 1: AI 생성 인물 사례",
    type: 'instagram',
    instagramUrl: 'https://www.instagram.com/p/C-JxJxJJxJx/', // Example - replace with real deepfake awareness post
    description: "AI로 생성된 가짜 인물이 실제 사람처럼 소셜미디어에 등장하는 사례를 살펴보겠습니다. 이런 가짜 계정들이 어떻게 잘못된 정보를 퍼뜨리는지 확인해보세요.",
    narrationScript: "이런 AI 생성 인물들은 점점 더 정교해지고 있으며, 실제 사람과 구별하기 어려워지고 있습니다. 소셜미디어에서 이런 가짜 계정들을 조심해야 합니다.",
  },
  fakeNewsVideo: {
    id: 'cs_fn2',
    title: "가짜 뉴스 사례 연구 2: 딥페이크 영상 사례",
    type: 'instagram',
    instagramUrl: 'https://www.instagram.com/p/C9AbCdEfGhI/', // Example - replace with deepfake educational content
    description: "유명인이나 정치인의 모습과 목소리를 AI로 조작한 딥페이크 영상이 소셜미디어에서 어떻게 퍼지는지 보여주는 사례입니다. (이것이 당신의 얼굴과 복제된 목소리가 있는 비디오라고 상상해 보십시오.)",
    narrationScript: "이런 딥페이크 기술은 점점 발전하고 있어서, 누구나 쉽게 가짜 영상을 만들 수 있게 되었습니다. 이것이 당신의 얼굴과 목소리로 만들어진다면 어떨까요?",
  },
  phishingCall: {
    id: 'cs_it1',
    title: "사기 사례 연구 1: '손주' 사칭 전화",
    type: 'text',
    description: (
      <div>
        <p>한 노인이 전화를 받습니다. 상대방의 목소리는 손주와 똑같이 들리며, 곤경에 처해 긴급하게 돈이 필요하다고 주장합니다. 목소리는 AI 복제품입니다.</p>
        <p className="mt-2 italic">(이 시나리오를 상상해 보십시오: 당신이 전화를 받고, 당신의 목소리가 사랑하는 사람에게 돈을 요구합니다.)</p>
      </div>
    ),
    narrationScript: "이것은 흔한 사기입니다. 당신의 복제된 목소리는 이 도움 요청을 가족에게 믿을 수 없을 정도로 현실적으로 들리게 할 수 있습니다.",
  },
  CEOPhishing: {
    id: 'cs_it2',
    title: "사기 사례 연구 2: 음성을 통한 CEO 사기",
    type: 'text',
    description: "한 직원이 CEO로부터 온 것처럼 보이는 음성 메시지를 받습니다. 긴급한 송금을 지시하는 내용입니다. CEO의 목소리는 AI에 의해 완벽하게 복제되었습니다.",
    narrationScript: "기업 환경에서 복제된 임원 목소리는 사기 거래를 승인하여 상당한 재정적 손실을 초래할 수 있습니다.",
  }
};

export const FAKE_NEWS_MODULE_STEPS: ModuleStep[] = [
  { id: 'fn_intro', title: "모듈 소개", type: 'narration', narrationScript: SCRIPTS.fakeNewsIntro }, // Persona will say this
  { id: 'fn_tech', title: "가짜 뉴스 기술", type: 'info', content: "AI 도구는 현실적인 텍스트, 이미지 및 비디오를 만들 수 있습니다. 예를 들어, 생성적 적대 신경망(GAN)은 이미지를 생성할 수 있고, 대규모 언어 모델은 기사를 작성할 수 있습니다. 딥페이크 기술은 얼굴을 바꾸거나 정적 이미지를 애니메이션화합니다.", narrationScript: SCRIPTS.fakeNewsTech }, // Persona will introduce this content
  { id: 'fn_cs1', title: "사례 연구: 조작된 이미지", type: 'caseStudy', caseStudyId: 'fakeNewsImage', requires: ['userImage'] },
  { id: 'fn_cs2', title: "사례 연구: 조작된 비디오", type: 'caseStudy', caseStudyId: 'fakeNewsVideo', requires: ['userImage', 'userVoice'] },
  { id: 'fn_quiz1', title: "간단 퀴즈", type: 'quiz', quizId: 'fakeNewsQuiz1' },
  { id: 'fn_risk', title: "개인화된 위험", type: 'narration', narrationScript: SCRIPTS.fakeNewsRisk },
  { id: 'fn_interactive', title: "개인화된 가짜 뉴스", type: 'interactive', content: "뉴스 헤드라인을 상상해 보세요: '[Your Name] 충격적인 사건에 연루!' 당신의 캐리커처가 등장합니다. (이것은 당신의 이미지가 어떻게 사용될 수 있는지 보여줍니다.)", requires: ['userCaricature', 'userVoice'] },
  { id: 'fn_share', title: "공유 (시뮬레이션)", type: 'info', content: "실제 시나리오에서는 이 가짜 뉴스가 공유될 수 있습니다. 여기서는 공유 버튼을 시뮬레이션했습니다. (이 데모에서는 공유가 비활성화되어 있습니다)" },
  { id: 'fn_counter', title: "대응 및 대책", type: 'narration', narrationScript: SCRIPTS.fakeNewsCountermeasures },
  { id: 'fn_quiz2', title: "최종 퀴즈", type: 'quiz', quizId: 'fakeNewsQuiz2' },
];

export const IDENTITY_THEFT_MODULE_STEPS: ModuleStep[] = [
  { id: 'it_intro', title: "모듈 소개", type: 'narration', narrationScript: SCRIPTS.identityTheftIntro },
  { id: 'it_tech', title: "피싱 기술", type: 'info', content: "음성 복제 AI는 단 몇 초의 오디오만으로 합성 음성을 만들 수 있습니다. 이것은 사회 공학 기술과 결합되어 피싱 전화를 매우 효과적으로 만들 수 있습니다.", narrationScript: SCRIPTS.identityTheftTech },
  { id: 'it_cs1', title: "사례 연구: '손주' 사칭 사기", type: 'caseStudy', caseStudyId: 'phishingCall', requires: ['userVoice'] },
  { id: 'it_cs2', title: "사례 연구: CEO 사기", type: 'caseStudy', caseStudyId: 'CEOPhishing', requires: ['userVoice'] },
  { id: 'it_quiz1', title: "간단 퀴즈", type: 'quiz', quizId: 'identityTheftQuiz1' },
  { id: 'it_risk', title: "개인화된 위험", type: 'narration', narrationScript: SCRIPTS.identityTheftRisk },
  { id: 'it_interactive', title: "개인화된 사기 시나리오", type: 'interactive', content: "사랑하는 사람이 전화를 받는다고 상상해 보세요. 당신의 복제된 목소리가 괴로워하며 당신의 캐리커처를 화상 통화 아바타로 사용하여 긴급한 재정 지원을 요청합니다. (이것은 당신의 목소리와 이미지가 어떻게 사용될 수 있는지 보여줍니다.)", requires: ['userCaricature', 'userVoice'] },
  { id: 'it_share', title: "공유 (시뮬레이션)", type: 'info', content: "사기꾼들은 이러한 전술을 사용할 수 있습니다. 이러한 콘텐츠가 얼마나 쉽게 퍼질 수 있는지 보여주기 위해 여기서는 공유 버튼을 시뮬레이션했습니다. (공유 비활성화됨)" },
  { id: 'it_counter', title: "대응 및 대책", type: 'narration', narrationScript: SCRIPTS.identityTheftCountermeasures },
  { id: 'it_quiz2', title: "최종 퀴즈", type: 'quiz', quizId: 'identityTheftQuiz2' },
];

export const MOCK_VOICE_ID = "mock_voice_123";
export const MOCK_CARICATURE_URL = "https://picsum.photos/seed/caricature/300/300";
export const MOCK_TALKING_PHOTO_URL = "https://picsum.photos/seed/talkingphoto/400/300";
export const MOCK_FACESWAP_IMAGE_URL = "https://picsum.photos/seed/faceswap/400/300";

export const PLACEHOLDER_USER_IMAGE = "https://picsum.photos/seed/userplaceholder/200/200";

export const DEFAULT_NARRATION_VOICE = "alloy";

export const DEEPFAKE_IDENTIFICATION_VIDEO_URL = "https://d3srmxrzq4dz1v.cloudfront.net/video-url/deepfake_concept.m4v";

export const DEEPFAKE_PEOPLE_DATA: PersonIdentificationData[] = [
  { 
    id: 'p1', 
    name: 'Case 1', 
    isFake: true, 
    videoUrl: "https://d3srmxrzq4dz1v.cloudfront.net/video-url/case1.mp4",
    explanation: "이 영상은 AI로 생성된 딥페이크입니다. 얼굴의 미묘한 왜곡과 부자연스러운 표정 변화를 주목해보세요." 
  },
  { 
    id: 'p2', 
    name: 'Case 2', 
    isFake: true, 
    videoUrl: "https://d3srmxrzq4dz1v.cloudfront.net/video-url/case2.mp4",
    explanation: "이 영상도 AI로 생성된 딥페이크입니다. 입술 동기화와 눈의 움직임이 부자연스러운 점을 확인할 수 있습니다." 
  },
  { 
    id: 'p3', 
    name: 'Case 3', 
    isFake: true, 
    videoUrl: "https://d3srmxrzq4dz1v.cloudfront.net/video-url/case3.mp4",
    explanation: "이 영상 역시 AI로 생성된 딥페이크입니다. 배경과 얼굴의 경계가 흐릿하고 일관성이 없는 부분을 주목하세요." 
  },
  { 
    id: 'p4', 
    name: 'Case 4', 
    isFake: true, 
    videoUrl: "https://d3srmxrzq4dz1v.cloudfront.net/video-url/case4.mov",
    explanation: "이 영상도 AI로 생성된 딥페이크입니다. 전체적으로 너무 완벽해 보이는 얼굴과 부자연스러운 조명을 확인할 수 있습니다." 
  },
];