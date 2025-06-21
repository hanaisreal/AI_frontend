import React, { useState, useEffect } from 'react';
import { QuizQuestion } from '../types.ts';
import Button from './Button.tsx';
import BackButton from './BackButton.tsx';
import Card from './Card.tsx';

interface QuizComponentProps {
  questions: QuizQuestion[];
  onQuizComplete: (score: number, total: number) => void;
  voiceId?: string | null;
  onPrevious?: () => void; // Optional back button handler
}

const QuizComponent: React.FC<QuizComponentProps> = ({ questions, onQuizComplete, onPrevious }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (answer: string) => {
    if (showExplanation) return;
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return;

    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore(prevScore => prevScore + 1);
    }
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setShowExplanation(false);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } else {
      onQuizComplete(score, questions.length);
    }
  };
  
   useEffect(() => {
    if (showExplanation && currentQuestionIndex === questions.length - 1) {
      // Logic handled by button change to "Finish Quiz"
    }
  }, [showExplanation, currentQuestionIndex, questions.length, score, onQuizComplete, selectedAnswer, currentQuestion]);


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
        {onPrevious && (
          <BackButton
            onClick={onPrevious}
            size="lg"
            variant="primary"
          />
        )}
        {showExplanation ? (
          <Button onClick={handleNextQuestion} variant="primary" size="lg">
            {currentQuestionIndex < questions.length - 1 ? '다음 질문' : '퀴즈 완료'}
          </Button>
        ) : (
          <Button onClick={handleSubmitAnswer} variant="primary" disabled={!selectedAnswer} size="lg">
            답변 제출
          </Button>
        )}
      </div>
    </Card>
  );
};

export default QuizComponent;
