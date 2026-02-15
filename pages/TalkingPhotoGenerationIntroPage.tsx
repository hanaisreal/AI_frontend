import React from 'react';
import PageLayout from '../components/PageLayout.tsx';
import Card from '../components/Card.tsx';
import PersonaTransitionSlide from '../components/PersonaTransitionSlide.tsx';
import { Page } from '../types.ts';
import { SCRIPTS, NARRATOR_VOICE_ID, PLACEHOLDER_USER_IMAGE, UI_TEXT } from '../lang';

interface TalkingPhotoGenerationIntroPageProps {
  setCurrentPage: (page: Page) => void;
  onGoBack: () => void;
  canGoBack: boolean;
  caricatureUrl: string | null;
  voiceId: string | null;
}

const TalkingPhotoGenerationIntroPage: React.FC<TalkingPhotoGenerationIntroPageProps> = ({
  setCurrentPage,
}) => {
  const handleNext = async () => {
    setCurrentPage(Page.TalkingPhotoGeneration);
  };

  return (
    <PageLayout title="말하는 캐릭터 만들기">
      <Card>
        <PersonaTransitionSlide
          onNext={handleNext}
          userData={null}
          caricatureUrl={PLACEHOLDER_USER_IMAGE} // Use placeholder for narrator
          voiceId={NARRATOR_VOICE_ID}
          talkingPhotoUrl={null}
          script={SCRIPTS.talkingPhotoGenerationStart}
          showScript={true}
          chunkedDisplay={true}
        />
      </Card>
    </PageLayout>
  );
};

export default TalkingPhotoGenerationIntroPage;