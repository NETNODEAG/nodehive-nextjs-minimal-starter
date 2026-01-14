'use client';

import { useState } from 'react';
import { Button } from '@puckeditor/core';
import { DialogDescription } from '@radix-ui/react-dialog';
import { useQuery } from '@tanstack/react-query';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  SearchIcon,
  XIcon,
} from 'lucide-react';

import { cn, getLocaleFromPathname } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/atoms/dialog/dialog';
import { ImageUploadForm } from './image-upload-form';
import { MediaItem } from './media-selector-field';
import { VideoUploadForm } from './video-upload-form';

const PAGE_LIMIT = 15;

type MediaSelectorModalProps = {
  value: MediaItem | null;
  onChange: (media: MediaItem | null) => void;
  isOpen: boolean;
  onClose: () => void;
  mediaTypes: string[];
};

const fetchMedia = async ({
  type,
  query,
  offset,
  limit,
}: {
  type: string;
  query: string;
  offset: number;
  limit: number;
}) => {
  const searchParams = new URLSearchParams();
  if (query) {
    searchParams.append('query', query);
  }
  searchParams.append('offset', offset.toString());
  searchParams.append('limit', limit.toString());
  // TODO: Improve the langauge loading
  const language = getLocaleFromPathname(window.location.pathname);
  const response = await fetch(
    `/${language}/api/puck/media/${type}?${searchParams.toString()}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch media items');
  }

  return response.json();
};

export function MediaSelectorModal({
  value,
  onChange,
  isOpen,
  onClose,
  mediaTypes,
}: MediaSelectorModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedSearchQuery, setAppliedSearchQuery] = useState('');
  const [mediaType, setMediaType] = useState(mediaTypes[0] || '');
  const [showAddMedia, setShowAddMedia] = useState(false);
  const [currentOffset, setCurrentOffset] = useState(0);

  // Helper function to get file icon and styling based on file type
  const getFileDisplay = (media: MediaItem) => {
    // Handle specific media types directly
    if (media.type === 'media--audio') {
      return {
        icon: 'audio_file',
        bgColor: 'bg-purple-50',
        iconColor: 'text-purple-600',
      };
    }

    if (media.type === 'media--video') {
      return {
        icon: 'video_file',
        bgColor: 'bg-indigo-50',
        iconColor: 'text-indigo-600',
      };
    }

    if (media.type === 'media--image') {
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
      default:
        return {
          icon: 'description',
          bgColor: 'bg-gray-50',
          iconColor: 'text-gray-600',
        };
    }
  };

  const { data, isLoading, refetch } = useQuery({
    queryKey: [
      'media-items',
      mediaType,
      appliedSearchQuery,
      currentOffset,
      PAGE_LIMIT,
    ],
    queryFn: () =>
      fetchMedia({
        type: mediaType,
        query: appliedSearchQuery,
        offset: currentOffset,
        limit: PAGE_LIMIT,
      }),
    enabled: isOpen && !!mediaType,
  });

  const mediaItems: MediaItem[] =
    data?.data?.map((item: any) => ({
      ...item,
      thumbnailImage: `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}${item?.thumbnail?.uri?.url}`,
    })) || [];

  const hasNextPage = !!data?.links?.next;
  const hasPreviousPage = !!data?.links?.prev;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedSearchQuery(searchQuery);
    setCurrentOffset(0);
    refetch();
  };

  const clearSearch = () => {
    setSearchQuery('');
    setAppliedSearchQuery('');
    setCurrentOffset(0);
    refetch();
  };

  const handleMediaAdded = () => {
    refetch();
    setShowAddMedia(false);
  };

  const handleNextPage = () => {
    if (hasNextPage) {
      setCurrentOffset((prev) => prev + PAGE_LIMIT);
    }
  };

  const handlePreviousPage = () => {
    if (hasPreviousPage) {
      setCurrentOffset((prev) => prev - PAGE_LIMIT);
    }
  };

  const handleMediaTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedType = e.target.value;
    setMediaType(selectedType);
    setCurrentOffset(0); // Reset pagination on type change
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-dvh max-w-3xl overflow-y-auto xl:max-w-5xl">
        <DialogHeader>
          <DialogTitle>
            {showAddMedia
              ? mediaType === 'image'
                ? 'Add Image'
                : 'Add Remote Video'
              : 'Select Media'}
          </DialogTitle>
          <DialogDescription className="sr-only"></DialogDescription>
        </DialogHeader>

        {!showAddMedia ? (
          <div className="flex flex-col gap-4">
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <div className="relative flex-1">
                <SearchIcon className="absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Medien suchen"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="focus:border-primary focus:ring-primary w-full rounded-md border border-gray-300 py-1.5 pr-10 pl-8"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute top-1/2 right-2 h-5 w-5 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    aria-label="Clear search"
                  >
                    <XIcon className="h-4 w-4" />
                  </button>
                )}
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                size="large"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                Suchen
              </Button>
            </form>

            {mediaTypes.length > 1 && (
              <div className="flex items-center gap-4 rounded-md border border-gray-300 p-4">
                <div>
                  <label
                    htmlFor="mediaType"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Media Type
                  </label>
                  <select
                    id="mediaType"
                    value={mediaType}
                    onChange={handleMediaTypeChange}
                    className="focus:border-primary focus:ring-primary mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  >
                    {mediaTypes.map((type) => (
                      <option key={type} value={type}>
                        {type === 'remote_video'
                          ? 'Remote Video'
                          : type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <div className="grid grid-cols-3 gap-4 sm:grid-cols-5">
              {isLoading ? (
                Array.from({ length: PAGE_LIMIT }).map((_, index) => (
                  <div
                    key={index}
                    className="mb-4 aspect-square h-full w-full"
                  />
                ))
              ) : mediaItems.length > 0 ? (
                mediaItems.map((item) => (
                  <div
                    key={item.id}
                    className={cn(
                      'cursor-pointer rounded-lg border border-gray-200 p-2 transition-all hover:border-gray-300',
                      {
                        'border-primary ring-primary ring-2':
                          value?.id === item.id,
                      }
                    )}
                    onClick={() => onChange(item)}
                  >
                    <div className="mb-2 aspect-square w-full overflow-hidden rounded bg-gray-100">
                      {(() => {
                        const fileDisplay = getFileDisplay(item);

                        if (fileDisplay) {
                          // Show file type icon for non-image media types
                          return (
                            <div
                              className={`flex h-full w-full items-center justify-center ${fileDisplay.bgColor}`}
                            >
                              <span
                                className={`material-symbols-outlined ${fileDisplay.iconColor} text-6xl`}
                              >
                                {fileDisplay.icon}
                              </span>
                            </div>
                          );
                        } else if (item.thumbnailImage) {
                          // Show thumbnail image for any media type that has one
                          return (
                            <div className="relative h-full w-full">
                              {/*eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={item.thumbnailImage}
                                alt={item.name || ''}
                                sizes="220px"
                                className="h-full w-full object-contain"
                              />
                            </div>
                          );
                        } else {
                          // Fallback generic icon for media without thumbnails
                          return (
                            <div className="flex h-full w-full items-center justify-center bg-gray-50">
                              <span className="material-symbols-outlined text-6xl text-gray-600">
                                attachment
                              </span>
                            </div>
                          );
                        }
                      })()}
                    </div>
                    <div className="truncate text-sm">{item.name}</div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-8 text-center">
                  Keine Medien gefunden
                </div>
              )}
            </div>

            <div className="mt-4 grid grid-cols-3">
              <div className="col-start-2 flex items-center justify-center gap-2">
                {hasPreviousPage ? (
                  <button
                    className="cursor-pointer"
                    onClick={handlePreviousPage}
                  >
                    <ChevronLeftIcon className="hover:text-primary size-5" />
                  </button>
                ) : (
                  <div className="size-5"></div>
                )}
                <span>Page {Math.floor(currentOffset / PAGE_LIMIT) + 1}</span>
                {hasNextPage ? (
                  <button onClick={handleNextPage} className="cursor-pointer">
                    <ChevronRightIcon className="hover:text-primary size-5" />
                  </button>
                ) : (
                  <div className="size-5"></div>
                )}
              </div>
              {(mediaType === 'image' || mediaType === 'remote_video') && (
                <div className="col-start-3 flex justify-end">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setShowAddMedia(true)}
                  >
                    {mediaType === 'image'
                      ? 'Upload Image'
                      : 'Upload Remote Video'}
                  </Button>
                </div>
              )}
            </div>
          </div>
        ) : mediaType === 'image' ? (
          <ImageUploadForm
            onCancel={() => setShowAddMedia(false)}
            onMediaAdded={handleMediaAdded}
          />
        ) : (
          <VideoUploadForm
            onCancel={() => setShowAddMedia(false)}
            onMediaAdded={handleMediaAdded}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
