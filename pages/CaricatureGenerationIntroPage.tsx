import React from 'react';
import PageLayout from '../components/PageLayout.tsx';
import Card from '../components/Card.tsx';
import ScriptNarrationSlide from '../components/ScriptNarrationSlide.tsx';
import { Page } from '../types.ts';
import { SCRIPTS } from '../constants.tsx';

interface CaricatureGenerationIntroPageProps {
  setCurrentPage: (page: Page) => void;
  onGoBack: () => void;
  canGoBack: boolean;
}

const CaricatureGenerationIntroPage: React.FC<CaricatureGenerationIntroPageProps> = ({
  setCurrentPage,
  onGoBack,
  canGoBack,
}) => {
  const handleNext = () => {
    setCurrentPage(Page.CaricatureGeneration);
  };

  return (
    <PageLayout title="캐릭터 생성 준비">
      <Card>
        <ScriptNarrationSlide
          script={SCRIPTS.caricatureGenerationStart}
          onNext={handleNext}
          title="당신만의 캐릭터를 만들어보세요"
          voiceId={null} // No voice for this intro page
          autoPlay={false}
        />
      </Card>
    </PageLayout>
  );
};

export default CaricatureGenerationIntroPage;