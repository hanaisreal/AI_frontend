import React, { useState, useEffect, useRef } from 'react';
import { QuizQuestion } from '../types.ts';
import Button from './Button.tsx';
import ContinueButton from './ContinueButton.tsx';
import Card from './Card.tsx';
import * as apiService from '../services/apiService.ts';

// Sound effect functions
const playClickSound = () => {
  // Create a realistic button click sound using Web Audio API
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Sharp, brief click sound - higher frequency for crisp click
    oscillator.frequency.setValueAtTime(1200, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.02);
    oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.05);
    
    // Quick attack and decay for sharp click
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.4, audioContext.currentTime + 0.005); // Fast attack
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05); // Quick decay
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.05);
  } catch (error) {
    console.log('Sound not supported');
  }
};

const playCorrectSound = () => {
  // Create a cheerful success sound
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator1 = audioContext.createOscillator();
    const oscillator2 = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator1.connect(gainNode);
    oscillator2.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Happy chord progression
    oscillator1.frequency.setValueAtTime(523, audioContext.currentTime); // C
    oscillator1.frequency.setValueAtTime(659, audioContext.currentTime + 0.1); // E
    oscillator1.frequency.setValueAtTime(784, audioContext.currentTime + 0.2); // G
    
    oscillator2.frequency.setValueAtTime(392, audioContext.currentTime); // G (lower)
    oscillator2.frequency.setValueAtTime(523, audioContext.currentTime + 0.1); // C
    oscillator2.frequency.setValueAtTime(659, audioContext.currentTime + 0.2); // E
    
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
    
    oscillator1.start(audioContext.currentTime);
    oscillator2.start(audioContext.currentTime);
    oscillator1.stop(audioContext.currentTime + 0.4);
    oscillator2.stop(audioContext.currentTime + 0.4);
  } catch (error) {
    console.log('Sound not supported');
  }
};

const playIncorrectSound = () => {
  // Create a gentle disappointment sound
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Descending tone
    oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.3);
    
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  } catch (error) {
    console.log('Sound not supported');
  }
};

interface QuizComponentProps {
  questions: QuizQuestion[];
  onQuizComplete: (score: number, total: number) => void;
  voiceId?: string | null;
  onPrevious?: () => void; // Optional back button handler
  onPreloadPostQuizNarration?: () => void; // Callback to pre-cache post-quiz narration
}

const QuizComponent: React.FC<QuizComponentProps> = ({ questions, onQuizComplete, voiceId, onPrevious, onPreloadPostQuizNarration }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [explanationNarrationCache, setExplanationNarrationCache] = useState<Map<string, string>>(new Map());
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentQuestion = questions[currentQuestionIndex];

  // Pre-cache explanation narrations when component mounts
  useEffect(() => {
    const preCacheExplanationNarrations = async () => {
      if (!voiceId) return;
      
      console.log('🎵 Pre-caching quiz explanation narrations...');
      const cache = new Map<string, string>();
      
      for (const question of questions) {
        if (question.explanation) {
          try {
            console.log(`🎵 Generating explanation narration for question: ${question.id}`);
            const result = await apiService.generateNarration(question.explanation, voiceId);
            
            // Create audio blob and URL
            const audioBlob = new Blob([Uint8Array.from(atob(result.audioData), c => c.charCodeAt(0))], { type: result.audioType });
            const audioUrl = URL.createObjectURL(audioBlob);
            
            cache.set(question.id, audioUrl);
            console.log(`✅ Explanation narration cached for question: ${question.id}`);
          } catch (error) {
            console.error(`⚠️ Failed to cache explanation narration for question ${question.id}:`, error);
          }
        }
      }
      
      setExplanationNarrationCache(cache);
      console.log('✅ All quiz explanation narrations pre-cached');
    };

    preCacheExplanationNarrations();
  }, [questions, voiceId]);

  // Play explanation narration
  const playExplanationNarration = (questionId: string) => {
    const audioUrl = explanationNarrationCache.get(questionId);
    if (audioUrl) {
      console.log(`🎵 Playing explanation narration for question: ${questionId}`);
      
      // Stop any currently playing audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      
      // Create new audio element
      const audio = new Audio(audioUrl);
      audio.volume = 0.8; // Slightly lower volume for explanation
      audio.play().catch(err => {
        console.error('Failed to play explanation narration:', err);
      });
      
      audioRef.current = audio;
    } else {
      console.log(`⚠️ No cached narration found for question: ${questionId}`);
    }
  };

  const handleAnswerSelect = (answer: string) => {
    if (showExplanation) return;
    playClickSound(); // Play click sound when user selects an answer
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return;

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      setScore(prevScore => prevScore + 1);
      // Play success sound after a short delay to let UI update
      setTimeout(() => playCorrectSound(), 100);
    } else {
      // Play incorrect sound after a short delay to let UI update
      setTimeout(() => playIncorrectSound(), 100);
    }
    
    setShowExplanation(true);
    
    // Play explanation narration after a short delay to let UI update and sound effects finish
    setTimeout(() => {
      playExplanationNarration(currentQuestion.id);
    }, 500);
  };

  const handleNextQuestion = () => {
    // Stop any currently playing explanation narration
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    
    setSelectedAnswer(null);
    setShowExplanation(false);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      
      // Pre-cache post-quiz narration when user reaches the second (final) quiz question
      if (currentQuestionIndex === 0 && onPreloadPostQuizNarration) {
        console.log('🎵 User reached second quiz question, pre-caching post-quiz narration...');
        onPreloadPostQuizNarration();
      }
    } else {
      onQuizComplete(score, questions.length);
    }
  };
  
   useEffect(() => {
    if (showExplanation && currentQuestionIndex === questions.length - 1) {
      // Logic handled by button change to "Finish Quiz"
    }
  }, [showExplanation, currentQuestionIndex, questions.length, score, onQuizComplete, selectedAnswer, currentQuestion]);

  // Cleanup audio when component unmounts
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      // Clean up cached audio URLs
      explanationNarrationCache.forEach(url => {
        URL.revokeObjectURL(url);
      });
    };
  }, [explanationNarrationCache]);


  if (!currentQuestion) {
    return <Card><p className="text-slate-700 text-lg">퀴즈가 완료되었거나 질문이 없습니다.</p></Card>;
  }

  return (
    <Card >
      <p className="text-xl text-slate-800 mb-8 min-h-[60px]">{currentQuestion.question}</p>
      
      <div className="space-y-4 mb-8">
        {currentQuestion.options.map(option => (
          <button
            key={option}
            onClick={() => handleAnswerSelect(option)}
            disabled={showExplanation}
            className={`w-full text-left p-4 rounded-lg border-2 text-lg transition-all duration-150 ease-in-out
              ${selectedAnswer === option ? 'bg-orange-500 border-orange-500 text-white ring-2 ring-orange-300' : 'bg-white border-slate-300 hover:border-orange-400 hover:bg-orange-50 text-slate-700'}
              ${showExplanation && option === currentQuestion.correctAnswer ? '!bg-green-500 !border-green-500 text-white ring-2 ring-green-300' : ''}
              ${showExplanation && selectedAnswer === option && option !== currentQuestion.correctAnswer ? '!bg-red-500 !border-red-500 text-white ring-2 ring-red-300' : ''}
              ${showExplanation ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}`}
          >
            {option}
          </button>
        ))}
      </div>

      {showExplanation && currentQuestion.explanation && (
        <div className={`p-4 rounded-md mb-6 text-base ${selectedAnswer === currentQuestion.correctAnswer ? 'bg-green-50 border-green-400 text-green-700' : 'bg-red-50 border-red-400 text-red-700'} border `}>
          <p className="font-bold text-lg mb-1">
            {selectedAnswer === currentQuestion.correctAnswer ? "정답입니다!" : "오답입니다."}
          </p>
          <p>{currentQuestion.explanation}</p>
        </div>
      )}

      <div className="mt-8 flex justify-center items-center space-x-4">
        {/* {onPrevious && (
          <BackButton
            onClick={onPrevious}
            size="lg"
            variant="primary"
          />
        )} */}
        {showExplanation ? (
          <ContinueButton 
            onClick={handleNextQuestion} 
            text={currentQuestionIndex < questions.length - 1 ? '다음 질문' : '퀴즈 완료'}
            showAnimation={true}
          />
        ) : (
          <Button onClick={() => {
            playClickSound(); // Play click sound when submitting answer
            handleSubmitAnswer();
          }} variant="primary" disabled={!selectedAnswer} size="lg">
            답변 제출
          </Button>
        )}
      </div>
    </Card>
  );
};

export default QuizComponent;
