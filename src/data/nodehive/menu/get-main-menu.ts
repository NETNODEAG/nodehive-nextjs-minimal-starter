import { i18n, Locale } from '@/config/i18n-config';
import { createServerClient } from '@/lib/nodehive-client';

export async function getMainMenu(menuId: string, lang: Locale) {
  const client = await createServerClient();

  const isMultilingual = i18n.isMultilingual;
  try {
    const navigation = await client.getMenuTree(menuId, {
      lang: isMultilingual ? lang : undefined,
    });
    return navigation;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Error fetching menu with ID ${menuId}: ${message}`);
    return null;
  }
}
