
import React, { useState, useCallback, useRef } from 'react';
import { UI_TEXT } from '../lang';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  label?: string;
  acceptedFileTypes?: string; // e.g., "image/png, image/jpeg"
  previewUrl?: string | null;
  isActive?: boolean; // For highlighting when this field should be filled
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  label = UI_TEXT.imageUpload,
  acceptedFileTypes = "image/*",
  previewUrl,
  isActive = false
}) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
      setFileName(file.name);
    }
  }, [onFileSelect]);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <label className="block text-base font-semibold text-slate-700 mb-2">{label}</label>
      <div 
        className={`mt-1 flex flex-col items-center justify-center px-6 py-10 border-2 rounded-lg cursor-pointer transition-all duration-300 ${
          isActive 
            ? 'border-orange-300 bg-orange-50 animate-pulse shadow-md' 
            : 'border-slate-300 bg-slate-50 hover:border-orange-500 hover:bg-orange-50'
        }`}
        onClick={handleClick}
      >
        <div className="space-y-2 text-center">
          {previewUrl ? (
            <img src={previewUrl} alt={UI_TEXT.preview} className="mx-auto h-32 w-32 object-cover rounded-md shadow-sm border border-slate-300" />
          ) : (
            <svg className="mx-auto h-16 w-16 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
          <div className="flex text-base text-slate-600">
            <span className="relative rounded-md font-semibold text-orange-600 hover:text-orange-500">
              <span>{fileName ? UI_TEXT.changeFile : UI_TEXT.uploadFile}</span>
              <input 
                ref={fileInputRef}
                id="file-upload" 
                name="file-upload" 
                type="file" 
                className="sr-only" 
                onChange={handleFileChange}
                accept={acceptedFileTypes} 
              />
            </span>
            {!fileName && <p className="pl-1">{UI_TEXT.orDragDrop}</p>}
          </div>
          {fileName ? (
            <p className="text-sm text-slate-500">{fileName}</p>
          ) : (
            <p className="text-sm text-slate-500">{UI_TEXT.fileTypes}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
