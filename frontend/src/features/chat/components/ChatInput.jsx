import React, { useEffect, useRef, useState } from 'react';

const ChatInput = ({
  onSend,
  onSendAttachment,
  onTypingStart,
  onTypingStop,
  sending = false,
  uploading = false
}) => {

  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const disabled = sending || uploading;

  useEffect(() => {
    return () => onTypingStop?.();
  }, [onTypingStop]);

  const handleSubmit = async e => {
    e?.preventDefault();

    if (disabled) return;

    if (file) {
      onTypingStop?.();
      const success = await onSendAttachment(file);

      if (success) {
        setFile(null);
        setPreviewUrl(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
      return;
    }

    const value = content.trim();
    if (!value) return;

    onTypingStop?.();
    const success = await onSend(value);

    if (success) {
      setContent('');
    }
  };

  const handleContentChange = e => {
    const value = e.target.value;
    setContent(value);

    if (value.trim()) { 
      onTypingStart?.();
    } else { 
      onTypingStop?.();
    }
  };

  const handleFileChange = e => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    onTypingStop?.();
    setFile(selectedFile);

    if (selectedFile.type.startsWith('image/')) {
      setPreviewUrl(URL.createObjectURL(selectedFile));
    } else {
      setPreviewUrl(null);
    }
  };

  const removeFile = () => {
    setFile(null);
    setPreviewUrl(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter' && !e.shiftKey && !file) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-gray-100 bg-white p-3"
    >
      {file && (
        <div className="mb-2 flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-2">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt={file.name}
              className="h-14 w-14 rounded-lg object-cover"
            />
          ) : (
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14 2v6h6"
                />
              </svg>
            </div>
          )}

          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-gray-700">
              {file.name}
            </p>
            <p className="text-xs text-gray-400">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>

          <button
            type="button"
            onClick={removeFile}
            disabled={disabled}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-200 hover:text-gray-700 disabled:opacity-40"
            aria-label="Xóa tập tin"
          >
            ×
          </button>
        </div>
      )}

      <div className="flex items-end gap-2 rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2 transition focus-within:border-indigo-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-100">
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
          disabled={disabled}
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-gray-400 transition hover:bg-gray-200 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Đính kèm tập tin"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.44 11.05l-8.49 8.49a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.82-2.83l8.49-8.48"
            />
          </svg>
        </button>

        <textarea
          value={content}
          onChange={handleContentChange}
          onKeyDown={handleKeyDown}
          placeholder={
            file ? 'Nhấn gửi để gửi tập tin...' : 'Nhập tin nhắn...'
          }
          disabled={disabled || !!file}
          rows={1}
          className="max-h-24 min-h-[38px] flex-1 resize-none bg-transparent py-2 text-xs text-gray-800 outline-none placeholder:text-gray-400 disabled:opacity-50"
        />

        <button
          type="submit"
          disabled={disabled || (!content.trim() && !file)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Gửi"
        >
          {disabled ? (
            <svg
              className="h-4 w-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          ) : (
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 12h14M13 6l6 6-6 6"
              />
            </svg>
          )}
        </button>
      </div>

      <p className="mt-1.5 px-1 text-[10px] text-gray-400">
        Enter để gửi · Shift + Enter để xuống dòng
      </p>
    </form>
  );
};

export default ChatInput;