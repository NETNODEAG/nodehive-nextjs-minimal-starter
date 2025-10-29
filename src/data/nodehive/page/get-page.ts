import { i18n } from '@/config/i18n-config';
import { createServerClient } from '@/lib/nodehive-client';

export default async function getPage(path: string, lang: string) {
  const isMultilingual = i18n.isMultilingual;
  const client = await createServerClient();

  try {
    const entity = await client.getResourceBySlug(path, {
      lang: isMultilingual ? lang : undefined,
    });
    return entity;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Error fetching page with path ${path}: ${message}`);
    return null;
  }
}
