import Image from 'next/image';
import { getUser } from '@/nodehive/auth';
import { User } from 'lucide-react';

import { cn } from '@/lib/utils';

export default async function UserProfile() {
  const user = await getUser();

  return (
    <div
      className={cn(
        'flex h-[32px] w-[32px] cursor-default items-center justify-center rounded-full border border-neutral-700 text-white transition-colors hover:border-neutral-700 hover:bg-neutral-700'
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
    </div>
  );
}
