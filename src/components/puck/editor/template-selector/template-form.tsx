'use client';

import { FormEvent, useState } from 'react';
import { saveTemplate } from '@/data/nodehive/fragment/actions';
import { Button, Content } from '@puckeditor/core';
import { toast } from 'sonner';

type MessageType = 'success' | 'error' | null;

interface TemplateFormProps {
  content: Content;
  onCancel?: () => void;
  onTemplateSaved?: () => void;
  fragmentType: string;
  dataField: string;
}

export function TemplateForm({
  content,
  onTemplateSaved,
  onCancel,
  fragmentType,
  dataField,
}: TemplateFormProps) {
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<MessageType>(null);
  const [formData, setFormData] = useState({
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
      formData.append('content', JSON.stringify(content));

      const result = await saveTemplate(formData, fragmentType, dataField);

      if (!result.success) {
        throw new Error(result.message);
      }

      setMessageType('success');
      setMessage(result.message);
      toast.success('Template saved');
      formElement.reset();
      setFormData({ name: '' });
      if (onTemplateSaved) {
        onTemplateSaved();
      }
    } catch (error) {
      setMessageType('error');
      setMessage('Failed to save template');
      toast.error('Failed to save template');
      console.error('Failed to save tempalte:', error);
    }

    setIsPending(false);
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
          {isPending ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </form>
  );
}
