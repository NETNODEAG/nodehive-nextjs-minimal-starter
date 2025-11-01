import { NodeHiveClient, StorageAdapter } from 'nodehive-js';

import { NextCookieStorage } from '@/lib/next-cookie-storage';

const baseOptions = {
  baseUrl: process.env.NEXT_PUBLIC_DRUPAL_REST_BASE_URL || '',
  debug: false,
};

const buildServiceClient = () => {
  return new NodeHiveClient({
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
};

const buildUserClient = (storage: StorageAdapter) => {
  return new NodeHiveClient({
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
};

export const resolveNodehiveClient = async () => {
  const storage = new NextCookieStorage();
  const token = await storage.get('token');

  if (!token) {
    return { client: buildServiceClient(), authType: 'service' as const };
  }

  return { client: buildUserClient(storage), authType: 'user' as const };
};

export const createServerClient = async () => {
  const { client, authType } = await resolveNodehiveClient();
  console.log(`NodeHive: created server client with auth type '${authType}'`);
  return client;
};

export const createUserClient = () => {
  const storage = new NextCookieStorage();
  return buildUserClient(storage);
};

export const createServiceClient = () => buildServiceClient();
