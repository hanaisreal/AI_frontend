import React from 'react';
import PageLayout from '../components/PageLayout.tsx';
import Card from '../components/Card.tsx';
import PersonaTransitionSlide from '../components/PersonaTransitionSlide.tsx';
import { Page } from '../types.ts';
import { SCRIPTS, NARRATOR_VOICE_ID, PLACEHOLDER_USER_IMAGE, UI_TEXT } from '../lang';

interface CaricatureGenerationIntroPageProps {
  setCurrentPage: (page: Page) => void;
  onGoBack: () => void;
  canGoBack: boolean;
}

const CaricatureGenerationIntroPage: React.FC<CaricatureGenerationIntroPageProps> = ({
  setCurrentPage,
}) => {
  const handleNext = () => {
    setCurrentPage(Page.CaricatureGeneration);
  };

  return (
    <PageLayout title="캐릭터 생성 준비">
      <Card>
        <PersonaTransitionSlide
          onNext={handleNext}
          userData={null}
          caricatureUrl={PLACEHOLDER_USER_IMAGE} // Use placeholder for narrator
          voiceId={NARRATOR_VOICE_ID}
          talkingPhotoUrl={null}
          script={SCRIPTS.caricatureGenerationStart}
          showScript={true}
          chunkedDisplay={true}
        />
      </Card>
    </PageLayout>
  );
};

export default CaricatureGenerationIntroPage;