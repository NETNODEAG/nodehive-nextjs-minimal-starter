import { createServerClient } from '@/nodehive/client';
import MenuWrapper from '@/nodehive/components/visual-editor/menu/menu-wrapper';

import FlyoutNavigation from './flyout-navigation';
import TwoLevelMenu from './two-level-menu';

interface Props {
  menuId: string;
}

export default async function HeaderNavigation({ menuId }: Props) {
  const client = createServerClient();

  const navigation = (await client.getMenuItems(menuId)) as any;

  const mainNavigation = navigation?.data?.reduce((acc, item) => {
    if (item.parent === '') {
      // This is a parent menu item
      acc[item.id] = { ...item, subMenu: [] };
    } else if (acc[item.parent]) {
      // This is a submenu item for an existing parent
      acc[item.parent].subMenu.push(item);
    }
    return acc;
  }, {});

  if (!navigation?.data?.length) {
    return null;
  }

  return (
    <MenuWrapper menuId={menuId}>
      <TwoLevelMenu menu={mainNavigation} />
      <FlyoutNavigation menu={mainNavigation} />
    </MenuWrapper>
  );
}
