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
let debugServiceClient: NodeHiveClient | null = null;

type ClientOptions = {
  debug?: boolean;
};

export const createServerClient = cache(async () => {
  const storage = new NextCookieStorage();
  const token = await storage.get('token');

  if (token) {
    return createUserClient({ debug: true });
  }

  return createServiceClient({ debug: true });
});

export const createUserClient = (options: ClientOptions = {}) => {
  const storage = new NextCookieStorage();
  const debug = options.debug ?? baseOptions.debug;
  const userOauthConfig = {
    grantType: 'password' as const,
    clientId: process.env.NODEHIVE_OAUTH_USER_CLIENT_ID || '',
    clientSecret: process.env.NODEHIVE_OAUTH_USER_CLIENT_SECRET || '',
    ...(process.env.NODEHIVE_OAUTH_USER_SCOPE
      ? { scope: process.env.NODEHIVE_OAUTH_USER_SCOPE }
      : {}),
  };

  const userClient = new NodeHiveClient({
    ...baseOptions,
    debug,
    auth: {
      method: 'oauth',
      oauth: userOauthConfig,
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

export const createServiceClient = (options: ClientOptions = {}) => {
  const debug = options.debug ?? baseOptions.debug;
  const cachedClient = debug ? debugServiceClient : serviceClient;

  if (cachedClient) {
    console.log(`Used existing service client`);
    return cachedClient;
  }

  const client = new NodeHiveClient({
    ...baseOptions,
    debug,
    auth: {
      method: 'oauth',
      oauth: {
        grantType: 'client_credentials',
        clientId: process.env.NODEHIVE_OAUTH_FRONTEND_CLIENT_ID || '',
        clientSecret: process.env.NODEHIVE_OAUTH_FRONTEND_CLIENT_SECRET || '',
      },
    },
  });

  if (debug) {
    debugServiceClient = client;
  } else {
    serviceClient = client;
  }

  console.log('Created service client');
  return client;
};
