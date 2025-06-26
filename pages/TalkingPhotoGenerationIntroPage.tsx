import React from 'react';
import PageLayout from '../components/PageLayout.tsx';
import Card from '../components/Card.tsx';
import ScriptNarrationSlide from '../components/ScriptNarrationSlide.tsx';
import { Page } from '../types.ts';
import { SCRIPTS } from '../constants.tsx';

interface TalkingPhotoGenerationIntroPageProps {
  setCurrentPage: (page: Page) => void;
  onGoBack: () => void;
  canGoBack: boolean;
}

const TalkingPhotoGenerationIntroPage: React.FC<TalkingPhotoGenerationIntroPageProps> = ({
  setCurrentPage,
  onGoBack,
  canGoBack,
}) => {
  const handleNext = () => {
    setCurrentPage(Page.TalkingPhotoGeneration);
  };

  return (
    <PageLayout title="말하는 캐릭터 만들기">
      <Card>
        <ScriptNarrationSlide
          script={SCRIPTS.talkingPhotoGenerationStart}
          onNext={handleNext}
          title="캐릭터에 생명력을 불어넣어보세요"
          voiceId={null} // No voice for this intro page
          autoPlay={false}
        />
      </Card>
    </PageLayout>
  );
};

export default TalkingPhotoGenerationIntroPage;