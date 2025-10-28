import Image from 'next/image';
import Link from 'next/link';
import { User } from 'lucide-react';

import { getUser } from '@/lib/auth';
import { cn } from '@/lib/utils';

export default async function UserProfile() {
  const user = await getUser();

  return (
    <Link
      href="/nodehive/account"
      className={cn(
        'flex h-[32px] w-[32px] cursor-pointer items-center justify-center rounded-full border border-neutral-700 text-white transition-colors hover:border-neutral-700 hover:bg-neutral-700'
      )}
    >
      <span>
        <span className="sr-only">User Profile</span>

        {user?.user_picture[0]?.url ? (
          <Image
            src={user?.user_picture[0]?.url}
            alt="User Profile"
            width={24}
            height={24}
            className="rounded-full"
          />
        ) : (
          <User className="h-5 w-5" />
        )}
      </span>
    </Link>
  );
}
