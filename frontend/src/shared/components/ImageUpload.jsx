import React, { useRef, useState, useEffect } from 'react';
import imageCompression from 'browser-image-compression';

const ImageUpload = ({ 
  label, 
  required = false, 
  initialImage = '', 
  onChange, 
  error, 
  multiple = false,      
  isUploading = false,   
  compress = true, 
  helperText = "Hỗ trợ định dạng PNG, JPG, WEBP. Có thể Kéo thả hoặc Copy/Paste ảnh trực tiếp.",
  className = "w-full",        
  imageClassName = "h-24 w-auto"
}) => {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(initialImage);
  const [isDragging, setIsDragging] = useState(false); 
  const [isCompressing, setIsCompressing] = useState(false); 

  useEffect(() => {
    setPreview(initialImage);
  }, [initialImage]);

const compressImage = async (file) => {
  if (!compress || !file.type.startsWith('image/')) {
    return file;
  }

  const options = {
    maxSizeMB: 2,
    maxWidthOrHeight: 2400,
    initialQuality: 0.9,
    useWebWorker: true,
  };

  try {
    return await imageCompression(file, options);
  } catch (error) {
    console.error('Lỗi nén ảnh:', error);
    return file;
  }
};

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    processFiles(files);
  };

const processFiles = async (files) => {
  setIsCompressing(true);

  try {
    const fileArray = Array.from(files);

    if (multiple) {
      const compressedFiles = await Promise.all(
        fileArray.map(file => compressImage(file))
      );

      onChange(compressedFiles);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } else {
      const compressedFile = await compressImage(fileArray[0]);

      setPreview(URL.createObjectURL(compressedFile));
      onChange(compressedFile);
    }
  } finally {
    setIsCompressing(false);
  }
};

  const onDragOver = (e) => { e.preventDefault(); if (!isUploading && !isCompressing) setIsDragging(true); };
  const onDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (isUploading || isCompressing) return;
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) processFiles(files);
  };

const handlePaste = (e) => {
  if (isUploading || isCompressing) return;

  const items = e.clipboardData?.items;
  if (!items) return;

  const pastedFiles = [];

  for (let i = 0; i < items.length; i++) {
    if (items[i].type.startsWith('image/')) {
      const file = items[i].getAsFile();

      if (file) {
        pastedFiles.push(file);
      }
    }
  }

  if (pastedFiles.length > 0) {
    e.preventDefault();
    processFiles(pastedFiles);
  }
};

  const isLoading = isUploading || isCompressing;

  return (
   <div className={`flex flex-col gap-1.5 text-left ${className}`}>
      {label && (
        <label className="block text-sm font-semibold text-gray-700">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        multiple={multiple} 
        className="hidden"
        onChange={handleFileChange}
      />

      {!multiple && preview ? (
        <div 
          tabIndex={0} 
          onPaste={handlePaste}
          className={`relative group border-2 border-dashed border-slate-200 rounded-xl p-4 bg-slate-50/50 flex flex-col items-center justify-center gap-3 outline-none focus:border-indigo-400 transition-colors ${isLoading ? 'opacity-60 pointer-events-none' : ''}`}
        >
          <img 
            src={preview} 
            alt="Preview" 
            className={`${imageClassName} object-cover bg-white p-2 rounded-lg shadow-sm border border-gray-100`}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 underline"
          >
            {isLoading ? 'Đang xử lý ảnh...' : 'Thay đổi ảnh khác (Có thể Paste ảnh mới)'}
          </button>
        </div>
      ) : (
        <div 
          tabIndex={0} 
          onClick={() => !isLoading && fileInputRef.current.click()}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onPaste={handlePaste}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer outline-none transition-all flex flex-col items-center justify-center gap-2 ${
            isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 bg-slate-50/50 hover:bg-slate-50 hover:border-indigo-400 focus:border-indigo-400 focus:bg-indigo-50/30'
          } ${error ? 'border-rose-300 bg-rose-50/10' : ''} ${isLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          <div className="p-3 bg-white rounded-full shadow-sm text-gray-400 border border-gray-100">
             {isLoading ? (
              <svg className="animate-spin w-6 h-6 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L21 14m-6-6h.01M22 12a10 10 0 11-20 0 10 10 0 0120 0z" />
              </svg>
            )}
          </div>
          <span className="text-sm font-medium text-slate-600">
            {isCompressing ? 'Đang tối ưu ảnh...' : isUploading ? 'Đang tải ảnh lên hệ thống...' : multiple ? 'Nhấp, kéo thả, hoặc Copy/Paste nhiều ảnh vào đây' : 'Nhấp, kéo thả, hoặc Copy/Paste ảnh vào đây'}
          </span>
          <span className="text-xs text-gray-400">{helperText}</span>
        </div>
      )}

      {error && (
        <p className="text-xs font-medium text-rose-500 pl-1 mt-1">
          ⚠️ {error}
        </p>
      )}
    </div>
  );
};

export default ImageUpload;