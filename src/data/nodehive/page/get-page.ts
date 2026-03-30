import { createServerClient } from '@/lib/nodehive-client';

export default async function getPage(path: string, lang: string) {
  const client = await createServerClient();

  try {
    const entity = await client.getResourceBySlug(path, { lang });
    return entity;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Error fetching page with path ${path}: ${message}`);
    return null;
  }
}
