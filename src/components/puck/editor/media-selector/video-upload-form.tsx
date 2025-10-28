'use client';

import { FormEvent, useState } from 'react';
import { uploadRemoteVideoMedia } from '@/data/nodehive/media/actions';
import { Button } from '@measured/puck';

type MessageType = 'success' | 'error' | null;

interface VideoUploadFormProps {
  onCancel?: () => void;
  onMediaAdded?: () => void;
}

export function VideoUploadForm({
  onMediaAdded,
  onCancel,
}: VideoUploadFormProps) {
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<MessageType>(null);
  const [formData, setFormData] = useState({
    videoUrl: '',
    name: '',
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setMessage('');
    setMessageType(null);

    try {
      const formElement = e.currentTarget;
      const formData = new FormData(formElement);

      const result = await uploadRemoteVideoMedia(formData);

      if (result) {
        setMessage(result.message);
        if (result.success) {
          setMessageType('success');
          formElement.reset();
          setFormData({ videoUrl: '', name: '' });
          if (onMediaAdded) {
            onMediaAdded();
          }
        } else {
          setMessageType('error');
        }
      }
    } catch (error) {
      setMessage('Failed to add remote video');
      setMessageType('error');
      console.error(error);
    } finally {
      setIsPending(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {message && (
        <div
          className={`rounded p-2 text-sm font-medium ${
            messageType === 'success'
              ? 'border border-green-200 bg-green-100 text-green-700'
              : 'border border-red-200 bg-red-100 text-red-700'
          }`}
        >
          {message}
        </div>
      )}

      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder=""
          value={formData.name}
          onChange={handleChange}
          className="focus:border-primary focus:ring-primary mt-1 block w-full max-w-3xl rounded-md border-gray-300 shadow-sm"
          required
        />
      </div>

      <div>
        <label
          htmlFor="videoUrl"
          className="block text-sm font-medium text-gray-700"
        >
          Video URL (YouTube or Vimeo)
        </label>
        <input
          type="url"
          id="videoUrl"
          name="videoUrl"
          placeholder="https://www.youtube.com/watch?v=..."
          value={formData.videoUrl}
          onChange={handleChange}
          className="focus:border-primary focus:ring-primary mt-1 block w-full max-w-3xl rounded-md border-gray-300 shadow-sm"
          required
        />
      </div>

      <div className="mt-6 flex justify-between gap-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isPending}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {isPending ? 'Lädt hoch...' : 'Video hochladen'}
        </Button>
      </div>
    </form>
  );
}
