import { getAuthToken } from '@/nodehive/auth';
import { NodeHiveConfig } from '@/nodehive/jsonapi-config';
import { NodeHiveClient, NodeHiveOptions } from 'nodehive-js';

export const createServerClient = async () => {
  const baseUrl = process.env.NEXT_PUBLIC_DRUPAL_REST_BASE_URL;
  const authToken = await getAuthToken();
  let options: NodeHiveOptions = {
    // Set to true to enable debug mode. Debug mode will log all requests and responses to the console.
    debug: false,
  };

  if (authToken) {
    options.token = authToken;
  }

  if (!baseUrl) {
    throw new Error('NEXT_PUBLIC_DRUPAL_REST_BASE_URL is not defined');
  }

  const nodehiveClient = new NodeHiveClient(baseUrl, NodeHiveConfig, options);

  return nodehiveClient;
};
