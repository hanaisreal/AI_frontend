
import { QuizQuestion, ModuleStep, PersonIdentificationData } from './types.ts';

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
  
  // New scripts for deepfake introduction flow
  deepfakeIntroStart: "먼저, 딥페이크, 딥보이스 어떻게 만들어지는지 영상을 통해 확인해볼게요.",
  deepfakeQuizIntro: "좋습니다. 요즘에는 가짜 얼굴 합성과 더불어서 가짜 영상을 만들수도 있어요. 다음 퀴즈를 통해 알아볼까요? 가짜 영상인지 아닌지 맞춰보세요!",
  deepfakeQuizComplete: "전부 만들어진 영상입니다! 이제 다음으로 딥페이크, 딥보이스가 어떻게 악용될 수 있는지 자세히 살펴볼게요.",

  // Module 1 (Fake News) - Updated detailed flow
  fakeNewsIntroDetailed: "가짜 뉴스는, 거짓말인데 진짜처럼 보이는 소식이에요. 예를 들어, '이 약 먹으면 3일 만에 치매가 낫는다' 이런 말을 들으면 혹하죠. 하지만 알고 보면 사기인 경우가 많아요.",
  fakeNewsCaseStudyIntro: "이제 사례 영상들을 통해 딥페이크가 어떻게 악용될 수 있는지, 그리고 우리가 어떻게 주의해야 하는지 알아보세요.",
  fakeNewsCase1: "젤렌스키가 트럼프를 때리는 가짜 영상.",
  fakeNewsCase2: "에펠타워가 불에 타는 영상이에요~",
  fakeNewsExperienceIntro: "이제 직접 딥페이크를 만들어보는 체험을 해볼 거예요.",
  fakeNewsScenario1Audio: "1등 당첨돼서 정말 기뻐요!",
  fakeNewsScenario1to2: "이런 기사가 주변 지인들에게 퍼진다면 재미로 넘길수도 있겠지만, 만약 나쁜쪽으로 이어진다면 어떨까요?",
  fakeNewsScenario2Audio: "찍지 마세요. 죄송합니다…",
  fakeNewsWrapUp: "이런식으로 뉴스 기사가 난다고 생각하니 정말 무섭네요. 이제 딥페이크 영상에 대한 대응방안을 함께 알아볼까요?",
  fakeNewsDetectionIntro: "딥페이크 영상은 이제 정교하게 만들어져서 실제로 구분하기 정말 어려워졌어요. 그래도 딥페이크 영상을 분별할 수 있는 몇가지 팁들을 알아볼게요.",
  fakeNewsDetectionTips: "누가 영상이나 뉴스를 보내줬다고 해서, 다 믿으면 안 돼요. 누가 만든 건지, 진짜 뉴스에 나왔는지, 그 사람 공식 계정에 올라온 건지 꼭 출처를 확인하는 습관이 필요해요. 영상을 봤을 때 바로 확인해야 할 요소들로는 블러나 어색한 경계 등이 있어요.",
  fakeNewsModuleEnd: "첫 번째 체험이 모두 끝났어요. 딥페이크 기술의 위험성과 가능성에 대해 조금이나마 이해가 되셨기를 바라요. 다음 파트로 이동해볼까요?",

  // Module 2 (Identity Theft) - Updated detailed flow
  identityTheftCaseStudyIntro: "각 사례를 통해 이 기술이 우리 생활에 어떤 영향을 미칠 수 있는지 알아보세요.",
  identityTheftCase1: "유명 연예인을 사칭해서 투자를 하라는 영상 소개",
  identityTheftCase2: "유명한 축구선수가 주식 종목을 추천해주는 영상.",
  identityTheftExperienceIntro: "이제 일상생활에서 신원 도용이 일어나는 체험을 해볼 거예요.",
  identityTheftScenario1Intro: "본인이 투자 사기를 시도하는 상황을 체험해보겠습니다. 목소리 변조로 본인의 목소리가 사용되다면 어떨까요?",
  identityTheftScenario1Audio: "요즘 투자 정보 하나 알아낸 게 있는데, 친구들 다 2~3배씩 수익 났다고 하더라. 내가 링크 하나 보낼 테니까 한번 들어가서 확인해봐.",
  identityTheftVoiceModulation: "이 목소리가 실시간으로 변조돼서 전화에 사용될 수 있어요!",
  identityTheftScenario2Intro: "사고 상황을 가장하여 긴급한 돈을 요구하는 사기 상황을 체험해보겠습니다.",
  identityTheftScenario2Audio: "나 지금 교통사고가 났어. 보험 부르지 말고 그냥 적당히 합의보는 게 좋을 것 같아. 혹시 지금 50만 원만 보내줄 수 있을까?",
  identityTheftWrapUp: "이제는 실시간으로 얼굴 변조랑 목소리 변조까지 가능하니, 이런식으로 가족한테 연락이 간다면 속을 수 있을거 같아요.",
  identityTheftDetectionIntro: "딥페이크 영상은 이제 정교하게 만들어져서 실제로 구분하기 정말 어려워졌어요. 신원도용에 맞서기 위해 알아야할 몇가지 팁들을 알아볼게요.",
  identityTheftDetectionTips: "걸려온 전화의 경우 가족간의 암호를 물어봄으로써 상대방이 가족이 맞는지 확인하기. 온라인에 사진 올리지 말기. 가족들 포함해서. 가족을 저장할때 '딸, 아들'이라고 저장하지 말고 이름으로 저장하기. 본인의 핸드폰이 해킹되었을 경우 가족들의 신분이 노출되지 않기 위해.",
  identityTheftModuleEnd: "신원도용에 대한 체험이 끝났어요. 앞으로 이런 상황들을 조심해서 대처하시길 바라요.",
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

// NOTE: CASE_STUDIES removed - all content now uses direct step definitions and real-time AI generation

export const FAKE_NEWS_MODULE_STEPS: ModuleStep[] = [
  // 1. Narrator explains fake news concept
  { 
    id: 'fn_intro', 
    title: "가짜 뉴스 개념 설명", 
    type: 'narration', 
    narrationScript: SCRIPTS.fakeNewsIntroDetailed,
    requires: ['userCaricature']
  },
  
  // 2. Narrator introduces case studies
  { 
    id: 'fn_case_intro', 
    title: "사례 영상 소개", 
    type: 'narration', 
    narrationScript: SCRIPTS.fakeNewsCaseStudyIntro,
    requires: ['userCaricature'] 
  },
  
  // 3. Case 1: Zelensky vs Trump narration
  { 
    id: 'fn_case1_narration', 
    title: "사례 1 설명", 
    type: 'narration', 
    narrationScript: SCRIPTS.fakeNewsCase1,
    requires: ['userCaricature']
  },
  
  // 4. Case 1: Show video
  { 
    id: 'fn_case1_video', 
    title: "사례 1: 젤렌스키 가짜 영상", 
    type: 'video_case_study', 
    videoUrl: "https://deepfake-videomaking.s3.us-east-1.amazonaws.com/video-url/part1_case3.mov" 
    // 🎥 VIDEO NEEDED: Fake video of Zelensky hitting Trump (가짜 영상: 젤렌스키가 트럼프를 때리는 영상)
  },
  
  // 5. Case 2: Eiffel Tower narration  
  { 
    id: 'fn_case2_narration', 
    title: "사례 2 설명", 
    type: 'narration', 
    narrationScript: SCRIPTS.fakeNewsCase2, // Says: "에펠타워가 불에 타는 영상이에요~"
    requires: ['userCaricature']
  },
  
  // 6. Case 2: Show video
  { 
    id: 'fn_case2_video', 
    title: "사례 2: 에펠타워 화재 영상", 
    type: 'video_case_study', 
    videoUrl: "https://deepfake-videomaking.s3.us-east-1.amazonaws.com/video-url/fakenews-eiffel-on-fire.mp4" 
    // 🎥 VIDEO NEEDED: Fake video of Eiffel Tower on fire (가짜 영상: 에펠타워가 불에 타는 영상)
    // This should be a deepfake video showing Eiffel Tower burning (fake news example)
  },
  
  // 7. Experience introduction
  { 
    id: 'fn_experience_intro', 
    title: "체험 소개", 
    type: 'narration', 
    narrationScript: SCRIPTS.fakeNewsExperienceIntro,
    requires: ['userCaricature']
  },
  
  // 8. Scenario 1: Lottery winner faceswap + talking photo
  { 
    id: 'fn_scenario1', 
    title: "시나리오 1: 복권 당첨", 
    type: 'faceswap_scenario', 
    scenarioType: 'lottery',
    baseImageMale: "https://deepfake-videomaking.s3.us-east-1.amazonaws.com/video-url/fakenews-case1-male.png", 
    // 🖼️ IMAGE NEEDED (MALE): Photo of man holding lottery winning certificate/ticket, happy expression
    // This will be used to faceswap the user's face onto, user will say: "1등 당첨돼서 정말 기뻐요!"
    baseImageFemale: "https://deepfake-videomaking.s3.us-east-1.amazonaws.com/video-url/fakenews-case1-female.png", 
    // 🖼️ IMAGE NEEDED (FEMALE): Photo of woman holding lottery winning certificate/ticket, happy expression  
    // This will be used to faceswap the user's face onto, user will say: "1등 당첨돼서 정말 기뻐요!"
    audioScript: SCRIPTS.fakeNewsScenario1Audio, // "1등 당첨돼서 정말 기뻐요!"
    requires: ['userImage', 'userVoice']
  },
  
  // 9. Transition to negative scenario
  { 
    id: 'fn_scenario_transition', 
    title: "시나리오 전환", 
    type: 'narration', 
    narrationScript: SCRIPTS.fakeNewsScenario1to2,
    requires: ['userCaricature']
  },
  
  // 10. Scenario 2: Crime suspect faceswap + talking photo
  { 
    id: 'fn_scenario2', 
    title: "시나리오 2: 범죄 용의자", 
    type: 'faceswap_scenario', 
    scenarioType: 'crime',
    baseImageMale: "https://deepfake-videomaking.s3.us-east-1.amazonaws.com/video-url/fakenews-case2-male.png", 
    // 🖼️ IMAGE NEEDED (MALE): Photo of man being arrested/interrogated (news photo style)
    // User's face will be swapped here, saying: "찍지 마세요. 죄송합니다…" (like crime suspect)
    baseImageFemale: "https://deepfake-videomaking.s3.us-east-1.amazonaws.com/video-url/fakenews-case2-female.png", 
    // 🖼️ IMAGE NEEDED (FEMALE): Photo of woman being arrested/interrogated (news photo style)  
    // User's face will be swapped here, saying: "찍지 마세요. 죄송합니다…" (like crime suspect)
    audioScript: SCRIPTS.fakeNewsScenario2Audio, // "찍지 마세요. 죄송합니다…"
    requires: ['userImage', 'userVoice']
  },
  
  // 11. Wrap up scenarios
  { 
    id: 'fn_wrap_up', 
    title: "사례 정리", 
    type: 'narration', 
    narrationScript: SCRIPTS.fakeNewsWrapUp,
    requires: ['userCaricature']
  },
  
  // 12. Detection tips introduction
  { 
    id: 'fn_detection_intro', 
    title: "대응 방안 소개", 
    type: 'narration', 
    narrationScript: SCRIPTS.fakeNewsDetectionIntro,
    requires: ['userCaricature']
  },
  
  // 13. Detection tips content
  { 
    id: 'fn_detection_tips', 
    title: "딥페이크 분별 팁", 
    type: 'info', 
    content: `
      <div class="space-y-4">
        <h3 class="text-xl font-bold mb-4">딥페이크 영상 분별 방법</h3>
        <div class="space-y-3">
          <p><strong>1. 출처 확인:</strong> 누가 만든 건지, 진짜 뉴스에 나왔는지, 공식 계정에 올라온 건지 확인</p>
          <p><strong>2. 시각적 단서:</strong> 블러나 어색한 경계선 확인</p>
          <p><strong>3. 부자연스러운 움직임:</strong> 입술 동기화나 눈 깜빡임 패턴 확인</p>
          <p><strong>4. MIT 딥페이크 탐지 가이드:</strong> <a href="https://www.media.mit.edu/projects/detect-fakes/overview/" target="_blank" class="text-blue-600 underline">자세한 정보 확인</a></p>
        </div>
      </div>
    `,
    narrationScript: SCRIPTS.fakeNewsDetectionTips
  },
  
  // 14. Module conclusion
  { 
    id: 'fn_conclusion', 
    title: "모듈 마무리", 
    type: 'narration', 
    narrationScript: SCRIPTS.fakeNewsModuleEnd,
    requires: ['userCaricature']
  }
];

export const IDENTITY_THEFT_MODULE_STEPS: ModuleStep[] = [
  // 1. Narrator explains identity theft concept
  { 
    id: 'it_intro', 
    title: "신원 도용 개념 설명", 
    type: 'narration', 
    narrationScript: SCRIPTS.identityTheftIntro,
    requires: ['userCaricature']
  },
  
  // 2. Narrator introduces case studies
  { 
    id: 'it_case_intro', 
    title: "사례 영상 소개", 
    type: 'narration', 
    narrationScript: SCRIPTS.identityTheftCaseStudyIntro,
    requires: ['userCaricature'] 
  },
  
  // 3. Case 1: Celebrity investment scam narration
  { 
    id: 'it_case1_narration', 
    title: "사례 1 설명", 
    type: 'narration', 
    narrationScript: SCRIPTS.identityTheftCase1,
    requires: ['userCaricature']
  },
  
  // 4. Case 1: Show video
  { 
    id: 'it_case1_video', 
    title: "사례 1: 연예인 투자 사기 영상", 
    type: 'video_case_study', 
    videoUrl: "https://deepfake-videomaking.s3.us-east-1.amazonaws.com/video-url/identitytheft_case1.m4v" 
    // 🎥 VIDEO NEEDED: Celebrity (actor/singer) promoting fake investment scheme using deepfake
    // 유명 연예인을 사칭해서 투자를 하라는 영상 (deepfake celebrity investment scam video)
  },
  
  // 5. Case 2: Soccer player stock recommendation narration  
  { 
    id: 'it_case2_narration', 
    title: "사례 2 설명", 
    type: 'narration', 
    narrationScript: SCRIPTS.identityTheftCase2, // Says: "유명한 축구선수가 주식 종목을 추천해주는 영상."
    requires: ['userCaricature']
  },
  
  // 6. Case 2: Show video
  { 
    id: 'it_case2_video', 
    title: "사례 2: 축구선수 주식 추천 영상", 
    type: 'video_case_study', 
    videoUrl: "https://deepfake-videomaking.s3.us-east-1.amazonaws.com/video-url/identitytheft-case2.m4v" 
    // 🎥 VIDEO NEEDED: Famous soccer player recommending stocks using deepfake technology
    // 유명한 축구선수가 주식 종목을 추천해주는 영상 (deepfake soccer player stock recommendation)
  },
  
  // 7. Experience introduction
  { 
    id: 'it_experience_intro', 
    title: "체험 소개", 
    type: 'narration', 
    narrationScript: SCRIPTS.identityTheftExperienceIntro,
    requires: ['userCaricature']
  },
  
  // 8. Scenario 1: Investment scam voice call introduction
  { 
    id: 'it_scenario1_intro', 
    title: "시나리오 1 소개", 
    type: 'narration', 
    narrationScript: SCRIPTS.identityTheftScenario1Intro,
    requires: ['userCaricature']
  },
  
  // 9. Scenario 1: Investment scam voice call simulation
  { 
    id: 'it_scenario1', 
    title: "시나리오 1: 투자 사기 전화", 
    type: 'voice_call_scenario', 
    scenarioType: 'investment_call',
    callType: 'voice',
    audioScript: SCRIPTS.identityTheftScenario1Audio,
    requires: ['userVoice']
  },
  
  // 10. Voice modulation explanation
  { 
    id: 'it_voice_modulation', 
    title: "음성 변조 설명", 
    type: 'narration', 
    narrationScript: SCRIPTS.identityTheftVoiceModulation,
    requires: ['userCaricature']
  },
  
  // 11. Scenario 2: Car accident emergency introduction
  { 
    id: 'it_scenario2_intro', 
    title: "시나리오 2 소개", 
    type: 'narration', 
    narrationScript: SCRIPTS.identityTheftScenario2Intro,
    requires: ['userCaricature']
  },
  
  // 12. Scenario 2: Car accident emergency video call
  { 
    id: 'it_scenario2', 
    title: "시나리오 2: 사고 긴급 전화", 
    type: 'video_call_scenario', 
    scenarioType: 'accident_call',
    callType: 'video',
    audioScript: SCRIPTS.identityTheftScenario2Audio, // "나 지금 교통사고가 났어. 보험 부르지 말고 그냥 적당히 합의보는 게 좋을 것 같아. 혹시 지금 50만 원만 보내줄 수 있을까?"
    baseImageMale: "https://example.com/video-call-male.mp4", 
    // 🎥 VIDEO NEEDED (MALE): Video of man on video call (face visible, talking), emergency/stressed expression
    // User's face will be swapped onto this person for video call simulation
    baseImageFemale: "https://example.com/video-call-female.mp4", 
    // 🎥 VIDEO NEEDED (FEMALE): Video of woman on video call (face visible, talking), emergency/stressed expression  
    // User's face will be swapped onto this person for video call simulation
    requires: ['userImage', 'userVoice']
  },
  
  // 13. Wrap up scenarios
  { 
    id: 'it_wrap_up', 
    title: "사례 정리", 
    type: 'narration', 
    narrationScript: SCRIPTS.identityTheftWrapUp,
    requires: ['userCaricature']
  },
  
  // 14. Detection tips introduction
  { 
    id: 'it_detection_intro', 
    title: "대응 방안 소개", 
    type: 'narration', 
    narrationScript: SCRIPTS.identityTheftDetectionIntro,
    requires: ['userCaricature']
  },
  
  // 15. Detection tips content
  { 
    id: 'it_detection_tips', 
    title: "신원 도용 방지 팁", 
    type: 'info', 
    content: `
      <div class="space-y-4">
        <h3 class="text-xl font-bold mb-4">신원 도용 방지 방법</h3>
        <div class="space-y-3">
          <p><strong>1. 가족 암호:</strong> 걸려온 전화의 경우 가족간의 암호를 물어봄으로써 확인</p>
          <p><strong>2. 온라인 사진 주의:</strong> 온라인에 사진 올리지 말기 (가족들 포함)</p>
          <p><strong>3. 연락처 저장:</strong> 가족을 '딸, 아들'이 아닌 이름으로 저장하기</p>
          <p><strong>4. 즉시 확인:</strong> 의심스러운 요청 시 다른 방법으로 본인 확인</p>
        </div>
      </div>
    `,
    narrationScript: SCRIPTS.identityTheftDetectionTips
  },
  
  // 16. Module conclusion
  { 
    id: 'it_conclusion', 
    title: "모듈 마무리", 
    type: 'narration', 
    narrationScript: SCRIPTS.identityTheftModuleEnd,
    requires: ['userCaricature']
  }
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
    explanation: "이 영상은 AI로 생성된 영상일까요? 아니면 진짜 영상일까요?" 
  },
  { 
    id: 'p2', 
    name: 'Case 2', 
    isFake: true, 
    videoUrl: "https://d3srmxrzq4dz1v.cloudfront.net/video-url/case2.mp4",
    explanation: "이 영상은 AI로 생성된 영상일까요? 아니면 진짜 영상일까요?" 
  },
  { 
    id: 'p3', 
    name: 'Case 3', 
    isFake: true, 
    videoUrl: "https://d3srmxrzq4dz1v.cloudfront.net/video-url/case3.mp4",
    explanation: "이 영상은 AI로 생성된 영상일까요? 아니면 진짜 영상일까요?" 
  },
  { 
    id: 'p4', 
    name: 'Case 4', 
    isFake: true, 
    videoUrl: "https://d3srmxrzq4dz1v.cloudfront.net/video-url/case4.mov",
    explanation: "이 영상은 AI로 생성된 영상일까요? 아니면 진짜 영상일까요?" 
  },
];