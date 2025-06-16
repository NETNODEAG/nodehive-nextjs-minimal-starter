import { getAuthToken } from '@/nodehive/auth';
import { NodeHiveConfig } from '@/nodehive/jsonapi-config';
import { NodeHiveClient, NodeHiveOptions } from 'nodehive-js';

export const createServerClient = async () => {
  let options: NodeHiveOptions = {
    // Set to true to enable debug mode. Debug mode will log all requests and responses to the console.
    debug: false,
  };

  const authToken = await getAuthToken();

  if (authToken) {
    options.token = authToken;
  }

  const nodehiveClient = new NodeHiveClient(
    process.env.NEXT_PUBLIC_DRUPAL_REST_BASE_URL,
    NodeHiveConfig,
    options
  );

  return nodehiveClient;
};
