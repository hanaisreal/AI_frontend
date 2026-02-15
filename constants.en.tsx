import { QuizQuestion, ModuleStep, PersonIdentificationData } from './types.ts';

// Voice IDs
export const NARRATOR_VOICE_ID = "EXAVITQu4vr4xnSDxMaL"; // Sarah - Mature, Reassuring, Confident

export const SCRIPTS = {
  // Initial narrator voice scripts (using voice ID: z6Kj0hecH20CdetSElRT)
  onboardingWelcome: "Welcome to the Deepfake and Deepvoice technology experience. Through this session, we'll learn how AI technology works and how we can protect ourselves from its misuse.",
  onboardingExplanation: "Please fill in your personal information. Using your photo and voice, we'll create your personalized character who will explain deepfake and deepvoice technologies. Your personal information will only be used for this educational experience and will be safely protected.",

  welcome: "Hello! Before we begin, please turn up your speaker volume!",

  // Pre-generation explanations
  caricatureGenerationStart: "Now, we'll create a character that looks like you based on your photo. AI will analyze your facial features and transform them into a cute character. Please wait a moment!",
  talkingPhotoGenerationStart: "Let's bring your completed character to life. Using your voice, we'll make the character actually speak. Isn't that amazing? Please wait a moment!",

  caricatureGenerated: "Your special character is now complete! Doesn't it look great?",
  talkingPhotoGenerated: "Ta-da! Now let me explain how deepfake and deepvoice technologies can be used in real situations.",
  moduleSelection: "Among the risks that can arise from AI technology, which topic are you more curious about? Select a topic and I'll explain it in an easy-to-understand way.",
  module1Complete: "We've learned how deepfakes can be misused to create fake news. Great job!",
  module2Complete: "We've learned how deepfakes can be misused for identity theft. Great job!",
  allModulesComplete: "Congratulations! You've completed all the experiences. I hope today's experience will help you navigate the digital world more safely in the future.",

  // Scripts for deepfake introduction flow
  deepfakeIntroStart: "You've probably heard the word 'AI' a lot in the news and in daily life, right? AI stands for 'Artificial Intelligence' - computer technology designed to think and make decisions like humans. AI is now woven into many parts of our lives. From apps that recommend food, to smart speakers, to technology that can recreate voices and faces! It's truly amazing technology, but if misused, it can also cause harm.",
  deepfakeConcept: "Let me introduce you to a technology called 'Deepfake.' Simply put, it's a technology where AI analyzes a person's face and replaces it to look like someone else. For example, it can create videos of me saying things I never actually said. These are made so precisely that it's difficult to tell what's real from what's fake.",
  deepvoiceConcept: "There's also technology that mimics voices. It's called 'Deepvoice.' With just a short voice sample, AI can imitate that person's voice. For example, if I just record 'Hello,' AI can create speech in my voice saying 'I'm currently abroad.'",
  deepfakeVideoIntro: "Let's watch a short video to learn how deepfakes and deepvoices are created.",
  genAIConcept: "Nowadays, it goes beyond just changing faces and voices - 'generative AI' that creates entire videos has emerged. It can create faces of people who don't actually exist, their voices, and even their expressions and emotional reactions.",
  deepfakeWrapup: "Deepfake technology is developing rapidly in many directions. Just remember that it can now create not only faces and voices but also fake people who look completely real.",
  deepfakeQuizIntro: "Now I'll show you some example videos. Try to guess which ones are real and which ones are AI-generated deepfakes. Look closely at eye movements, mouth movements, and voice tone - there might be something that seems off.",
  deepfakeQuiz1: "The video you just watched was a deepfake. Surprisingly, even the anchor in front doesn't exist - it's a face created by AI. The expressions were natural and the speech wasn't awkward, so it felt real, didn't it? AI technology has become this sophisticated. Let's watch the next video.",
  deepfakeQuiz2: "This video was also a deepfake! Isn't that surprising? The voice and expressions were so well made that we almost thought it was a real travel YouTuber!",
  deepfakeQuizComplete: "Now let's learn how technologies like deepfake and deepvoice can be used for fake news or even identity theft.",

  // Module 1 (Fake News) - Updated detailed flow
  fakeNewsDef: "Recently, information mixing truth and falsehood has been spreading rapidly in online spaces like the internet and smartphones. Fake news like celebrity death rumors and political conspiracy theories are causing social confusion everywhere.",
  fakeNewsIntroDetailed: "Content that looks like news reports but is actually false is called 'fake news.' Imagine if there were reports that a celebrity was arrested or banned from leaving the country - it could seriously damage that person's reputation, right? These days, with advancing AI technology, fake news with manipulated video and audio is being created very easily.",
  fakeNewsCase1: "Now let's watch a video together to see how deepfakes are used in fake news and how they can be misused.",
  fakeNewsCase1WrapUp: "What do you think? If the people in the news hadn't said they were AI, wouldn't people have been fooled? What if they hadn't revealed that it was made by AI? Let's look at the next example.",
  fakeNewsCase2: "This is a scene of 'President Zelensky punching President Trump' - did this really happen? Let's watch the video together. Think about what looks real and what seems awkward.",
  fakeNewsCase2WrapUp: "Were you surprised by that video? But this scene never actually happened. Didn't you notice how President Zelensky's arm movement seemed to cut off unnaturally? Or perhaps the arm movement seemed unnatural, or the face and body reactions seemed to lag behind the movements? These are common characteristics found in AI-generated deepfake videos.",
  fakeNewsExperienceIntro: "Now we're going to do a hands-on exercise creating fake news with deepfake technology. Imagine how you would feel if your face or voice appeared in the news.",
  fakeNewsScene1: "Now you'll experience being the star of a deepfake news story. Imagine a situation where 'you won the lottery jackpot and are being interviewed.'",
  fakeNewsScenario1Audio: "I'm so happy I won the jackpot! Thank you!",
  fakeNewsScene1WrapUp: "That voice you just heard - you didn't record it yourself, but someone who looks like you is speaking in your voice. Doesn't it feel both fascinating and a bit strange? Videos like this made for fun might be easy to laugh off.",
  fakeNewsScenario1to2: "Such articles spreading around might be laughed off as just jokes, but what if fake news was created to embarrass someone? Imagine a scene where you appear in the news for something you never did.",
  fakeNewsScenario2Audio: "I didn't do it... Please stop filming. I'm sorry...",
  fakeNewsWrapUp: "If such a video was created with your face and voice and spread around, wouldn't it feel extremely unfair and shocking? This is how deepfake and generative AI technology combined with false information can easily make someone look like a criminal or victim.",
  fakeNewsDetectionIntro: "Pretty convincing, right? So how can we avoid being fooled by such fake news?",
  fakeNewsDetectionTips: "It's not easy to distinguish these fake videos. But just because someone sends you a video or news doesn't mean you should believe it unconditionally. You need to develop the habit of checking the source - who made it, and whether it was posted on an official account.",
  fakeNewsDetectionTips2: "Deepfake videos have become so sophisticated that it's hard to tell them apart just by facial movements or lip movements. But there are still some points you can look for. First, look closely at the whole face. If the proportions seem slightly off or expressions repeat awkwardly, it might be a deepfake. Eye blinking is also an important clue. Be suspicious if blinking is too frequent or almost nonexistent. Also check if the lip movements match the sound. If the words and lips don't sync like bad lip-syncing, it could be fake. Finally, observe the skin. If the skin is too smooth or has almost no wrinkles, it might be an AI-generated video. Also, deepfake videos often can't create text naturally yet. If signs or subtitles in the screen look strange, definitely be suspicious.",
  fakeNewsRevisitVideoIntro: "Now I'll show you the deepfake video we saw earlier again. Look closely at the text on the anchor's microphone.",
  fakeNewsRevisitVideo1: "Can you see the Korean text isn't quite right? By looking closely at text, you can tell if it's fake news. Now let's watch the next video, focusing on the voice and expressions.",
  fakeNewsRevisitVideo2: "This one is harder to distinguish, isn't it? But if you focus on the voice, you can hear something awkward. As deepfake videos become more sophisticated, it's important to know that such videos exist.",
  fakeNewsQuizIntro: "You've now experienced fake news cases and even situations where your own face and voice could be used. Now let's test your understanding with some simple quizzes based on what you've learned. Take your time and choose your answers!",
  fakeNewsModuleEnd: "I hope you now better understand the surprise and danger of deepfake-created fake news, and the awareness we need to have.",


  // Module 2 (Identity Theft) - Updated detailed flow
  identityTheftIntro: "Identity theft means someone takes another person's personal information without permission and uses it for their own benefit. But nowadays, not just names or ID numbers, but even faces and voices can be stolen, making it even more dangerous. How can deepfakes be misused for identity theft?",
  identityTheftDef: "Identity theft scams using deepfake and generative AI to create fake IDs like passports or driver's licenses, and using them for opening accounts, illegal transactions, and even bypassing biometric authentication, have increased by over 300% in 2025.",
  identityTheftCase1Intro: "Deepfakes are actively being used not only for investment scams but also for crimes like romance scams. Let's look at the next video to see how deepfakes are used in romance scams.",
  identityTheftCase1WrapUp: "As you saw, deepfake technology is also used to deceive people by disguising as real-time video calls or YouTube broadcasts. Particularly, videos impersonating celebrities to leak investment information are increasing, so extra caution is needed.",
  identityTheftCase2: "Now I'll show you a video where famous celebrities Song Hye-kyo and Jo In-sung recommend specific stocks. Let's see how naturally it's made.",
  identityTheftCase2WrapUp: "Quite convincing, wasn't it? If you didn't know about deepfake technology, you might have believed it was real. It was sophisticated enough to fool people. The voice mimicking was particularly impressive, wasn't it?",
  identityTheftExperienceIntro: "Now we're going to look at how deepfake technology can be misused as scams in everyday life. Rather than just explaining, hearing situations that could actually happen will help you understand more vividly.",
  identityTheftScenario1Intro: "The first situation I'll introduce is where your voice is manipulated and used in an investment scam. Even though you never said these words yourself, AI mimics your voice to deceive your acquaintances.",
  identityTheftScenario1Audio: "I found out about an investment opportunity. Keep this between us. My friends are all seeing 2-3x returns. I'll send you a link, check it out.",
  identityTheftVoiceModulation: "This technology doesn't just play a recorded voice - AI can mimic your voice in real-time to make phone calls. It sounds so natural as if you're actually speaking, so the other person easily believes it's really you. It might seem fascinating, but scams deceiving family and friends this way are actually increasing, making it very dangerous.",
  identityTheftScenario2Intro: "Here's another situation. This is a typical voice phishing technique where someone impersonates a family member saying there's been an accident. Many people panic and send money when they receive such calls.",
  identityTheftScenario2Audio: "Something terrible happened... I just got into a car accident in front of my house. I think it's better to settle without calling insurance. Can you send me $500 right now? It's urgent.",
  identityTheftWrapUp: "If you received such a call, you'd naturally be shocked. The voice is so similar that you might really think it's your family member. That's why having a habit of 'verifying' is very important.",
  identityTheftDetectionIntro: "Technologies that mimic voices and faces like deepvoice and deepfake are becoming increasingly sophisticated. As these technologies are being misused for identity theft, let's learn together about ways we can prepare in advance.",
  identityTheftDetectionTips: "First, it's good for families to set up a secret password in advance. When you receive a sudden call asking for money or claiming it's urgent, make a habit of asking for the password first. For example, 'Mom, what's our dog's name?' or 'Dad, what's my favorite food?' Also, it's better not to post too many family photos online, and instead of saving contacts as 'Daughter' or 'Son,' it's safer to save them with actual names.",
  identityQuizIntro: "You've now experienced identity theft cases and situations where your voice could be used. Now let's test your understanding with some simple quizzes based on what you've learned. Take your time and choose your answers!",
  identityTheftModuleEnd: "Now that deepfake technology is being used in various ways for identity theft, the most important thing we can do is stay alert and judge information carefully. Based on what you've learned today, I hope you'll navigate the digital world more safely and smartly.",
};

export const QUIZZES: { [key: string]: QuizQuestion[] } = {
  fakeNewsQuiz1: [
    {
      id: 'fnq1',
      question: "How does deepfake technology create fake videos?",
      options: [
        "By directly filming people",
        "By AI replacing faces",
        "By editing movies",
        "By copying actual news broadcasts"
      ],
      correctAnswer: "By AI replacing faces",
      explanation: "Deepfake uses artificial intelligence technology to replace faces with other people's faces, creating fake videos."
    },
  ],
  fakeNewsQuiz2: [
    {
      id: 'fnq2',
      question: "How can we avoid being fooled by fake news?",
      options: [
        "Only check who sent it",
        "Judge by the title alone",
        "Always verify the source",
        "Trust it if the video looks good"
      ],
      correctAnswer: "Always verify the source",
      explanation: "To avoid being fooled by fake news, you should always verify the source - who made it and whether it came from a trustworthy organization."
    }
  ],
  identityTheftQuiz1: [
    {
      id: 'itq2',
      question: "Why is deepvoice technology dangerous?",
      options: [
        "It makes sounds quieter",
        "It can mimic people's voices",
        "It slows down the internet",
        "It can create music"
      ],
      correctAnswer: "It can mimic people's voices",
      explanation: "Deepvoice can mimic real people's voices, which can be misused to impersonate family members or bank employees."
    }
  ],
  identityTheftQuiz2: [
    {
      id: 'itq2',
      question: "What is a good habit to prevent identity theft?",
      options: [
        "Save contacts as 'Daughter', 'Son'",
        "Frequently post family photos on social media",
        "Save contacts by name and limit photo sharing",
        "Use phone without a password"
      ],
      correctAnswer: "Save contacts by name and limit photo sharing",
      explanation: "Saving contacts by names instead of relationships and not posting family photos online helps prevent identity theft."
    }
  ]
};

// NOTE: CASE_STUDIES removed - all content now uses direct step definitions and real-time AI generation

export const FAKE_NEWS_MODULE_STEPS: ModuleStep[] = [
  // 1. Narrator explains fake news concept
  {
    id: 'fn_intro',
    title: "The Spread of Fake News",
    type: 'narration',
    narrationScript: SCRIPTS.fakeNewsDef,
    requires: ['userCaricature']
  },
  {
    id: 'fn_intro_detailed',
    title: "What is Fake News?",
    type: 'narration',
    narrationScript: SCRIPTS.fakeNewsIntroDetailed,
    requires: ['userCaricature']
  },
  // 2. Narrator introduces case studies
  {
    id: 'fn_case_intro',
    title: "Learning About Deepfake News Cases",
    type: 'narration',
    narrationScript: SCRIPTS.fakeNewsCase1, // This is the intro for the first case
    requires: ['userCaricature']
  },
  // 4. Case 1: Show video (not Zelensky)
  {
    id: 'fn_case1_video',
    title: "Case 1: AI Anchor Deepfake News",
    type: 'video_case_study',
    videoUrl: "https://d3srmxrzq4dz1v.cloudfront.net/video-url/fakenews-3.mov"
  },
  // 5. Case 1: Wrap up
  {
    id: 'fn_case1_wrapup',
    title: "Did You Spot the Fake AI Anchor?",
    type: 'narration',
    narrationScript: SCRIPTS.fakeNewsCase1WrapUp,
    requires: ['userCaricature']
  },
  // 6. Case 2: Narration (Zelensky)
  {
    id: 'fn_case2_narration',
    title: "Political Deepfake Video Case",
    type: 'narration',
    narrationScript: SCRIPTS.fakeNewsCase2,
    requires: ['userCaricature']
  },
  // 7. Case 2: Show video (Zelensky)
  {
    id: 'fn_case2_video',
    title: "Case 2: Zelensky Fake Video",
    type: 'video_case_study',
    videoUrl: "https://d3srmxrzq4dz1v.cloudfront.net/video-url/part1_case3.mov"
  },
  // 8. Case 2: Wrap up
  {
    id: 'fn_case2_wrapup',
    title: "Finding Deepfake Video Characteristics",
    type: 'narration',
    narrationScript: SCRIPTS.fakeNewsCase2WrapUp,
    requires: ['userCaricature']
  },
  // 9. Experience introduction
  {
    id: 'fn_experience_intro',
    title: "Creating My Own Deepfake Video",
    type: 'narration',
    narrationScript: SCRIPTS.fakeNewsExperienceIntro,
    requires: ['userCaricature']
  },
  // 10. Scenario 1: Lottery winner faceswap + talking photo
  {
    id: 'fn_scenario1',
    title: "What If I Won the Lottery?",
    type: 'faceswap_scenario',
    scenarioType: 'lottery',
    baseImageMale: "https://d3srmxrzq4dz1v.cloudfront.net/video-url/fakenews-case1-male.png",
    baseImageFemale: "https://d3srmxrzq4dz1v.cloudfront.net/video-url/fakenews-case1-female.png",
    audioScript: SCRIPTS.fakeNewsScenario1Audio, // "I'm so happy I won!"
    requires: ['userImage', 'userVoice']
  },
  // 11. Transition to negative scenario
  {
    id: 'fn_scenario_transition',
    title: "Misused Fake News",
    type: 'narration',
    narrationScript: SCRIPTS.fakeNewsScenario1to2,
    requires: ['userCaricature']
  },
  // 12. Scenario 2: Crime suspect faceswap + talking photo
  {
    id: 'fn_scenario2',
    title: "What If I'm Accused as a Suspect?",
    type: 'faceswap_scenario',
    scenarioType: 'crime',
    baseImageMale: "https://d3srmxrzq4dz1v.cloudfront.net/video-url/fakenews-case2-male.png",
    baseImageFemale: "https://d3srmxrzq4dz1v.cloudfront.net/video-url/fakenews-case2-female.png",
    audioScript: SCRIPTS.fakeNewsScenario2Audio, // "Please stop filming. I'm sorry..."
    requires: ['userImage', 'userVoice']
  },
  // 13. Wrap up scenarios
  {
    id: 'fn_wrap_up',
    title: "Realizing the Dangers of Deepfake",
    type: 'narration',
    narrationScript: SCRIPTS.fakeNewsWrapUp,
    requires: ['userCaricature']
  },
  // 14. Detection tips introduction
  {
    id: 'fn_detection_intro',
    title: "How to Avoid Being Fooled by Fake News?",
    type: 'narration',
    narrationScript: SCRIPTS.fakeNewsDetectionIntro,
    requires: ['userCaricature']
  },
  // 15. Detection tips - general advice
  {
    id: 'fn_detection_general',
    title: "The Importance of Verifying Sources",
    type: 'narration',
    narrationScript: SCRIPTS.fakeNewsDetectionTips,
    requires: ['userCaricature']
  },
  // 16. Detection tips - specific visual cues with content
  {
    id: 'fn_detection_tips',
    title: "How to Identify Deepfake Videos",
    type: 'info',
    content: `
     <div class="space-y-4">
      <h3 class="text-xl font-bold mb-4 text-orange-600">How to Identify Deepfake Videos</h3>
      <div class="space-y-3">
        <p><strong>1. Look closely at the whole face:</strong> Be suspicious if facial proportions or expressions seem slightly off.</p>
        <p><strong>2. Check eye blinking:</strong> Be suspicious if blinking is too frequent or almost nonexistent.</p>
        <p><strong>3. Check lip-sync:</strong> If words and lip movements don't match or seem like bad lip-syncing, it could be fake.</p>
        <p><strong>4. Observe the skin:</strong> Be cautious if the skin is too smooth or doesn't match the person's age.</p>
        <p><strong>5. Look at text carefully:</strong> If signs or subtitles show strange text, suspect deepfake.</p>
      </div>
    </div>
    `,
    narrationScript: SCRIPTS.fakeNewsDetectionTips2
  },
  // 17. Quiz intro narration (new step)
  {
    id: 'fn_quiz_intro',
    title: "Testing What You've Learned",
    type: 'narration',
    narrationScript: SCRIPTS.fakeNewsQuizIntro, // Add this to SCRIPTS if not present
    requires: ['userCaricature']
  },
  // 18. Quiz 1 - Deepfake visual detection
  {
    id: 'fn_quiz_1',
    title: "Understanding Deepfake Technology",
    type: 'quiz',
    quizId: 'fakeNewsQuiz1'
  },
  // 19. Quiz 2 - Audio-visual synchronization
  {
    id: 'fn_quiz_2',
    title: "Responding to Fake News",
    type: 'quiz',
    quizId: 'fakeNewsQuiz2'
  },
  // 20. Module conclusion
  {
    id: 'fn_conclusion',
    title: "Fake News Module Complete",
    type: 'narration',
    narrationScript: SCRIPTS.fakeNewsModuleEnd,
    requires: ['userCaricature']
  }
];

export const IDENTITY_THEFT_MODULE_STEPS: ModuleStep[] = [
  // 1. Identity theft concept explanation
  {
    id: 'it_intro',
    title: 'What is Identity Theft?',
    type: 'narration',
    narrationScript: SCRIPTS.identityTheftIntro,
    requires: ['userCaricature']
  },
  // 2. Real dangers/statistics of identity theft
  {
    id: 'it_def',
    title: 'Rising Identity Theft Due to Deepfakes',
    type: 'narration',
    narrationScript: SCRIPTS.identityTheftDef,
    requires: ['userCaricature']
  },
  // 3. Case 1: Deepfake investment/romance scam introduction
  {
    id: 'it_case1_intro',
    title: 'Romance Scam Deepfake Case',
    type: 'narration',
    narrationScript: SCRIPTS.identityTheftCase1Intro,
    requires: ['userCaricature']
  },
  // 4. Case 1: Video
  {
    id: 'it_case1_video',
    title: 'Case 1: Deepfake Romance Scam',
    type: 'video_case_study',
    videoUrl: 'https://d3srmxrzq4dz1v.cloudfront.net/video-url/identitytheft_case1.mov'
  },
  // 5. Case 1 wrap-up
  {
    id: 'it_case1_wrapup',
    title: 'The Dangers of Real-time Deepfakes',
    type: 'narration',
    narrationScript: SCRIPTS.identityTheftCase1WrapUp,
    requires: ['userCaricature']
  },
  // 6. Case 2: Celebrity stock recommendation video introduction
  {
    id: 'it_case2_intro',
    title: 'Celebrity Deepfake Investment Scam',
    type: 'narration',
    narrationScript: SCRIPTS.identityTheftCase2,
    requires: ['userCaricature']
  },
  // 7. Case 2: Video
  {
    id: 'it_case2_video',
    title: 'Case 2: Celebrity Stock Recommendation',
    type: 'video_case_study',
    videoUrl: 'https://d3srmxrzq4dz1v.cloudfront.net/video-url/identitytheft_case1.m4v'
  },
  // 8. Case 2 wrap-up
  {
    id: 'it_case2_wrapup',
    title: 'Sophistication of Celebrity Impersonation',
    type: 'narration',
    narrationScript: SCRIPTS.identityTheftCase2WrapUp,
    requires: ['userCaricature']
  },
  // 9. Experience introduction
  {
    id: 'it_experience_intro',
    title: 'Getting Scammed with My Voice',
    type: 'narration',
    narrationScript: SCRIPTS.identityTheftExperienceIntro,
    requires: ['userCaricature']
  },
  // 10. Scenario 1: Investment scam voice introduction
  {
    id: 'it_scenario1_intro',
    title: 'Friend Impersonation Investment Scam Call',
    type: 'narration',
    narrationScript: SCRIPTS.identityTheftScenario1Intro,
    requires: ['userCaricature']
  },
  // 11. Scenario 1: Investment scam voice experience
  {
    id: 'it_scenario1',
    title: 'Investment Scam Using My Voice',
    type: 'voice_call_scenario',
    scenarioType: 'investment_call',
    callType: 'voice',
    audioScript: SCRIPTS.identityTheftScenario1Audio,
    audioUrl: 'https://d3srmxrzq4dz1v.cloudfront.net/video-url/voice1.mp3',
    requires: ['userVoice']
  },
  // 12. Voice modulation explanation
  {
    id: 'it_scenario1_voice_modulation',
    title: 'Real-time Voice Modulation Technology',
    type: 'narration',
    narrationScript: SCRIPTS.identityTheftVoiceModulation,
    requires: ['userCaricature']
  },
  // 13. Scenario 2: Emergency accident call introduction
  {
    id: 'it_scenario2_intro',
    title: 'Family Impersonation Emergency Call',
    type: 'narration',
    narrationScript: SCRIPTS.identityTheftScenario2Intro,
    requires: ['userCaricature']
  },
  // 14. Scenario 2: Emergency accident call experience
  {
    id: 'it_scenario2',
    title: 'Deceiving Family with My Voice',
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
    id: 'it_scenario_wrap_up',
    title: 'The Dangers of Voice Scams',
    type: 'narration',
    narrationScript: SCRIPTS.identityTheftWrapUp,
    requires: ['userCaricature']
  },
  // 16. Detection methods introduction
  {
    id: 'it_detection_intro',
    title: 'How to Prevent Identity Theft?',
    type: 'narration',
    narrationScript: SCRIPTS.identityTheftDetectionIntro,
    requires: ['userCaricature']
  },
  // 17. Detection methods/tips
  {
    id: 'it_detection_tips',
    title: '3 Ways to Protect Your Family',
    type: 'info',
    content: `
      <div class="space-y-4">
        <h3 class="text-xl font-bold mb-4 text-orange-600">Identity Theft Prevention Methods</h3>
        <div class="space-y-3">
          <p><strong>1. Family Password:</strong> When receiving calls asking for money, verify identity by asking for a secret family password</p>
          <p><strong>2. Online Photo Caution:</strong> Avoid posting photos online (including family photos)</p>
          <p><strong>3. Contact Storage:</strong> Save contacts by actual names instead of 'Daughter' or 'Son'</p>
        </div>
      </div>
    `,
    narrationScript: SCRIPTS.identityTheftDetectionTips
  },
  // 18. Quiz introduction
  {
    id: 'it_quiz_intro',
    title: 'Testing What You\'ve Learned',
    type: 'narration',
    narrationScript: SCRIPTS.identityQuizIntro,
    requires: ['userCaricature']
  },
  // 19. Quiz 1
  {
    id: 'it_quiz_1',
    title: 'Understanding Deepvoice Technology',
    type: 'quiz',
    quizId: 'identityTheftQuiz1'
  },
  // 20. Quiz 2
  {
    id: 'it_quiz_2',
    title: 'Identity Theft Prevention Methods',
    type: 'quiz',
    quizId: 'identityTheftQuiz2'
  },
  // 21. Module conclusion
  {
    id: 'it_conclusion',
    title: 'Identity Theft Module Complete',
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
    explanation: "Is this video AI-generated? Or is it real?"
  },
  {
    id: 'p2',
    name: 'Case 2',
    isFake: true,
    videoUrl: "https://d3srmxrzq4dz1v.cloudfront.net/video-url/case4.mov",
    explanation: "Is this video AI-generated? Or is it real?"
  },
];

// UI Text translations
export const UI_TEXT = {
  // Landing Page
  landingTitle: "What is Deepfake?",
  startButton: "Get Started",

  // Onboarding Page
  stepTitles: ["Welcome", "Instructions", "Enter Information & Record Voice"],
  enterInfo: "Enter your information",
  pleaseEnterInfo: "Please enter your personal information.",
  nameLabel: "Name",
  ageLabel: "Age",
  genderLabel: "Gender",
  selectGender: "Select...",
  female: "Female",
  male: "Male",
  photoUpload: "Upload Photo",
  submitButton: "Submit",
  submitting: "Submitting...",
  submitConsent: "By clicking submit, you agree to the processing of provided information.",
  pleaseSubmit: "Please click the submit button.",

  // Voice Recording
  voiceRecording: "Voice Recording",
  voiceRecordingInstruction: "Please think about your answers to the following questions and record after clicking the voice recording button. Please record for about 1 minute total.",
  voiceQuestion1: "1. How are you feeling today? Why?",
  voiceQuestion2: "2. What do you usually have for breakfast?",
  voiceQuestion3: "3. What time of day do you feel happiest? Why?",
  voiceQuestion4: "4. What is your favorite season? Why?",
  voiceQuestion5: "5. What do you usually do on weekends?",
  fontSize: "Font size:",

  // File Upload
  imageUpload: "Upload Image",
  changeFile: "Change File",
  uploadFile: "Upload File",
  orDragDrop: "or drag and drop",
  fileTypes: "PNG, JPG, GIF (iPhone photos auto-compressed)",
  preview: "Preview",

  // Module Selection
  fakeNewsModule: "Fake News",
  identityTheftModule: "Identity Theft",

  // Completion Page
  projectComplete: "Project Complete!",
  returnToWelcome: "Return to Welcome Page",

  // Common
  next: "Next",
  previous: "Previous",
  continue: "Continue",
  loading: "Loading...",
  error: "An error occurred. Please try again.",

  // Error messages
  imageCompressionFailed: "Image compression failed, using original",
  imageLoadFailed: "Image load failed, using original",
  imageCompressing: "Image is large. Compressing...",
  imageCompressed: "Image compressed",
  imageSelected: "Image selected",
  imagePreviewGenerated: "Image preview generated",
  imagePreviewFailed: "Image preview failed",
  voiceRecordingComplete: "Voice recording complete",

  // Footer
  footer: "AI Awareness Project. For educational purposes only.",
};
