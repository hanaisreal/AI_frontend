import { QuizQuestion, ModuleStep, PersonIdentificationData } from './types.ts';

export const APP_TITLE = "AI 기술(딥페이크, 딥보이스)란?";

export const SCRIPTS = {
  welcome: "안녕하세요! 딥페이크와 딥보이스 기술 체험에 오신 것을 진심으로 환영합니다.",
  caricatureGenerated: "이제 당신만의 특별한 캐릭터가 완성됐어요! 정말 멋지죠?",
  talkingPhotoGenerated: "짜잔! 이제 실제 상황에서 이 기술들이 어떻게 쓰일 수 있는지 살펴볼까요?",
  moduleSelection: "체험해보고 싶은 경험을 선택해 주세요. 궁금한 주제를 골라서 직접 느껴보세요!",
  module1Complete: "가짜 뉴스 모듈을 모두 마쳤어요! 이제 다른 주제도 함께 경험해볼까요?",
  module2Complete: "신원 도용 모듈이 끝났어요! 남은 모듈도 도전해보세요.",
  allModulesComplete: "정말 축하드려요! 모든 체험을 완료하셨습니다. 오늘의 경험이 앞으로 디지털 세상을 더 안전하게 살아가는 데 도움이 되길 바랍니다.",
  videoQuizIntro: "이제 네 가지 영상을 보여드릴게요. 각 영상을 천천히 관찰하면서, 진짜인지 AI가 만든 가짜인지 한 번 맞춰보세요. 준비되셨나요?",


  // Scripts for deepfake introduction flow
  
  deepfakeIntroStart: "먼저, 딥페이크와 딥보이스가 무엇인지부터 차근차근 알아볼게요. AI가 어떻게 사람의 얼굴과 목소리를 바꿀 수 있는지, 함께 체험해보면서 느껴보세요.",
  deepfakeConcept: "혹시 영화에서 배우의 얼굴이 다른 사람으로 바뀌는 장면을 본 적 있으신가요? 딥페이크는 그런 마법을 현실로 만들어주는 기술이에요. 인공지능이 사람의 얼굴을 분석해서, 마치 진짜처럼 다른 얼굴로 바꿔주는 거죠. 그래서 실제로 하지 않은 말이나 행동도, 영상 속에서는 진짜처럼 보일 수 있답니다. 신기하지만, 동시에 조심해야 할 점도 많아요.",
  deepvoiceConcept: "그리고 딥보이스라는 기술도 있어요. 짧은 목소리 샘플만 있으면, 인공지능이 그 사람의 목소리를 똑같이 흉내낼 수 있죠. 예를 들어, 내가 한 번만 '안녕하세요'라고 말해도, AI가 내 목소리로 다양한 말을 만들어낼 수 있어요. 이 기술도 재미있게 쓸 수 있지만, 누군가를 속이거나 사기에 악용될 수도 있어서 주의가 필요해요.",
  deepfakeQuizIntro: "이제 실제로 AI가 만든 영상과 진짜 영상을 구별해보는 시간을 가져볼 거예요. 영상을 보면서 어떤 점이 자연스럽고, 어떤 점이 어색한지 유심히 살펴보세요.",
  deepfakeQuizComplete: "방금 보신 영상들, 모두 AI가 만들어낸 가짜였어요! 놀랍지 않으신가요? 이제 이런 기술들이 실제로 어떻게 사용될 수 있는지, 그리고 우리가 어떻게 대처해야 하는지 알아보러 가볼까요?",

  // Module 1 (Fake News) - Updated detailed flow
  fakeNewsIntroDetailed: "가짜 뉴스란, 진짜처럼 보이지만 사실은 거짓인 소식이에요. 예를 들어, '이 약을 먹으면 3일 만에 치매가 낫는다' 같은 이야기를 들으면 혹할 수 있지만, 알고 보면 사실이 아닌 경우가 많죠. AI가 이런 뉴스를 어떻게 만들어내는지 함께 알아볼까요?",
  fakeNewsCaseStudyIntro: "이제 실제 사례 영상을 통해 딥페이크가 어떻게 악용될 수 있는지, 그리고 우리가 어떤 점을 조심해야 하는지 살펴보겠습니다.",
  fakeNewsCase1: "첫 번째 사례는 젤렌스키 대통령이 트럼프 대통령을 주먹으로 때리는 장면이 담긴 가짜 영상이에요. 함께 영상을 보면서, 어떤 점이 진짜 같고 어떤 점이 어색한지 생각해보세요.",
  fakeNewsCase2: "이런 영상만 본다면 정말 속을 수도 있겠죠? 다음은 에펠타워가 불에 타는 영상이에요. 이 영상도 진짜일지, 가짜일지 한 번 살펴볼까요?",
  fakeNewsExperienceIntro: "이제 직접 딥페이크 기술로 가짜 뉴스를 만들어보는 체험을 해볼 거예요. 만약 내 얼굴이나 목소리가 뉴스에 등장한다면 어떤 기분일지 상상해보세요.",
  fakeNewsScenario1Audio: "1등 당첨돼서 정말 기뻐요! 감사합니다!",
  fakeNewsScenario1to2: "이런 기사가 주변에 퍼진다면 재미로 넘길 수도 있지만, 만약 누군가를 곤란하게 만드는 가짜 뉴스가 만들어진다면 어떨까요?",
  fakeNewsScenario2Audio: "제가 한 거 아니에요... 찍지 마세요. 죄송합니다…",
  fakeNewsWrapUp: "이렇게 가짜 뉴스가 만들어진다고 생각하니, 정말 조심해야겠다는 생각이 들죠?",
  fakeNewsDetectionIntro: "사례들을 보니 정말 그럴듯하죠? 그렇다면 이런 딥페이크가 적용된 가짜 뉴스에 속지 않으려면 어떻게 해야 할까요?",
  fakeNewsDetectionTips: "누가 영상이나 뉴스를 보내줬다고 해서, 무조건 믿으면 안 돼요. 누가 만들었는지, 진짜 뉴스에 나온 건지, 공식 계정에 올라온 건지 꼭 출처를 확인하는 습관이 필요해요.",
  fakeNewsDetectionTips2: "딥페이크 영상은 얼핏 보면 진짜처럼 보여도, 자세히 보면 어딘가 어색한 점이 있어요. 얼굴의 움직임, 입모양과 소리의 싱크, 피부의 질감 등을 꼼꼼히 살펴보면 가짜를 구별할 수 있습니다.",
  fakeNewsModuleEnd: "첫 번째 체험이 모두 끝났어요. 딥페이크 기술의 놀라움과 위험성, 그리고 우리가 가져야 할 경각심에 대해 조금 더 이해가 되셨길 바랍니다. 다음 파트로 넘어가볼까요?",

  // Module 2 (Identity Theft) - Updated detailed flow
  identityTheftIntro: "신원 도용이란, 누군가 내 이름이나 주민번호를 훔쳐서 내가 아닌 사람이 나인 척하는 거예요. 이제는 얼굴이나 목소리까지도 도용될 수 있어서, 더욱 주의가 필요하답니다.",
  identityTheftCaseStudyIntro: "각 사례를 통해 이 기술이 우리 생활에 어떤 영향을 미칠 수 있는지 알아보세요. 실제로 어떤 일이 일어날 수 있는지 함께 살펴볼게요.",
  identityTheftCase1: "첫 번째 사례는 유명 연예인을 사칭해서 투자를 권유하는 영상이에요. 이런 영상이 내게 온다면, 어떻게 해야 할까요?",
  identityTheftCase2: "다음 사례는 유명한 축구선수가 주식 종목을 추천해주는 영상이에요. 정말 그 사람이 맞는지, 한 번 의심해보는 것도 중요하겠죠?",
  identityTheftExperienceIntro: "이제 일상생활에서 신원 도용이 어떻게 일어날 수 있는지 직접 체험해볼 거예요. 만약 내 목소리가 사기에 사용된다면 어떤 기분일지 상상해보세요.",
  identityTheftScenario1Intro: "이번에는 투자 사기를 시도하는 상황을 체험해보겠습니다. 내 목소리가 변조되어 사용된다면, 정말 깜짝 놀랄 수 있겠죠?",
  identityTheftScenario1Audio: "요즘 투자 정보 하나 알아낸 게 있는데, 친구들 다 2~3배씩 수익 났다고 하더라. 내가 링크 하나 보낼 테니까 한번 들어가서 확인해봐.",
  identityTheftVoiceModulation: "이 목소리가 실시간으로 변조돼서 전화에 사용될 수 있어요! 정말 신기하지만, 동시에 무섭기도 하죠.",
  identityTheftScenario2Intro: "다음 체험에서는 사고 상황을 가장해서 돈을 요구하는 사기 상황을 경험해볼 거예요. 이런 전화를 받으면 어떻게 해야 할까요?",
  identityTheftScenario2Audio: "나 지금 교통사고가 났어. 보험 부르지 말고 그냥 적당히 합의보는 게 좋을 것 같아. 혹시 지금 50만 원만 보내줄 수 있을까?",
  identityTheftWrapUp: "이제는 얼굴 변조와 목소리 변조까지 가능하니, 이런 식으로 가족에게 연락이 온다면 정말 속을 수도 있을 것 같아요. 항상 조심해야겠죠?",
  identityTheftDetectionIntro: "딥페이크 영상과 음성은 점점 더 정교해지고 있어요. 신원 도용에 맞서기 위해 우리가 꼭 알아야 할 대응 방법을 소개할게요.",
  identityTheftDetectionTips: "가족끼리는 암호를 정해두고, 전화가 오면 꼭 확인해보세요. 온라인에는 가족 사진을 올리지 않는 것이 좋고, 연락처는 '딸', '아들' 대신 실제 이름으로 저장하는 것이 안전합니다.",
  identityTheftModuleEnd: "신원 도용에 대한 체험이 끝났어요. 오늘 배운 내용을 꼭 기억해서, 앞으로는 더 안전하게 디지털 세상을 살아가시길 바랄게요!",
};

export const QUIZZES: { [key: string]: QuizQuestion[] } = {
  fakeNewsQuiz1: [
    {
      id: 'fnq1',
      question: "딥페이크 기술은 어떤 방식으로 가짜 영상을 만들까요?",
      options: [
        "사람을 직접 촬영해서 만든다",
        "AI가 얼굴을 바꿔서 만든다",
        "영화를 편집해서 만든다",
        "실제 뉴스 방송을 복사한다"
      ],
      correctAnswer: "AI가 얼굴을 바꿔서 만든다",
      explanation: "딥페이크는 인공지능 기술을 이용해 얼굴을 다른 사람의 얼굴로 바꾸는 방식으로 가짜 영상을 만들어냅니다."
    },
  ],
  fakeNewsQuiz2: [
    {
      id: 'fnq2',
      question: "가짜 뉴스에 속지 않으려면 어떻게 해야 하나요?",
      options: [
        "누가 보냈는지만 보면 된다",
        "제목만 보고 판단한다",
        "출처를 꼭 확인한다",
        "영상이 멋있으면 믿는다"
      ],
      correctAnswer: "출처를 꼭 확인한다",
      explanation: "가짜 뉴스에 속지 않으려면 누가 만들었는지, 믿을 만한 기관에서 나온 것인지 출처를 꼭 확인해야 합니다."
    }
  ],
  identityTheftQuiz1: [
    {
      id: 'itq2',
      question: "딥보이스 기술이 위험한 이유는 무엇인가요?",
      options: [
        "소리를 작게 만든다",
        "사람의 목소리를 따라할 수 있어서",
        "인터넷이 느려진다",
        "음악을 만들 수 있어서"
      ],
      correctAnswer: "사람의 목소리를 따라할 수 있어서",
      explanation: "딥보이스는 실제 사람처럼 목소리를 흉내 낼 수 있어, 가족이나 은행 직원을 사칭하는 데 악용될 수 있습니다."
    }
  ],
  identityTheftQuiz2: [
    {
      id: 'itq2',
      question: "신원 도용을 방지하기 위한 좋은 습관은 무엇인가요?",
      options: [
        "연락처에 '딸', '아들'로 저장하기",
        "가족 사진을 자주 SNS에 올리기",
        "연락처를 이름으로 저장하고 사진 공유를 자제하기",
        "암호 없이 핸드폰 사용하기"
      ],
      correctAnswer: "연락처를 이름으로 저장하고 사진 공유를 자제하기",
      explanation: "연락처를 관계 대신 이름으로 저장하고, 가족 사진을 온라인에 올리지 않는 것이 신원 도용을 예방하는 데 도움이 됩니다."
    }
  ]
};

// NOTE: CASE_STUDIES removed - all content now uses direct step definitions and real-time AI generation

export const FAKE_NEWS_MODULE_STEPS: ModuleStep[] = [
  // 1. Narrator explains fake news concept
  { 
    id: 'fn_intro', 
    title: "가짜 뉴스 개념", 
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
    videoUrl: "https://d3srmxrzq4dz1v.cloudfront.net/video-url/part1_case3.mov" 
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
    videoUrl: "https://d3srmxrzq4dz1v.cloudfront.net/video-url/fakenews-eiffel-on-fire.mp4" 
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
  
  // 13. Detection tips - general advice
  { 
    id: 'fn_detection_general', 
    title: "일반적인 대응 방법", 
    type: 'narration', 
    narrationScript: SCRIPTS.fakeNewsDetectionTips,
    requires: ['userCaricature']
  },
  
  // 14. Detection tips - specific visual cues with content
  { 
    id: 'fn_detection_tips', 
    title: "딥페이크 분별 방법", 
    type: 'info', 
    content: `
     <div class="space-y-4">
      <h3 class="text-xl font-bold mb-4">딥페이크 영상 분별 방법</h3>
      <div class="space-y-3">
        <p><strong>1. 얼굴 전체를 자세히 살펴보세요:</strong> 얼굴의 비율이나 표정이 미묘하게 이상하다면 의심해보세요.</p>
        <p><strong>2. 눈 깜빡임을 확인하세요:</strong> 너무 자주 깜빡이거나 거의 깜빡이지 않으면 딥페이크일 수 있어요.</p>
        <p><strong>3. 입모양과 소리의 싱크를 살펴보세요:</strong> 말소리와 입술 움직임이 어긋나거나 립싱크처럼 느껴지면 가짜일 가능성이 있어요.</p>
        <p><strong>4. 피부와 주름을 관찰하세요:</strong> 피부가 너무 매끈하거나 나이에 맞지 않게 어려 보이는 경우 주의하세요.</p>

      </div>
    </div>
    `,
    narrationScript: SCRIPTS.fakeNewsDetectionTips2
  },
  
  // 15. Quiz 1 - Deepfake visual detection
  { 
    id: 'fn_quiz_1', 
    title: "가짜뉴스 퀴즈", 
    type: 'quiz', 
    quizId: 'fakeNewsQuiz1'
  },
  
  // 16. Quiz 2 - Audio-visual synchronization
  { 
    id: 'fn_quiz_2', 
    title: "가짜뉴스 퀴즈", 
    type: 'quiz', 
    quizId: 'fakeNewsQuiz2'
  },
  
  // 17. Module conclusion
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
    videoUrl: "https://d3srmxrzq4dz1v.cloudfront.net/video-url/identitytheft_case1.m4v" 
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
    title: "사례 2:주식 종목을 추천 영상", 
    type: 'video_case_study', 
    videoUrl: "https://d3srmxrzq4dz1v.cloudfront.net/video-url/identitytheft-case2.m4v" 
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
    audioUrl: "https://d3srmxrzq4dz1v.cloudfront.net/video-url/voice1.mp3",
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
    audioUrl: "https://d3srmxrzq4dz1v.cloudfront.net/video-url/voice2.mp3",
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
          <p><strong>1. 가족 암호:</strong> 걸려온 전화의 경우 가족간의 암호를 물어봄으로써 상대방이 가족이 맞는지 확인하기</p>
          <p><strong>2. 온라인 사진 주의:</strong> 온라인에 사진 올리지 말기 (가족들 포함해서)</p>
          <p><strong>3. 연락처 저장:</strong> 가족을 '딸, 아들'이라고 저장하지 말고 이름으로 저장하기</p>
        </div>
      </div>
    `,
    narrationScript: SCRIPTS.identityTheftDetectionTips
  },
  
  // 16. Quiz 1 - Family verification
  { 
    id: 'it_quiz_1', 
    title: "신원도용 퀴즈", 
    type: 'quiz', 
    quizId: 'identityTheftQuiz1'
  },
  
  // 17. Quiz 2 - Prevention habits
  { 
    id: 'it_quiz_2', 
    title: "신원도용 퀴즈", 
    type: 'quiz', 
    quizId: 'identityTheftQuiz2'
  },
  
  // 18. Module conclusion
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