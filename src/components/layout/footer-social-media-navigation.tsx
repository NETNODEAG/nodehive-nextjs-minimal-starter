import Link from 'next/link';
import { createServerClient } from '@/nodehive/client';
import MenuWrapper from '@/nodehive/components/visual-editor/menu/menu-wrapper';

import { InstagramIcon, TwitterIcon, YoutubeIcon } from '@/lib/icons';

const socialMediaIcons = {
  youtube: <YoutubeIcon />,
  instagram: <InstagramIcon />,
  twitter: <TwitterIcon />,
};

interface Props {
  menuId: string;
}

export default async function SocialMediaNavigation({ menuId }: Props) {
  const client = createServerClient();

  const navigation = await client.getMenuItems(menuId);

  if (!navigation?.data?.length) {
    return null;
  }

  return (
    <MenuWrapper menuId={menuId} negative={true}>
      <nav>
        <ul className="flex gap-4">
          {navigation?.data?.map((item) => {
            const socialClass = item?.options?.attributes?.class[0];
            const icon = socialMediaIcons[socialClass];

            return (
              <li key={item.id}>
                <Link
                  href={item.url}
                  target="_blank"
                  className="block text-2xl text-white"
                >
                  <span className="sr-only">{item.title}</span>
                  {icon}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </MenuWrapper>
  );
}
