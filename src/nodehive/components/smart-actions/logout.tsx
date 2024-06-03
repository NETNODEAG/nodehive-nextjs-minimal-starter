'use client';

import { logout } from '@/actions/_auth';
import { useFormStatus } from 'react-dom';

import { cn } from '@/lib/utils';

export default function Logout() {
  return (
    <form action={logout}>
      <LogoutButton />
    </form>
  );
}

function LogoutButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className={cn(
        'flex h-[32px] w-[32px] items-center justify-center rounded-full text-white transition-colors hover:bg-neutral-700',
        pending ? 'text-neutral-900/50' : 'cursor-pointer'
      )}
    >
      <span className="sr-only">Logout</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1}
        stroke="currentColor"
        className="h-6 w-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
        />
      </svg>
    </button>
  );
}
