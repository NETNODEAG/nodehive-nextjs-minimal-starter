import Image from 'next/image';
import { readUserDetails } from '@/actions/_user';

import { cn } from '@/lib/utils';

export default async function UserProfile() {
  const user = await readUserDetails();

  return (
    <button
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
            width={32}
            height={32}
            className="rounded-full"
          />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        )}
      </span>
    </button>
  );
}
