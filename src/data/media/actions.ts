'use server';

import { getAuthToken } from '@/nodehive/auth';

// Define response type for better structure
type MediaUploadResponse = {
  success: boolean;
  message: string;
  data?: any;
};

/**
 * Uploads an image file to Drupal and creates a media entity
 * Using Flow 2 of the JSON API file upload process:
 * 1. Upload the binary file data to create a file entity
 * 2. Create a media entity referencing the file
 */
export async function uploadImageMedia(
  formData: FormData
): Promise<MediaUploadResponse> {
  const file = formData.get('file') as File;
  const alt = (formData.get('alt') as string) || '';
  const name = (formData.get('name') as string) || file?.name || 'Image';

  // Get the auth token
  const userToken = await getAuthToken();

  if (!userToken) {
    return {
      success: false,
      message: 'Authentication required',
    };
  }

  // Handle image upload
  if (!file || !(file instanceof File)) {
    return {
      success: false,
      message: 'No file provided',
    };
  }

  try {
    // Step 1: Upload the file directly to JSON API endpoint to create a file entity
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    const fileUploadUrl = `${process.env.NEXT_PUBLIC_DRUPAL_REST_BASE_URL}/jsonapi/media/image/field_media_image`;

    const fileUploadResponse = await fetch(fileUploadUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${file.name}"`,
        Authorization: `Bearer ${userToken}`,
      },
      body: fileBuffer,
    });

    if (!fileUploadResponse.ok) {
      console.error('File upload failed:', await fileUploadResponse.text());
      return {
        success: false,
        message: 'File upload failed',
      };
    }

    // Get the created file entity data from the response
    const fileResult = await fileUploadResponse.json();
    const fileUuid = fileResult.data.id;

    // Step 2: Create a media entity that references this file
    const mediaData = {
      data: {
        type: 'media--image',
        attributes: {
          name: name,
          status: true,
        },
        relationships: {
          field_media_image: {
            data: {
              type: 'file--file',
              id: fileUuid,
              meta: {
                alt: alt || name,
              },
            },
          },
        },
      },
    };

    const mediaResponse = await fetch(
      `${process.env.NEXT_PUBLIC_DRUPAL_REST_BASE_URL}/jsonapi/media/image`,
      {
        method: 'POST',
        body: JSON.stringify(mediaData),
        headers: {
          'Content-Type': 'application/vnd.api+json',
          Accept: 'application/vnd.api+json',
          Authorization: `Bearer ${userToken}`,
        },
      }
    );

    if (!mediaResponse.ok) {
      console.error(
        'Media entity creation failed:',
        await mediaResponse.text()
      );
      return {
        success: false,
        message: 'Media entity creation failed',
      };
    }

    const mediaResult = await mediaResponse.json();

    return {
      success: true,
      message: 'Image uploaded successfully',
      data: mediaResult.data,
    };
  } catch (error) {
    console.error('Error uploading image media:', error);
    return {
      success: false,
      message: 'An unexpected error occurred',
    };
  }
}

/**
 * Creates a remote video media entity in Drupal
 */
export async function uploadRemoteVideoMedia(
  formData: FormData
): Promise<MediaUploadResponse> {
  const videoUrl = formData.get('videoUrl') as string;
  const name = formData.get('name') as string;

  // Get the auth token
  const userToken = await getAuthToken();

  if (!userToken) {
    return {
      success: false,
      message: 'Authentication required',
    };
  }

  if (!videoUrl) {
    return {
      success: false,
      message: 'No video URL provided',
    };
  }

  try {
    // Create a media entity for remote video
    const mediaData = {
      data: {
        type: 'media--remote_video',
        attributes: {
          name: name,
          status: true,
          field_media_oembed_video: videoUrl,
        },
      },
    };

    const mediaResponse = await fetch(
      `${process.env.NEXT_PUBLIC_DRUPAL_REST_BASE_URL}/jsonapi/media/remote_video`,
      {
        method: 'POST',
        body: JSON.stringify(mediaData),
        headers: {
          'Content-Type': 'application/vnd.api+json',
          Accept: 'application/vnd.api+json',
          Authorization: `Bearer ${userToken}`,
        },
      }
    );

    if (!mediaResponse.ok) {
      console.error(
        'Remote video entity creation failed:',
        await mediaResponse.text()
      );
      return {
        success: false,
        message: 'Remote video entity creation failed',
      };
    }

    const mediaResult = await mediaResponse.json();

    return {
      success: true,
      message: 'Remote video added successfully',
      data: mediaResult.data,
    };
  } catch (error) {
    console.error('Error adding remote video:', error);
    return {
      success: false,
      message: 'An unexpected error occurred',
    };
  }
}
