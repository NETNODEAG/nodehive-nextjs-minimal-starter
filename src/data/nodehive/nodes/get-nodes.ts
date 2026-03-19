import { createServerClient } from '@/lib/nodehive-client';

export async function getNodes(type: string, lang: string) {
  try {
    const client = await createServerClient();
    const nodes = await client.getNodes(type, { lang });
    return nodes;
  } catch (error) {
    console.error('Error fetching nodes:', error);
    return null;
  }
}
