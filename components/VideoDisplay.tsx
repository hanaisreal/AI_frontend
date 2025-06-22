import React, { useRef, useEffect } from 'react';
import Card from './Card.tsx';

interface VideoDisplayProps {
  videoUrl?: string;
  title?: string;
  onVideoEnd?: () => void;
  aspectRatio?: '16:9' | '9:16' | 'square';
  unmuted?: boolean;
  autoPlay?: boolean;
  controls?: boolean;
}

const VideoDisplay: React.FC<VideoDisplayProps> = ({
  videoUrl,
  title,
  onVideoEnd,
  aspectRatio = '16:9',
  unmuted = false,
  autoPlay = true,
  controls = true,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => {
      if (onVideoEnd) {
        onVideoEnd();
      }
    };

    video.addEventListener('ended', handleEnded);
    return () => video.removeEventListener('ended', handleEnded);
  }, [onVideoEnd]);

  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case '9:16':
        return 'aspect-[9/16] max-w-md mx-auto';
      case 'square':
        return 'aspect-square max-w-md mx-auto';
      case '16:9':
      default:
        return 'aspect-video';
    }
  };

  if (!videoUrl) {
    return (
      <Card>
        <div className="text-center text-gray-500 p-8">
          <p>비디오를 로드할 수 없습니다.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      {title && (
        <h3 className="text-xl font-bold text-center mb-4 text-orange-600">{title}</h3>
      )}
      
      <div className={`${getAspectRatioClass()} bg-black rounded-lg overflow-hidden`}>
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full h-full object-contain"
          autoPlay={autoPlay}
          muted={!unmuted}
          controls={controls}
          onError={(e) => {
            console.error('Video error:', e);
          }}
        >
          Your browser does not support the video tag.
        </video>
      </div>
    </Card>
  );
};

export default VideoDisplay;