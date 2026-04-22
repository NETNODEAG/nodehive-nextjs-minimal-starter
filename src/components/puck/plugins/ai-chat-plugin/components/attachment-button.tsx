'use client';

import { ReactNode, useRef } from 'react';

type FileAttachmentButtonProps = {
  onAttach: (file: File) => void;
  icon: ReactNode;
};

export function FileAttachmentButton({
  onAttach,
  icon,
}: FileAttachmentButtonProps) {
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
        accept="image/*,application/pdf"
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="cursor-pointer rounded-lg border border-gray-200 p-2 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700"
        title="Attach file"
      >
        {icon}
      </button>
    </>
  );
}
