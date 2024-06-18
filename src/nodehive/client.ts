import { cookies } from 'next/headers';
import { NodeHiveConfig } from '@/nodehive/jsonapi-config';
import { NodeHiveClient, NodeHiveOptions } from 'nodehive-js';

export const cookieUserToken = `${process.env.NEXT_PUBLIC_NODEHIVE_SPACE_NAME}_user-token`;
export const cookieUser = `${process.env.NEXT_PUBLIC_NODEHIVE_SPACE_NAME}_user`;

export const createServerClient = () => {
  let options: NodeHiveOptions = {
    // Set to true to enable debug mode. Debug mode will log all requests and responses to the console.
    debug: false,
  };

  const hasUserToken = cookies().has(cookieUserToken);
  const userToken = cookies().get(cookieUserToken)?.value;

  if (hasUserToken) {
    options.token = userToken;
  }

  const nodehiveClient = new NodeHiveClient(
    process.env.NEXT_PUBLIC_DRUPAL_REST_BASE_URL,
    NodeHiveConfig,
    options
  );

  return nodehiveClient;
};
