import { cache } from 'react';
import { NodeHiveClient } from 'nodehive-js';

import { NodeHiveConfig } from '@/config/jsonapi-config';
import { NextCookieStorage } from '@/lib/next-cookie-storage';

const baseOptions = {
  baseUrl: process.env.NEXT_PUBLIC_DRUPAL_REST_BASE_URL || '',
  debug: false,
  config: NodeHiveConfig,
};

let serviceClient: NodeHiveClient | null = null;

export const createServerClient = cache(async () => {
  const storage = new NextCookieStorage();
  const token = await storage.get('token');

  if (token) {
    return createUserClient();
  }

  return createServiceClient();
});

export const createUserClient = () => {
  const storage = new NextCookieStorage();
  const userClient = new NodeHiveClient({
    ...baseOptions,
    auth: {
      method: 'oauth',
      oauth: {
        grantType: 'password',
        clientId: process.env.NODEHIVE_OAUTH_USER_CLIENT_ID || '',
        clientSecret: process.env.NODEHIVE_OAUTH_USER_CLIENT_SECRET || '',
      },
      storage: {
        type: 'custom',
        adapter: storage,
      },
      session: {
        refreshTokenMaxAge: 2592000, // 30 days
      },
    },
  });
  console.log(`Created user client`);
  return userClient;
};

export const createServiceClient = () => {
  if (serviceClient) {
    console.log(`Used existing service client`);
    return serviceClient;
  }

  serviceClient = new NodeHiveClient({
    ...baseOptions,
    auth: {
      method: 'oauth',
      oauth: {
        grantType: 'client_credentials',
        clientId: process.env.NODEHIVE_OAUTH_FRONTEND_CLIENT_ID || '',
        clientSecret: process.env.NODEHIVE_OAUTH_FRONTEND_CLIENT_SECRET || '',
      },
    },
  });
  console.log('Created service client');
  return serviceClient;
};
