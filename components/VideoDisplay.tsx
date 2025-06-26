import React, { useRef, useEffect } from 'react';

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

  const getVideoContainerClass = () => {
    switch (aspectRatio) {
      case '9:16':
        return 'w-full max-w-none mx-auto min-h-[70vh] flex items-center justify-center';
      case 'square':
        return 'w-full max-w-none mx-auto min-h-[60vh] flex items-center justify-center';
      case '16:9':
      default:
        return 'w-full max-w-none min-h-[50vh] flex items-center justify-center';
    }
  };

  if (!videoUrl) {
    return (
      <div className="w-full min-h-[50vh] flex items-center justify-center bg-gray-100">
        <div className="text-center text-gray-500">
          <p className="text-lg">비디오를 로드할 수 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-xl font-bold text-center mb-4 text-orange-600 px-4">{title}</h3>
      )}
      
      <div className={`${getVideoContainerClass()} bg-black`}>
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full max-w-full h-auto max-h-[90vh] object-contain"
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
    </div>
  );
};

export default VideoDisplay;