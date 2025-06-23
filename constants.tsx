import { QuizQuestion, ModuleStep, PersonIdentificationData } from './types.ts';

export const APP_TITLE = "인공지능(AI) 기술";

// Voice IDs
export const NARRATOR_VOICE_ID = "z6Kj0hecH20CdetSElRT"; // Initial narrator voice

export const SCRIPTS = {
  // Initial narrator voice scripts (using voice ID: z6Kj0hecH20CdetSElRT)
  onboardingWelcome: "딥페이크와 딥보이스 기술 체험에 오신 것을 진심으로 환영합니다. 이번 체험을 통해 AI 기술이 어떻게 작동하는지, 그리고 우리가 어떻게 대응해야 하는지 함께 알아보겠습니다.",
  onboardingExplanation: "지금부터 인적사항을 적어주세요. 입력해주시는 사진과 음성으로 여러분의 캐릭터를 만들고, 캐릭터가 AI 기술에 대해 설명을 해줄거에요! 개인정보는 실습을 위해 활용되며, 안전하게 보호됩니다.",
  
  welcome: "안녕하세요! 딥페이크와 딥보이스 기술 체험에 오신 것을 진심으로 환영합니다.",
  caricatureGenerated: "이제 당신만의 특별한 캐릭터가 완성됐어요! 정말 멋지죠?",
  talkingPhotoGenerated: "짜잔! 이제 실제 상황에서 이 기술들이 어떻게 쓰일 수 있는지 살펴볼까요?",
  moduleSelection: "AI 기술로 생길 수 있는 위험 중, 어떤 내용이 더 궁금하신가요? 궁금한 주제를 선택하시면 쉽게 이해하실 수 있도록 알려드립니다.",
  module1Complete: "딥페이크가 가짜뉴스에 어떻게 악용될 수 있는지 알아보았습니다. 수고하셨어요!",
  module2Complete: "딥페이크가 신원도용에 어떻게 악용될 수 있는지 알아보았습니다. 수고하셨어요!",
  allModulesComplete: "정말 축하드려요! 모든 체험을 완료하셨습니다. 오늘의 경험이 앞으로 디지털 세상을 더 안전하게 살아가는 데 도움이 되길 바랍니다.",

  // Scripts for deepfake introduction flow
  deepfakeIntroStart: "요즘 뉴스나 일상 속에서 'AI'라는 말을 자주 들어보셨죠? AI는 '인공지능'이라는 뜻으로, 사람처럼 생각하고 판단할 수 있도록 만든 컴퓨터 기술이에요. AI는 이제 우리 생활 곳곳에 스며들어 있어요. 음식을 추천해주는 앱, 스마트 스피커, 심지어는 목소리나 얼굴을 복원해주는 기술까지! 정말 똑똑하고 신기한 기술이지만, 잘못 사용되면 오히려 우리에게 피해를 줄 수도 있답니다.",
  deepfakeConcept: "먼저 '딥페이크'라는 기술을 소개해드릴게요. 쉽게 말해 인공지능이 사람의 얼굴을 분석해서 마치 다른 사람처럼 보이도록 얼굴을 바꾸는 기술이에요. 예를 들어, 제가 말한 적도 없는 내용을 마치 실제로 말한 것처럼 영상을 만들어낼 수 있는 거죠. 그래서 진짜와 가짜를 구분하기 어려울 정도로 정교하게 만들어져요.",
  deepvoiceConcept: "목소리를 흉내내는 기술도 있어요. '딥보이스'라고 부르는데요. 짧은 목소리 샘플만 있으면, AI가 그 사람의 목소리를 흉내 낼 수 있어요. 예를 들어, 제가 '안녕하세요' 한 마디만 녹음해도 AI는 제 목소리로 '나는 지금 해외에 있어.' 같은 말을 만들어낼 수 있어요.",
  deepfakeVideoIntro: "그러면 딥페이크, 딥보이스가 어떻게 만들어지는지 짧은 영상을 통해 함께 알아볼게요.",
  genAIConcept: "그런데 요즘은 단순히 얼굴과 목소리를 바꾸는 걸 넘어서, '영상을 만들어내는 AI'도 등장했어요. 실제로 존재하지 않는 사람의 얼굴 목소리, 심지어 말투와 감정 표현까지 AI가 만들어내는 거죠.",
  deepfakeWrapup: "딥페이크 기술이 정말 다양하고 빠르게 발전하고 있어요. 얼굴, 목소리뿐 아니라, 사람처럼 보이는 가짜 인물까지 만들어낼 수 있다는 것만 기억해 주세요.",
  deepfakeQuizIntro: "그럼 이제 사례 영상 몇 개를 보여드릴 텐데요, 이 중 어떤 게 진짜이고 어떤 게 AI가 만든 영상일지 맞춰보세요. 눈, 입의 움직임, 목소리 톤 등을 자세히 살펴보면 어딘가 어색한 부분이 있을 수도 있어요.",
  deepfakeQuiz1: "지금 보신 영상은 딥페이크 영상이었습니다. 놀랍게도 앞에 있는 앵커 조차 존재하지 않는 AI가 만든 얼굴이에요. 표정도 자연스럽고, 말투도 어색하지 않아서 진짜처럼 느끼셨죠? AI 기술이 이 정도로 정교해졌습니다. 그럼 다음 영상을 봐볼까요?",
  deepfakeQuiz2: "이번 영상도 딥페이크 영상이었습니다! 놀랍지 않으신가요? 목소리나 표정까지 잘 만들어내서 여행 유튜버로 속을 뻔 했어요!",
  deepfakeQuizComplete: "이제 딥페이크와 딥보이스 같은 기술이 어떻게 가짜 뉴스에 활용되거나, 혹은 사람의 신원을 도용하는 데까지 쓰일 수 있는지 알아볼게요.",

  // Module 1 (Fake News) - Updated detailed flow
  fakeNewsDef: "최근 인터넷이나 스마트폰 등 온라인 공간에서 사실과 거짓이 뒤섞인 정보들이 빠르게 퍼지고 있고, 연예인 사망설, 정치 관련 음모론 같은 가짜 뉴스가 곳곳에서 사회적 혼란을 일으키고 있어요.",
  fakeNewsIntroDetailed: "언론보도처럼 보이지만 실제로는 거짓인 내용을 '가짜뉴스'라고 해요. 연예인이 체포됐다는 보도나, 출국이 금지됐다는 루머가 돌면 당사자의 명예가 크게 훼손될 수 있겠죠? 요즘은 AI 기술이 발전하면서 영상과 음성까지 조작된 가짜 뉴스도 아주 쉽게 만들어집니다.",
  fakeNewsCase1: "이제 딥페이크가 어떻게 가짜 뉴스에 쓰이고, 악용될 수 있는지 다음 영상을 통해 함께 확인해볼게요.",
  fakeNewsCase1WrapUp: "어떤가요? 만약 뉴스 속 나오는 인물들이 본인이 AI라고 하지 않았다면 사람들이 속지 않았을까요? 만약 AI로 만든 영상인 걸 밝히지 않는다면 어떨까요? 다음 사례를 같이 볼게요.",
  fakeNewsCase2: "\"젤렌스키 대통령이 트럼프 대통령을 주먹으로 때리는\" 장면인데요, 정말 있었던 일일까요? 영상으로 함께 확인해볼게요. 어떤 점이 진짜 같고 어떤 점이 어색한지 생각해보세요.",
  fakeNewsCase2WrapUp: "지금 보신 영상, 깜짝 놀라셨죠? 하지만 이 장면은 실제로는 없었던 일이랍니다. 영상에서 젤렌스키 대통령이 팔을 휘두를 때, 자연스럽게 이어지지 않고 동작이 툭 끊긴 것처럼 느껴지지 않으셨나요? 혹은 팔이 부자연스럽게 흔들리거나, 움직임에 비해 얼굴이나 몸의 반응이 늦게 따라오는 것처럼 보일 수도 있어요. 이런 건 AI가 만든 딥페이크 영상에서 자주 나타나는 특징이에요.",
  fakeNewsExperienceIntro: "이제 직접 딥페이크 기술로 가짜 뉴스를 만들어보는 실습을 해볼 거예요. 만약 내 얼굴이나 목소리가 뉴스에 등장한다면 어떤 기분일지 상상해보세요.",
  fakeNewsScene1: "이제는 여러분이 주인공인 딥페이크 뉴스 체험을 해보실 거예요. '내가 로또 1등에 당첨돼서 인터뷰하는 상황'이라고 상상해보세요.",
  fakeNewsScenario1Audio: "1등 당첨돼서 정말 기뻐요! 감사합니다!",
  fakeNewsScene1WrapUp: "방금 들으신 목소리, 직접 녹음한 것도 아닌데 내 얼굴과 비슷한 사람이 내 목소리로 말하고 있다면 신기하면서도 좀 이상한 느낌 들지 않으셨나요? 이처럼 누군가가 재미 삼아 만든 영상은 웃고 넘길 수 있을지도 몰라요.",
  fakeNewsScenario1to2: "이런 기사가 주변에 퍼진다면 재미로 넘길 수도 있지만, 만약 누군가를 곤란하게 만드는 가짜 뉴스가 만들어진다면 어떨까요? 내가 하지도 않은 일을 했다고 뉴스에 나오는 장면을 상상해보세요.",
  fakeNewsScenario2Audio: "제가 한 거 아니에요... 찍지 마세요. 죄송합니다…",
  fakeNewsWrapUp: "이런 영상이 내 얼굴과 목소리로 만들어져 퍼진다면, 상상만 해도 너무 억울하고 당황스러울 것 같지 않으신가요? 이처럼 딥페이크와 생성형 AI 기술이 잘못된 정보와 결합되면,사람을 쉽게 범죄자나 피해자처럼 보이게 만들 수도 있어요.",
  fakeNewsDetectionIntro: "정말 그럴듯하죠? 그렇다면 이런 가짜 뉴스에 속지 않으려면 어떻게 해야 할까요?",
  fakeNewsDetectionTips: "이런 가짜 영상들은 구분해내기 쉽지 않아요. 그래도 누가 영상이나 뉴스를 보내줬다고 해서, 무조건 믿으면 안 돼요. 누가 만들었는지, 공식 계정에 올라온 건지 꼭 출처를 확인하는 습관이 필요해요.",
  fakeNewsDetectionTips2: "딥페이크 영상은 이제 너무 정교해져서 얼굴 움직임이나 입모양만으로는 구별하기 어렵게 되었어요. 그래도 몇 가지 포인트를 살펴보면 가짜일 가능성을 의심해볼 수 있어요. 먼저, 얼굴 전체를 자세히 봐주세요. 비율이 조금 이상하거나 표정이 어색하게 반복되면 딥페이크일 수 있어요. 눈 깜빡임도 중요한 단서예요. 너무 자주 깜빡이거나 거의 깜빡이지 않으면 의심해보는 게 좋아요. 그리고 입 모양과 소리가 잘 맞는지도 확인해보세요. 립싱크처럼 말과 입이 어긋난다면 가짜일 수 있어요. 마지막으로, 피부 표현을 관찰해보세요. 피부가 너무 매끄럽거나, 주름이 거의 없다면 AI가 만든 영상일 가능성이 있습니다. 그리고 아직은 딥페이크 영상이 글씨를 자연스럽게 만들지 못하는 경우가 많아요. 화면 속 간판이나 자막의 글자가 이상하게 보인다면 꼭 한 번 더 의심해보세요.",
  fakeNewsQuizIntro: "지금까지 가짜 뉴스 사례, 그리고 실제로 내 얼굴과 목소리가 사용될 수 있는 상황까지 경험해보셨죠? 이제 배운 내용을 바탕으로 간단한 퀴즈를 풀어보며, 얼마나 잘 이해하셨는지 확인해볼 시간이에요. 천천히 생각해보고 정답을 골라보세요!",
  fakeNewsModuleEnd: "딥페이크로 만들어진 가짜뉴스의 놀라움과 위험성, 그리고 우리가 가져야 할 경각심에 대해 조금 더 이해가 되셨길 바랍니다.",

 
  // Module 2 (Identity Theft) - Updated detailed flow
  identityTheftIntro: "신원 도용이란 누군가가 다른 사람의 개인정보를 허가 없이 가져가서 자신의 이익을 위해 사용하는 것을 의미해요. 그런데 요즘은 이름이나 주민번호뿐 아니라, 얼굴이나 목소리까지 도용될 수 있어서 더 위험해졌어요. 딥페이크가 신원도용에 어떻게 악용될 수 있을까요?",
  identityTheftDef: "딥페이크와 생성형 AI를 활용해 여권이나 운전면허증 같은 가짜 신분증을 만들고, 그걸로 계좌 개설, 불법 거래, 생체 인증 우회까지 가능한 신원 도용 사기가 2025년에 300% 이상 급증하고 있어요.",
  identityTheftCase1Intro: "딥페이크는 투자 사기뿐만 아니라, 로맨스 스캠 같은 범죄에도 적극 활용되고 있어요. 다음 영상에서 딥페이크가 어떤 식으로 사용되는지 함께 살펴볼게요.",
  identityTheftCase1WrapUp: "보셨듯이, 딥페이크 기술은 실시간 영상통화나 유튜브 방송처럼 위장해 사람을 속이기도 해요. 특히 연예인을 사칭해서 투자 정보를 흘리는 영상이 많아지고 있어서, 더더욱 주의가 필요합니다.",
  identityTheftCase2: "이번엔 유명 연예인인 송혜교와 정우성이 특정 주식을 추천하는 영상을 보여드릴게요. 얼마나 자연스럽게 만들어졌는지 함께 확인해보세요.",
  identityTheftCase2WrapUp: "꽤 그럴듯하지 않았나요? 딥페이크 기술에 대해 모른다면, 진짜라고 믿고 속을 수도 있을 만큼 정교하게 만들어졌어요. 특히 목소리까지 거의 완벽하게 흉내 낸 점, 인상 깊으셨죠?",
  identityTheftExperienceIntro: "이번에는 딥페이크 기술이 실제 일상에서 어떻게 사기로 악용될 수 있는지 살펴보려고 해요. 단순히 설명만 듣는 것보다, 실제로 벌어질 수 있는 상황을 함께 들어보면 더 생생하게 이해하실 수 있을 거예요.",
  identityTheftScenario1Intro: "먼저 소개해드릴 상황은, 내 목소리가 조작되어 투자 사기에 쓰이는 장면이에요. 직접 말한 적도 없는데, AI가 내 목소리를 흉내 내어 지인에게 링크를 보내는 식으로 악용되는 경우입니다. ",
  identityTheftScenario1Audio: "요즘 투자 정보 하나 알아낸 게 있는데, 친구들 다 2~3배씩 수익 났다고 하더라. 내가 링크 하나 보낼 테니까 한번 들어가서 확인해봐.",
  identityTheftVoiceModulation: "이런 기술은 단순히 녹음된 목소리를 재생하는 게 아니라, 내가 말하지 않아도 AI가 실시간으로 내 목소리를 흉내 내서 전화를 걸 수 있어요. 마치 내가 직접 말하는 것처럼 자연스럽게 들리기 때문에, 상대방은 진짜 내가 말하고 있다고 믿기 쉬운 거죠. 신기해 보일 수도 있지만, 실제로 이런 방식으로 가족이나 지인을 속이는 사기가 늘고 있어서 정말 위험하답니다.",
  identityTheftScenario2Intro: "이번엔 또 다른 상황입니다. 가족을 사칭해 사고가 났다고 연락하는 전형적인 보이스피싱 수법이에요. 이런 전화가 오면 당황해서 돈을 보내는 경우가 많다고 해요.",
  identityTheftScenario2Audio: "나 지금 교통사고가 났어. 보험 부르지 말고 그냥 적당히 합의보는 게 좋을 것 같아. 혹시 지금 50만 원만 보내줄 수 있을까?",
  identityTheftWrapUp: "이런 전화를 받으면 당연히 놀랄 수밖에 없어요. 목소리까지 너무 비슷하다 보니, 정말 가족이라고 착각할 수 있는 상황이 되는 거죠. 그래서 '확인하는 습관'이 아주 중요해요.",
  identityTheftDetectionIntro: "딥보이스와 딥페이크처럼 목소리나 얼굴을 흉내 내는 기술은 점점 더 정교해지고 있어요. 이런 기술들이 신원 도용에 악용되는 경우도 많아지는 만큼, 우리가 미리 알고 대비할 수 있는 방법들을 함께 알아볼게요.",
  identityTheftDetectionTips: "먼저 가족끼리는 미리 암호를 정해두는 것이 좋아요. 갑자기 전화가 와서 돈을 요청하거나, 급한 상황이라고 하면 먼저 암호를 물어보는 습관을 가져보세요. 예를 들어, '엄마, 우리 강아지 이름이 뭐게?' 또는 '아빠, 내가 가장 좋아하는 음식이 뭐예요?' 같은 식으로요. 또 온라인에는 가족 사진을 너무 많이 올리지 않는 게 좋고, 휴대폰 연락처에도 '딸' '아들'로 저장하기 보다는 실제 이름으로 저장하는 것이 더 안전해요.",
  identityQuizIntro: "지금까지 신원도용 사례, 목소리가 사용될 수 있는 상황까지 경험해보셨죠? 이제 배운 내용을 바탕으로 간단한 퀴즈를 풀어보며, 얼마나 잘 이해하셨는지 확인해볼 시간이에요. 천천히 생각해보고 정답을 골라보세요!",
  identityTheftModuleEnd: "딥페이크 기술이 신원 도용에 다양하게 활용되고 있는 지금, 우리가 할 수 있는 가장 중요한 일은 경각심을 갖고 정보를 잘 판단하는 거예요. 오늘 배운 내용을 바탕으로, 앞으로는 더 안전하고 똑똑하게 디지털 세상을 살아가시길 바랄게요.",
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
    narrationScript: SCRIPTS.fakeNewsDef,
    requires: ['userCaricature']
  },
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
    narrationScript: SCRIPTS.fakeNewsCase1, // This is the intro for the first case
    requires: ['userCaricature'] 
  },
  // 4. Case 1: Show video (not Zelensky)
  { 
    id: 'fn_case1_video', 
    title: "사례 1", 
    type: 'video_case_study', 
    videoUrl: "https://d3srmxrzq4dz1v.cloudfront.net/video-url/fakenews-3.mov" 
  },
  // 5. Case 1: Wrap up
  { 
    id: 'fn_case1_wrapup', 
    title: "사례 1 정리", 
    type: 'narration', 
    narrationScript: SCRIPTS.fakeNewsCase1WrapUp,
    requires: ['userCaricature']
  },
  // 6. Case 2: Narration (Zelensky)
  { 
    id: 'fn_case2_narration', 
    title: "사례 2 설명", 
    type: 'narration', 
    narrationScript: SCRIPTS.fakeNewsCase2, 
    requires: ['userCaricature']
  },
  // 7. Case 2: Show video (Zelensky)
  { 
    id: 'fn_case2_video', 
    title: "사례 2", 
    type: 'video_case_study', 
    videoUrl: "https://d3srmxrzq4dz1v.cloudfront.net/video-url/part1_case3.mov" 
  },
  // 8. Case 2: Wrap up
  { 
    id: 'fn_case2_wrapup', 
    title: "사례 2 정리", 
    type: 'narration', 
    narrationScript: SCRIPTS.fakeNewsCase2WrapUp,
    requires: ['userCaricature']
  },
  // 9. Experience introduction
  { 
    id: 'fn_experience_intro', 
    title: "실습 소개", 
    type: 'narration', 
    narrationScript: SCRIPTS.fakeNewsExperienceIntro,
    requires: ['userCaricature']
  },
  // 10. Scenario 1: Lottery winner faceswap + talking photo
  { 
    id: 'fn_scenario1', 
    title: "시나리오 1: 복권 당첨", 
    type: 'faceswap_scenario', 
    scenarioType: 'lottery',
    baseImageMale: "https://d3srmxrzq4dz1v.cloudfront.net/video-url/fakenews-case1-male.png", 
    baseImageFemale: "https://d3srmxrzq4dz1v.cloudfront.net/video-url/fakenews-case1-female.png", 
    audioScript: SCRIPTS.fakeNewsScenario1Audio, // "1등 당첨돼서 정말 기뻐요!"
    requires: ['userImage', 'userVoice']
  },
  // 11. Transition to negative scenario
  { 
    id: 'fn_scenario_transition', 
    title: "시나리오 전환", 
    type: 'narration', 
    narrationScript: SCRIPTS.fakeNewsScenario1to2,
    requires: ['userCaricature']
  },
  // 12. Scenario 2: Crime suspect faceswap + talking photo
  { 
    id: 'fn_scenario2', 
    title: "시나리오 2: 범죄 용의자", 
    type: 'faceswap_scenario', 
    scenarioType: 'crime',
    baseImageMale: "https://d3srmxrzq4dz1v.cloudfront.net/video-url/fakenews-case2-male.png", 
    baseImageFemale: "https://d3srmxrzq4dz1v.cloudfront.net/video-url/fakenews-case2-female.png", 
    audioScript: SCRIPTS.fakeNewsScenario2Audio, // "찍지 마세요. 죄송합니다…"
    requires: ['userImage', 'userVoice']
  },
  // 13. Wrap up scenarios
  { 
    id: 'fn_wrap_up', 
    title: "사례 정리", 
    type: 'narration', 
    narrationScript: SCRIPTS.fakeNewsWrapUp,
    requires: ['userCaricature']
  },
  // 14. Detection tips introduction
  { 
    id: 'fn_detection_intro', 
    title: "대응 방안 소개", 
    type: 'narration', 
    narrationScript: SCRIPTS.fakeNewsDetectionIntro,
    requires: ['userCaricature']
  },
  // 15. Detection tips - general advice
  { 
    id: 'fn_detection_general', 
    title: "일반적인 대응 방법", 
    type: 'narration', 
    narrationScript: SCRIPTS.fakeNewsDetectionTips,
    requires: ['userCaricature']
  },
  // 16. Detection tips - specific visual cues with content
  { 
    id: 'fn_detection_tips', 
    title: "딥페이크 분별 방법", 
    type: 'info', 
    content: `
     <div class="space-y-4">
      <h3 class="text-xl font-bold mb-4 text-orange-600">딥페이크 영상 분별 방법</h3>
      <div class="space-y-3">
        <p><strong>1. 얼굴 전체를 자세히 살펴보세요:</strong> 얼굴의 비율이나 표정이 미묘하게 이상하다면 의심해보세요.</p>
        <p><strong>2. 눈 깜빡임을 확인하세요:</strong> 너무 자주 깜빡이거나 거의 깜빡이지 않으면 딥페이크일 수 있어요.</p>
        <p><strong>3. 입모양과 소리의 싱크를 살펴보세요:</strong> 말소리와 입술 움직임이 어긋나거나 립싱크처럼 느껴지면 가짜일 가능성이 있어요.</p>
        <p><strong>4. 피부와 주름을 관찰하세요:</strong> 피부가 너무 매끈하거나 나이에 맞지 않게 어려 보이는 경우 주의하세요.</p>
        <p><strong>5. 글씨도 주의 깊게 보세요:</strong> 간판, 자막 등에 이상한 글씨가 보이면 딥페이크를 의심해보세요.</p>
      </div>
    </div>
    `,
    narrationScript: SCRIPTS.fakeNewsDetectionTips2
  },
  // 17. Quiz intro narration (new step)
  { 
    id: 'fn_quiz_intro', 
    title: "퀴즈 안내", 
    type: 'narration', 
    narrationScript: SCRIPTS.fakeNewsQuizIntro, // Add this to SCRIPTS if not present
    requires: ['userCaricature']
  },
  // 18. Quiz 1 - Deepfake visual detection
  { 
    id: 'fn_quiz_1', 
    title: "가짜뉴스 퀴즈", 
    type: 'quiz', 
    quizId: 'fakeNewsQuiz1'
  },
  // 19. Quiz 2 - Audio-visual synchronization
  { 
    id: 'fn_quiz_2', 
    title: "가짜뉴스 퀴즈", 
    type: 'quiz', 
    quizId: 'fakeNewsQuiz2'
  },
  // 20. Module conclusion
  { 
    id: 'fn_conclusion', 
    title: "모듈 마무리", 
    type: 'narration', 
    narrationScript: SCRIPTS.fakeNewsModuleEnd,
    requires: ['userCaricature']
  }
];

export const IDENTITY_THEFT_MODULE_STEPS: ModuleStep[] = [
  // 1. 신원 도용 개념 설명
  {
    id: 'it_intro',
    title: '신원 도용이란?',
    type: 'narration',
    narrationScript: SCRIPTS.identityTheftIntro,
    requires: ['userCaricature']
  },
  // 2. 신원 도용의 실제 위험성/통계
  {
    id: 'it_def',
    title: '신원 도용의 위험성',
    type: 'narration',
    narrationScript: SCRIPTS.identityTheftDef,
    requires: ['userCaricature']
  },
  // 3. 사례 1: 딥페이크 투자/로맨스 사기 소개
  {
    id: 'it_case1_intro',
    title: '사례 1 소개',
    type: 'narration',
    narrationScript: SCRIPTS.identityTheftCase1Intro,
    requires: ['userCaricature']
  },
  // 4. 사례 1: 영상
  {
    id: 'it_case1_video',
    title: '사례 1: 딥페이크 투자/로맨스 사기',
    type: 'video_case_study',
    videoUrl: 'https://d3srmxrzq4dz1v.cloudfront.net/video-url/identitytheft_case1.mov'
  },
  // 5. 사례 1 wrap-up
  {
    id: 'it_case1_wrapup',
    title: '사례 1 정리',
    type: 'narration',
    narrationScript: SCRIPTS.identityTheftCase1WrapUp,
    requires: ['userCaricature']
  },
  // 6. 사례 2: 연예인 주식 추천 영상 소개
  {
    id: 'it_case2_intro',
    title: '사례 2 소개',
    type: 'narration',
    narrationScript: SCRIPTS.identityTheftCase2,
    requires: ['userCaricature']
  },
  // 7. 사례 2: 영상
  {
    id: 'it_case2_video',
    title: '사례 2: 연예인 주식 추천',
    type: 'video_case_study',
    videoUrl: 'https://d3srmxrzq4dz1v.cloudfront.net/video-url/identitytheft_case1.m4v'
  },
  // 8. 사례 2 wrap-up
  {
    id: 'it_case2_wrapup',
    title: '사례 2 정리',
    type: 'narration',
    narrationScript: SCRIPTS.identityTheftCase2WrapUp,
    requires: ['userCaricature']
  },
  // 9. 체험 소개
  {
    id: 'it_experience_intro',
    title: '실습 소개',
    type: 'narration',
    narrationScript: SCRIPTS.identityTheftExperienceIntro,
    requires: ['userCaricature']
  },
  // 10. 시나리오 1: 투자 사기 음성 소개
  {
    id: 'it_scenario1_intro',
    title: '시나리오 1 소개',
    type: 'narration',
    narrationScript: SCRIPTS.identityTheftScenario1Intro,
    requires: ['userCaricature']
  },
  // 11. 시나리오 1: 투자 사기 음성 체험
  {
    id: 'it_scenario1',
    title: '시나리오 1: 투자 사기 전화',
    type: 'voice_call_scenario',
    scenarioType: 'investment_call',
    callType: 'voice',
    audioScript: SCRIPTS.identityTheftScenario1Audio,
    audioUrl: 'https://d3srmxrzq4dz1v.cloudfront.net/video-url/voice1.mp3',
    requires: ['userVoice']
  },
  // 12. 음성 변조 설명
  {
    id: 'it_voice_modulation',
    title: '음성 변조 설명',
    type: 'narration',
    narrationScript: SCRIPTS.identityTheftVoiceModulation,
    requires: ['userCaricature']
  },
  // 13. 시나리오 2: 사고 긴급 전화 소개
  {
    id: 'it_scenario2_intro',
    title: '시나리오 2 소개',
    type: 'narration',
    narrationScript: SCRIPTS.identityTheftScenario2Intro,
    requires: ['userCaricature']
  },
  // 14. 시나리오 2: 사고 긴급 전화 체험
  {
    id: 'it_scenario2',
    title: '시나리오 2: 사고 긴급 전화',
    type: 'video_call_scenario',
    scenarioType: 'accident_call',
    callType: 'video',
    audioScript: SCRIPTS.identityTheftScenario2Audio,
    audioUrl: 'https://d3srmxrzq4dz1v.cloudfront.net/video-url/voice2.mp3',
    baseImageMale: 'https://example.com/video-call-male.mp4',
    baseImageFemale: 'https://example.com/video-call-female.mp4',
    requires: ['userImage', 'userVoice']
  },
  // 15. wrap-up
  {
    id: 'it_wrap_up',
    title: '사례 정리',
    type: 'narration',
    narrationScript: SCRIPTS.identityTheftWrapUp,
    requires: ['userCaricature']
  },
  // 16. 대응 방안 소개
  {
    id: 'it_detection_intro',
    title: '대응 방안 소개',
    type: 'narration',
    narrationScript: SCRIPTS.identityTheftDetectionIntro,
    requires: ['userCaricature']
  },
  // 17. 대응 방안/팁
  {
    id: 'it_detection_tips',
    title: '신원 도용 방지 팁',
    type: 'info',
    content: `
      <div class="space-y-4">
        <h3 class="text-xl font-bold mb-4 text-orange-600">신원 도용 방지 방법</h3>
        <div class="space-y-3">
          <p><strong>1. 가족 암호:</strong> 걸려온 전화의 경우 가족간의 암호를 물어봄으로써 상대방이 가족이 맞는지 확인하기</p>
          <p><strong>2. 온라인 사진 주의:</strong> 온라인에 사진 올리지 말기 (가족들 포함해서)</p>
          <p><strong>3. 연락처 저장:</strong> 가족을 '딸, 아들'이라고 저장하지 말고 이름으로 저장하기</p>
        </div>
      </div>
    `,
    narrationScript: SCRIPTS.identityTheftDetectionTips
  },
  // 18. 퀴즈 안내
  {
    id: 'it_quiz_intro',
    title: '퀴즈 안내',
    type: 'narration',
    narrationScript: SCRIPTS.identityQuizIntro,
    requires: ['userCaricature']
  },
  // 19. 퀴즈 1
  {
    id: 'it_quiz_1',
    title: '신원도용 퀴즈',
    type: 'quiz',
    quizId: 'identityTheftQuiz1'
  },
  // 20. 퀴즈 2
  {
    id: 'it_quiz_2',
    title: '신원도용 퀴즈',
    type: 'quiz',
    quizId: 'identityTheftQuiz2'
  },
  // 21. 모듈 마무리
  {
    id: 'it_conclusion',
    title: '모듈 마무리',
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
    videoUrl: "https://d3srmxrzq4dz1v.cloudfront.net/video-url/case4.mov",
    explanation: "이 영상은 AI로 생성된 영상일까요? 아니면 진짜 영상일까요?" 
  },
  // { 
  //   id: 'p3', 
  //   name: 'Case 3', 
  //   isFake: true, 
  //   videoUrl: "https://d3srmxrzq4dz1v.cloudfront.net/video-url/case3.mp4",
  //   explanation: "이 영상은 AI로 생성된 영상일까요? 아니면 진짜 영상일까요?" 
  // },
  // { 
  //   id: 'p4', 
  //   name: 'Case 4', 
  //   isFake: true, 
  //   videoUrl: "https://d3srmxrzq4dz1v.cloudfront.net/video-url/case4.mov",
  //   explanation: "이 영상은 AI로 생성된 영상일까요? 아니면 진짜 영상일까요?" 
  // },
];