import { i18n } from '@/config/i18n-config';
import { createServerClient } from '@/lib/nodehive-client';

export async function getNodes(type: string, lang: string) {
  const isMultilingual = i18n.isMultilingual;
  try {
    const client = await createServerClient();
    const nodes = await client.getNodes(type, {
      lang: isMultilingual ? lang : undefined,
    });
    return nodes;
  } catch (error) {
    console.error('Error fetching nodes:', error);
    return null;
  }
}
