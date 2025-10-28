import { NodeHiveClient, NodeHiveOptions } from 'nodehive-js';

import { i18n } from '@/config/i18n-config';

export const createServerClient = async () => {
  const baseUrl = process.env.NEXT_PUBLIC_DRUPAL_REST_BASE_URL;
  if (!baseUrl) {
    throw new Error('NEXT_PUBLIC_DRUPAL_REST_BASE_URL is not defined');
  }

  const options: NodeHiveOptions = {
    baseUrl,
    defaultLanguage: i18n.defaultLocale,
    debug: true,
    auth: {
      method: 'oauth',
      oauth: {
        grantType: 'client_credentials',
        clientId: process.env.NODEHIVE_OAUTH_FRONTEND_CLIENT_ID || '',
        clientSecret: process.env.NODEHIVE_OAUTH_FRONTEND_CLIENT_SECRET || '',
      },
    },
  };

  const nodehiveClient = new NodeHiveClient(options);

  return nodehiveClient;
};
