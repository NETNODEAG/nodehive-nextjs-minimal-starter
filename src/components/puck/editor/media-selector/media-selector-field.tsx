'use client';

import { useState } from 'react';
import { Button, FieldLabel } from '@measured/puck';
import { ImageIcon, Trash2 } from 'lucide-react';

import { extractFields } from '@/lib/extract-fields';
import { MediaSelectorModal } from './media-selector-modal';

export type MediaItem = {
  id: string;
  type: string;
  name?: string;
  thumbnailImage?: string;
};

type MediaSelectorFieldProps = {
  onChange: (value: MediaItem | null) => void;
  value: MediaItem | null;
  mediaTypes: string[];
  label: string;
  fields?: string[]; // Array of property paths to extract from selected media
};

export function MediaSelectorField({
  onChange,
  value,
  mediaTypes,
  label,
  fields,
}: MediaSelectorFieldProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Helper function to get file icon and styling based on file type
  const getFileDisplay = (media: MediaItem | null) => {
    if (!media) {
      return null;
    }

    // Handle specific media types directly
    if (media.type === 'media--audio') {
      return {
        icon: 'audio_file',
        bgColor: 'bg-purple-50',
        iconColor: 'text-purple-600',
      };
    }

    if (media.type === 'media--video') {
      return null; // will show thumbnail
    }

    if (media.type === 'media--image') {
      return null; // Will show thumbnail
    }

    if (media.type === 'media--remote_video') {
      return null; // Will show thumbnail
    }

    // Handle document media types by extension
    if (media.type !== 'media--document') {
      return null;
    }

    const fileName = media.name?.toLowerCase() || '';
    const extension = fileName.split('.').pop();

    switch (extension) {
      case 'pdf':
        return {
          icon: 'picture_as_pdf',
          bgColor: 'bg-red-50',
          iconColor: 'text-red-600',
        };
      case 'zip':
      case 'rar':
      case '7z':
      case 'tar':
      case 'gz':
        return {
          icon: 'folder_zip',
          bgColor: 'bg-yellow-50',
          iconColor: 'text-yellow-600',
        };
      case 'doc':
      case 'docx':
        return {
          icon: 'description',
          bgColor: 'bg-primary/10',
          iconColor: 'text-primary',
        };
      case 'xls':
      case 'xlsx':
      case 'csv':
        return {
          icon: 'table_chart',
          bgColor: 'bg-green-50',
          iconColor: 'text-green-600',
        };
      case 'ppt':
      case 'pptx':
        return {
          icon: 'slideshow',
          bgColor: 'bg-orange-50',
          iconColor: 'text-orange-600',
        };
      case 'txt':
      case 'rtf':
        return {
          icon: 'article',
          bgColor: 'bg-gray-50',
          iconColor: 'text-gray-600',
        };
      case 'mp3':
      case 'wav':
      case 'm4a':
      case 'ogg':
        return {
          icon: 'audio_file',
          bgColor: 'bg-purple-50',
          iconColor: 'text-purple-600',
        };
      case 'mp4':
      case 'avi':
      case 'mov':
      case 'wmv':
      case 'webm':
        return {
          icon: 'video_file',
          bgColor: 'bg-indigo-50',
          iconColor: 'text-indigo-600',
        };
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'svg':
      case 'webp':
        return {
          icon: 'image',
          bgColor: 'bg-pink-50',
          iconColor: 'text-pink-600',
        };
      default:
        return {
          icon: 'description',
          bgColor: 'bg-gray-50',
          iconColor: 'text-gray-600',
        };
    }
  };

  const handleMediaSelected = (media: MediaItem | null) => {
    if (media && fields) {
      // Extract only the specified fields from the media object
      const extractedMedia = extractFields(media, [
        ...fields,
        'thumbnailImage',
      ]);
      onChange(extractedMedia);
    } else {
      // If no fields specified, use the entire media object
      onChange(media);
    }
    setIsModalOpen(false);
  };

  return (
    <>
      <FieldLabel icon={<ImageIcon className="size-4" />} label={label} />
      <div className="w-full">
        {value ? (
          <div className="rounded-md border border-gray-200">
            <div className="flex gap-3">
              <button
                className="flex grow cursor-pointer flex-col items-center justify-center gap-2 p-3 hover:bg-[#f7faff]"
                onClick={() => setIsModalOpen(true)}
                type="button"
              >
                {(() => {
                  const fileDisplay = getFileDisplay(value);

                  if (fileDisplay) {
                    return (
                      <div
                        className={`flex aspect-square w-10 shrink-0 items-center justify-center overflow-hidden rounded ${fileDisplay.bgColor}`}
                      >
                        <span
                          className={`material-symbols-outlined ${fileDisplay.iconColor} text-4xl`}
                        >
                          {fileDisplay.icon}
                        </span>
                      </div>
                    );
                  } else if (
                    value.thumbnailImage &&
                    (value.type === 'media--image' ||
                      value.type === 'media--remote_video' ||
                      value.type === 'media--video')
                  ) {
                    return (
                      <div className="aspect-square w-10 shrink-0 overflow-hidden rounded">
                        <div className="relative h-full w-full">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={value.thumbnailImage}
                            alt={value.name || ''}
                            className="h-full w-full object-contain"
                          />
                        </div>
                      </div>
                    );
                  } else {
                    // Fallback generic icon for unknown media types
                    return (
                      <div className="flex aspect-square w-10 shrink-0 items-center justify-center overflow-hidden rounded bg-gray-50">
                        <span className="material-symbols-outlined text-gray-600">
                          attachment
                        </span>
                      </div>
                    );
                  }
                })()}

                <div className="max-w-3xs text-xs font-medium break-all">
                  {value?.name}
                </div>
              </button>

              <button
                className="h-full cursor-pointer rounded-md p-3 hover:bg-[#f7faff]"
                type="button"
                onClick={() => onChange(null)}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          <Button
            variant="secondary"
            type="button"
            onClick={() => setIsModalOpen(true)}
          >
            Media auswählen
          </Button>
        )}
      </div>

      <MediaSelectorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onChange={handleMediaSelected}
        value={value}
        mediaTypes={mediaTypes}
      />
    </>
  );
}
