# AI Awareness Project Frontend

A React-based frontend application for educating users about AI awareness, focusing on deepfake technology, voice cloning, fake news, and identity theft prevention through interactive modules.

## 🏗️ Project Structure

```
frontend/
├── components/          # Reusable UI components
│   ├── BackButton.tsx   # Navigation back button
│   ├── Button.tsx       # Custom button component
│   ├── Card.tsx         # Card layout component
│   ├── ContinueButton.tsx # Animated continue button
│   ├── FileUpload.tsx   # File upload component
│   ├── LoadingSpinner.tsx # Loading indicator
│   ├── ModuleProgressBar.tsx # Module progress visualization
│   ├── NarrationPlayer.tsx # Audio narration player
│   ├── PageLayout.tsx   # Common page layout
│   ├── PersonaTransitionSlide.tsx # AI persona transitions
│   ├── ProgressTracker.tsx # Progress tracking component
│   ├── QuizComponent.tsx # Interactive quiz interface
│   ├── VideoDisplay.tsx # Video display component
│   └── VoiceRecorder.tsx # Voice recording component
├── pages/               # Page components
│   ├── BaseModulePage.tsx # Base template for learning modules
│   ├── CaricatureGenerationPage.tsx # AI caricature creation
│   ├── CompletionPage.tsx # Module completion
│   ├── DeepfakeIntroductionPage.tsx # Deepfake introduction
│   ├── FakeNewsModulePage.tsx # Module 1: Fake News
│   ├── IdentityTheftModulePage.tsx # Module 2: Identity Theft
│   ├── LandingPage.tsx  # Application entry point
│   ├── ModuleSelectionPage.tsx # Module navigation
│   ├── TalkingPhotoGenerationPage.tsx # AI talking photo creation
│   └── UserOnboardingPage.tsx # User data collection
├── services/            # API and external service integrations
│   └── apiService.ts    # Backend API communication
├── hooks/               # Custom React hooks
│   └── useAudioRecorder.ts # Audio recording hook
├── utils/               # Utility functions
│   ├── narrationPreloader.ts # Audio preloading utilities
│   └── scenarioUtils.ts # Scenario processing utilities
├── types.ts             # TypeScript type definitions
└── constants.tsx        # Application constants, scripts, and content
```

## 🚀 Application Flow

### Phase 1: User Onboarding
1. **Landing Page**: Welcomes user with project introduction
2. **User Onboarding**: Collects personal info (name, age, gender)
3. **Photo Upload**: User uploads their photo for face analysis
4. **Voice Recording**: 10-second voice sample for cloning
5. **Data Processing**: Backend creates ElevenLabs voice clone and stores data

### Phase 2: AI Content Generation
6. **Caricature Generation**: OpenAI creates personalized caricature from photo
7. **First Talking Photo**: Creates talking video with caricature + user's voice
8. **Background Pre-Generation**: Automatically generates all scenario content

### Phase 3: Educational Modules

#### Module 1: 가짜 뉴스 (Fake News)
1. **개념 소개** - Deepfake concept explanation
2. **사례 학습** - Real deepfake case studies with videos
3. **체험하기** - Interactive scenarios:
   - Scenario 1: 복권 당첨 (Lottery winner) - Face swap + talking photo
   - Scenario 2: 범죄 용의자 (Criminal suspect) - Face swap + talking photo
4. **대응방안** - Detection tips and countermeasures
5. **확인 퀴즈** - Knowledge verification quiz
6. **모듈 완료** - Completion summary

#### Module 2: 신원 도용 (Identity Theft)
1. **개념 소개** - Identity theft and voice cloning explanation
2. **사례 학습** - Voice/video call fraud examples
3. **체험하기** - Interactive scenarios:
   - Scenario 1: 투자 사기 전화 (Investment scam call) - Voice dubbing
   - Scenario 2: 사고 긴급 전화 (Emergency accident call) - Voice dubbing
4. **대응방안** - Prevention methods and family security
5. **확인 퀴즈** - Knowledge verification quiz
6. **모듈 완료** - Completion summary

### Phase 4: Completion
9. **Module Selection**: User can navigate between completed modules
10. **Progress Tracking**: All progress saved locally and in backend

## 🛠️ Technology Stack

- **Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: React hooks (useState, useEffect, useRef)
- **API Communication**: Fetch API with custom service layer

### Backend Integration
The frontend communicates with a Python FastAPI backend:
- **Database**: Supabase (PostgreSQL) for user data and progress
- **File Storage**: AWS S3 with CloudFront CDN for generated content
- **AI Services**: OpenAI (images), ElevenLabs (voice), Akool (face swap/talking photos)

## 🚀 Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file with the backend API URL:
   ```
   VITE_API_BASE_URL=http://localhost:8000
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## 📱 Key Features

### Core Functionality
- **Multi-stage User Onboarding**: Photo upload + voice recording
- **AI Content Generation**: Caricature, talking photos, voice dubbing
- **Interactive Learning Modules**: Structured educational content
- **Real-time Scenario Generation**: Face swap and voice cloning demos
- **Progress Tracking**: Local storage + backend persistence
- **Responsive Design**: Mobile and desktop optimized

### Advanced Features
- **Optimized Pre-Generation**: Background scenario creation for instant access
- **Smart Audio Preloading**: Seamless narration transitions
- **Fallback Systems**: Graceful handling of AI API failures
- **Sample Content**: Backup videos/audio when generation fails
- **Progress Visualization**: Module progress bars with section tracking

## 🔧 Component Architecture

### Core Components
- **Button**: Customizable button with variants and sizes
- **Card**: Flexible container for content sections
- **LoadingSpinner**: Consistent loading indicators
- **ModuleProgressBar**: Visual progress tracking (개념→사례→실습→대응→퀴즈)

### Specialized Components
- **PersonaTransitionSlide**: AI narrator with talking photo integration
- **NarrationPlayer**: Audio playback with preloading support
- **VoiceRecorder**: Real-time voice recording with validation
- **QuizComponent**: Interactive quiz with voice feedback

### Page Components
- **BaseModulePage**: Template for all educational modules
- **UserOnboardingPage**: Multi-step user data collection
- **CaricatureGenerationPage**: AI-powered caricature creation
- **TalkingPhotoGenerationPage**: Video generation with user's face/voice

## 📊 State Management

### Global State
- User data (userData, userImageUrl, caricatureUrl, talkingPhotoUrl)
- Current page navigation
- Module progress tracking

### Local State
- Step progression within modules
- Loading states for AI generation
- Interactive content state
- Audio/video playback state

### Persistence
- **localStorage**: Immediate state recovery
- **Backend API**: Permanent progress storage
- **Hybrid Approach**: Local first, sync with backend

## 🎯 AI Integration

### Content Generation Pipeline
1. **Face Analysis**: OpenAI analyzes uploaded photo
2. **Caricature Creation**: DALL-E generates stylized version
3. **Voice Cloning**: ElevenLabs creates custom voice
4. **Scenario Pre-Generation**: Background creation of all scenario content
5. **Real-time Display**: Instant access to pre-generated content

### Scenario Types
- **Face Swap Scenarios**: Akool API swaps user face onto base images
- **Talking Photos**: Combines face swap + voice for video generation
- **Voice Dubbing**: ElevenLabs dubs pre-recorded audio with user's voice

## 🔐 Security & Privacy

### Data Protection
- Minimal personal data collection
- Secure file uploads to S3
- No permanent storage of voice recordings
- Environment variable protection

### API Security
- Bearer token authentication
- CORS configuration
- Input validation and sanitization
- Error handling without sensitive data exposure

## 🚀 Performance Optimizations

### Pre-Generation Strategy
- **Optimized Timing**: Scenario generation after first talking photo
- **Background Processing**: No user wait time for scenarios
- **Resource Allocation**: Prevents API competition during critical first impression
- **67% Faster Experience**: First talking photo reduced from 4-6min to 1-3min

### Audio Optimization
- **Smart Preloading**: Next narration ready before user needs it
- **Caching Strategy**: Avoid re-generating identical audio
- **Fallback Audio**: Sample content when generation fails

### UI/UX Optimizations
- **Seamless Transitions**: Smooth navigation between steps
- **Progress Visualization**: Clear section indicators
- **Loading States**: Comprehensive feedback during AI generation
- **Error Recovery**: Graceful degradation with user-friendly messages

## 🔧 Development

### Testing Commands
```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

### Environment Variables
```bash
# Frontend (.env)
VITE_API_BASE_URL=http://localhost:8000
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Follow existing code patterns and TypeScript types
4. Test thoroughly with backend integration
5. Commit your changes
6. Push to the branch
7. Open a Pull Request

## 📋 Common Issues & Solutions

### Audio Autoplay Issues
- Browser autoplay restrictions handled gracefully
- Manual controls provided when autoplay fails
- No false error messages for expected autoplay blocks

### AI Generation Timeouts
- Sample content fallbacks for all scenarios
- Clear user messaging during generation
- Retry mechanisms with appropriate timeouts

### State Management
- One-way state sync prevents infinite loops
- Careful useEffect dependencies
- Local storage for immediate recovery