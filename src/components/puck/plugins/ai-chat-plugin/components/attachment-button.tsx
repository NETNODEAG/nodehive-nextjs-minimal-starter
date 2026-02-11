'use client';

import { ReactNode, useRef, useState } from 'react';

type LinkAttachmentButtonProps = {
  onAttach: (url: string) => void;
  icon: ReactNode;
};

export function LinkAttachmentButton({
  onAttach,
  icon,
}: LinkAttachmentButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onAttach(url.trim());
      setUrl('');
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-lg border border-gray-200 p-2 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700"
        title="Attach link"
      >
        {icon}
      </button>
      {isOpen && (
        <div className="absolute bottom-full left-0 z-10 mb-2 w-64 rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-2">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-sm focus:border-gray-400 focus:outline-none"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 rounded-lg bg-gray-900 px-3 py-1.5 text-xs text-white hover:bg-gray-800"
              >
                Attach
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setUrl('');
                }}
                className="flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

type ImageAttachmentButtonProps = {
  onAttach: (file: File) => void;
  icon: ReactNode;
};

export function ImageAttachmentButton({
  onAttach,
  icon,
}: ImageAttachmentButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onAttach(file);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="rounded-lg border border-gray-200 p-2 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700"
        title="Attach image"
      >
        {icon}
      </button>
    </>
  );
}
