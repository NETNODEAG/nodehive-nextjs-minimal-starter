'use server';

import { createServerClient } from '@/lib/nodehive-client';

export async function saveTemplate(
  formData: FormData,
  fragmentType: string,
  dataField: string
) {
  const client = await createServerClient();

  const name = formData.get('name') as string;
  const content = formData.get('content') as string;

  if (!name) {
    return {
      success: false,
      message: 'Name is required',
    };
  }

  if (!content) {
    return {
      success: false,
      message: 'Content is required',
    };
  }

  const endpoint = `/jsonapi/nodehive_fragment/${fragmentType}`;
  const payload = {
    data: {
      type: `nodehive_fragment--${fragmentType}`,
      attributes: {
        title: name,
        status: true,
        [dataField]: content,
      },
    },
  };

  try {
    await client.request(endpoint, {
      method: 'POST',
      data: payload,
    });
  } catch (error) {
    console.error('Error saving template:', error);
    return {
      success: false,
      message: `An error occurred while saving the template: ${error}`,
    };
  }

  return {
    success: true,
    message: 'Template saved',
  };
}
