import { createServerClient } from '@/lib/nodehive-client';

export async function getNode(id: string, type: string, lang: string) {
  try {
    const client = await createServerClient();
    const node = await client.getNode(id, type, { lang });
    return node;
  } catch (error) {
    console.error('Error fetching node:', error);
    return null;
  }
}
