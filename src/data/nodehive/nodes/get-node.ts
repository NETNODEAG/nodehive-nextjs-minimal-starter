import { i18n } from '@/config/i18n-config';
import { createServerClient } from '@/lib/nodehive-client';

export async function getNode(id: string, type: string, lang: string) {
  const isMultilingual = i18n.isMultilingual;
  try {
    const client = await createServerClient();
    const node = await client.getNode(id, type, {
      lang: isMultilingual ? lang : undefined,
    });
    return node;
  } catch (error) {
    console.error('Error fetching node:', error);
    return null;
  }
}
