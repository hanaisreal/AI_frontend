
import React, { useState } from 'react';
import { PersonIdentificationData, UserAnswerForVideoQuiz } from '../types.ts';
import Button from './Button.tsx';
import Card from './Card.tsx';

interface VideoIdentificationQuizProps {
  videoUrl: string; // Placeholder image for the "video"
  peopleData: PersonIdentificationData[];
  onQuizComplete: (score: number, total: number, answers: UserAnswerForVideoQuiz[]) => void;
  title?: string;
}

type QuizPhase = 'observing' | 'judging' | 'results';

const VideoIdentificationQuiz: React.FC<VideoIdentificationQuizProps> = ({
  videoUrl,
  peopleData,
  onQuizComplete,
  title = "딥페이크 탐지 챌린지"
}) => {
  const [currentPersonIndex, setCurrentPersonIndex] = useState(0);
  const [currentPhase, setCurrentPhase] = useState<QuizPhase>('observing');
  const [userJudgements, setUserJudgements] = useState<UserAnswerForVideoQuiz[]>([]);

  const currentPerson = peopleData[currentPersonIndex];

  const handleObservationComplete = () => {
    setCurrentPhase('judging');
  };

  const handleJudgement = (choice: 'fake' | 'real') => {
    const person = peopleData[currentPersonIndex];
    const isCorrect = (choice === 'fake' && person.isFake) || (choice === 'real' && !person.isFake);

    const newJudgement: UserAnswerForVideoQuiz = {
      personId: person.id,
      userChoice: choice,
      isCorrect: isCorrect,
    };
    const updatedJudgements = [...userJudgements, newJudgement];
    setUserJudgements(updatedJudgements);

    if (currentPersonIndex < peopleData.length - 1) {
      setCurrentPersonIndex(prevIndex => prevIndex + 1);
      setCurrentPhase('observing');
    } else {
      setCurrentPhase('results');
      const score = updatedJudgements.filter(j => j.isCorrect).length;
      onQuizComplete(score, peopleData.length, updatedJudgements);
    }
  };

  if (!currentPerson && currentPhase !== 'results') {
    return <Card><p>퀴즈 로딩 중 오류가 발생했습니다.</p></Card>;
  }

  if (currentPhase === 'results') {
    const score = userJudgements.filter(j => j.isCorrect).length;
    return (
      <Card title="퀴즈 결과">
        <div className="text-left">
          <p className="text-xl text-center mb-8">당신의 점수: <span className="font-bold text-orange-600">{score}</span> / <span className="font-bold">{peopleData.length}</span></p>
          {peopleData.map((person) => {
            const judgement = userJudgements.find(j => j.personId === person.id);
            if (!judgement) return null;
            const correctAnswerText = person.isFake ? "가짜" : "진짜";
            return (
              <div key={person.id} className={`p-4 rounded-lg mb-4 border ${judgement.isCorrect ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
                <div className="flex flex-col lg:flex-row lg:space-x-6">
                  <div className="lg:flex-1">
                    <p className="text-lg font-semibold text-slate-700 mb-2">{person.name}:</p>
                    <p className="text-slate-600">당신의 선택: <span className="font-medium">{judgement.userChoice === 'fake' ? '가짜' : '진짜'}</span></p>
                    <p className={`text-slate-600 ${judgement.isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                      정답: <span className="font-medium">{correctAnswerText}</span> - {judgement.isCorrect ? "정답!" : "오답."}
                    </p>
                    <p className="text-sm text-slate-500 mt-2">{person.explanation}</p>
                  </div>
                  {person.videoUrl && (
                    <div className="mt-4 lg:mt-0 lg:w-80">
                      <p className="text-sm text-slate-600 mb-2">영상 다시보기:</p>
                      <video 
                        src={person.videoUrl} 
                        controls 
                        className="w-full rounded-lg shadow-sm border border-slate-200"
                        onError={(e) => console.error('Results video load error:', e)}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    );
  }

  return (
    <Card title={currentPerson?.name || title}>
      {currentPhase === 'observing' && currentPerson && (
        <div className="text-center">
          <p className="text-slate-700 text-lg mb-4">
            영상을 주의 깊게 관찰해주세요. 이 영상이 진짜인지 AI로 생성된 가짜인지 판단해보세요.
          </p>
          {currentPerson.videoUrl ? (
            <video 
              src={currentPerson.videoUrl} 
              controls 
              className="w-full max-w-md mx-auto rounded-lg shadow-md mb-6 border border-slate-300"
              onError={(e) => console.error('Quiz video load error:', e)}
            />
          ) : (
            <img src={videoUrl} alt={`${currentPerson.name}의 시뮬레이션된 비디오 클립`} className="w-full max-w-md mx-auto rounded-lg shadow-md mb-6 border border-slate-300" />
          )}
          <Button onClick={handleObservationComplete} variant="primary" size="lg">
            관찰 완료
          </Button>
        </div>
      )}

      {currentPhase === 'judging' && currentPerson && (
        <div className="text-center">
          <p className="text-slate-700 text-lg mb-8">
            영상을 관찰한 결과, 이 영상이 진짜라고 생각하시나요, 아니면 AI로 생성된 가짜라고 생각하시나요?
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 mt-6">
            <Button onClick={() => handleJudgement('fake')} variant="primary" size="lg" className="min-w-[150px]">
              가짜로 생각함
            </Button>
            <Button 
                onClick={() => handleJudgement('real')} 
                variant="secondary" 
                size="lg" 
                className="min-w-[150px] !bg-green-500 hover:!bg-green-600 !text-white focus:!ring-green-400"
            >
              진짜로 생각함
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default VideoIdentificationQuiz;
