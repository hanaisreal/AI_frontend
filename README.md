# AI Awareness Project Frontend

A React-based frontend application for educating users about AI awareness, focusing on face and voice manipulation, fake news, and identity theft prevention.

## 🏗️ Project Structure

```
frontend/
├── components/          # Reusable UI components
│   ├── Button.tsx      # Custom button component
│   ├── Card.tsx        # Card layout component
│   ├── FileUpload.tsx  # File upload component
│   ├── LoadingSpinner.tsx
│   ├── NarrationPlayer.tsx
│   ├── PageLayout.tsx
│   ├── PersonaTransitionSlide.tsx
│   ├── QuizComponent.tsx
│   ├── VideoIdentificationQuiz.tsx
│   └── VoiceRecorder.tsx
├── pages/              # Page components
│   ├── BaseModulePage.tsx
│   ├── CaricatureGenerationPage.tsx
│   ├── CompletionPage.tsx
│   ├── FakeNewsModulePage.tsx
│   ├── IdentityTheftModulePage.tsx
│   ├── IntroductionEducationPage.tsx
│   ├── LandingPage.tsx
│   ├── ModuleSelectionPage.tsx
│   ├── TalkingPhotoGenerationPage.tsx
│   └── UserOnboardingPage.tsx
├── services/           # API and external service integrations
├── hooks/             # Custom React hooks
├── types.ts           # TypeScript type definitions
└── constants.tsx      # Application constants and content
```

## 🚀 Application Flow

1. **Landing Page**: Welcomes the user and introduces the project.
2. **User Onboarding**: Collects user name, age, and gender, and records their voice and image. This data is sent to the backend.
3. **Content Generation**: The backend generates a personalized caricature and talking photo, storing the assets in an **S3 bucket**.
4. **Interactive Modules**: The user proceeds through educational modules on Fake News and Identity Theft, which include case studies, personalized scenarios, and quizzes.
5. **Quiz Submission**: User's quiz answers are saved to a **SQLite database** via the backend.
6. **Completion**: The user finishes the modules.

## 🛠️ Technology Stack

- React 18.3.1
- TypeScript & Vite
- Tailwind CSS

The frontend communicates with a Python FastAPI backend which handles:
- **Database**: Storing user info and quiz answers in **SQLite**.
- **File Storage**: Storing generated images and videos in **Amazon S3**.
- **AI Services**: Interacting with APIs like OpenAI, ElevenLabs, and Akool.

## 🚀 Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file with the backend API URL:
   ```
   VITE_API_URL=http://localhost:8000
   ```
   *(Ensure the backend server is running at this address)*

3. Start the development server:
   ```bash
   npm run dev
   ```

## 📱 Key Features

- Interactive learning modules
- Real-time voice recording and analysis
- Video identification quizzes
- Caricature generation
- Talking photo generation
- User progress tracking
- Personalized content using user's face and voice
- Responsive design for all devices

## 🔧 Component Details

### Core Components
- `Button`: Custom button component with variants
- `Card`: Layout component for content sections
- `FileUpload`: Handles image uploads with validation
- `VoiceRecorder`: Records and processes voice samples
- `NarrationPlayer`: Plays narrated content
- `QuizComponent`: Interactive quiz interface

### Page Components
- `BaseModulePage`: Base template for all learning modules
- `UserOnboardingPage`: User data collection
- `ModuleSelectionPage`: Module navigation
- `CaricatureGenerationPage`: Caricature creation
- `TalkingPhotoGenerationPage`: Talking photo creation

## 🔐 Security Considerations

- Secure file uploads
- Voice data encryption
- Firebase security rules
- Environment variable protection

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request
