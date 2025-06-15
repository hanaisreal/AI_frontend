import React, { useState, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner.tsx';
import * as apiService from '../services/apiService.ts';

interface ProgressTrackerProps {
  taskId: string;
  onComplete: (result: any) => void;
  onError: (error: string) => void;
  title?: string;
  className?: string;
}

interface ProgressData {
  progress: number;
  message: string;
  completed: boolean;
  timestamp: number;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  taskId,
  onComplete,
  onError,
  title = "Processing...",
  className = ""
}) => {
  const [progressData, setProgressData] = useState<ProgressData>({
    progress: 0,
    message: "Starting...",
    completed: false,
    timestamp: Date.now()
  });

  useEffect(() => {
    if (!taskId) return;

    const pollProgress = async () => {
      try {
        const data = await apiService.getProgress(taskId);
        setProgressData(data);

        if (data.completed) {
          if (data.progress === -1) {
            onError(data.message || "An error occurred");
          } else {
            onComplete(data);
          }
        }
      } catch (error) {
        console.error("Error polling progress:", error);
        // Don't call onError for polling failures - just keep trying
      }
    };

    // Poll immediately, then every 2 seconds
    pollProgress();
    const interval = setInterval(pollProgress, 2000);

    return () => clearInterval(interval);
  }, [taskId, onComplete, onError]);

  const getProgressColor = () => {
    if (progressData.progress === -1) return "bg-red-500";
    if (progressData.progress === 100) return "bg-green-500";
    return "bg-orange-500";
  };

  const getProgressIcon = () => {
    if (progressData.progress === -1) {
      return (
        <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      );
    }
    if (progressData.progress === 100) {
      return (
        <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      );
    }
    return <LoadingSpinner size="sm" />;
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <div className="flex items-center space-x-2">
          {getProgressIcon()}
          <span className="text-sm font-medium text-gray-600">
            {progressData.progress === -1 ? "Error" : 
             progressData.progress === 100 ? "Complete" : 
             `${progressData.progress}%`}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-500 ${getProgressColor()}`}
            style={{ 
              width: `${Math.max(0, Math.min(100, progressData.progress))}%` 
            }}
          />
        </div>
      </div>

      {/* Message */}
      <p className="text-sm text-gray-600 text-center">
        {progressData.message}
      </p>

      {/* Time indicator for long processes */}
      {progressData.progress > 0 && progressData.progress < 100 && progressData.progress !== -1 && (
        <p className="text-xs text-gray-400 text-center mt-2">
          This may take 1-3 minutes...
        </p>
      )}
    </div>
  );
};

export default ProgressTracker;