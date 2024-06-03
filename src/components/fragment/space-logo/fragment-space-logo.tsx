import Image from 'next/image';
import Link from 'next/link';
import { DrupalFragment } from '@/nodehive/types';

import { Logo } from '@/lib/icons';
import { absoluteUrl } from '@/lib/utils';

interface FragmentSpaceLogoProps {
  fragment: DrupalFragment;
}

export default async function FragmentSpaceLogo({
  fragment,
}: FragmentSpaceLogoProps) {
  const logo = fragment?.field_logo;

  return (
    <Link href="/" className="block">
      {logo?.uri?.url ? (
        <Image
          src={absoluteUrl(logo?.uri?.url)}
          alt={logo?.filename}
          width={160}
          height={160}
          className="max-h-[29px] w-auto"
        />
      ) : (
        <Logo className="h-[29px] max-w-[160px]" />
      )}
    </Link>
  );
}
