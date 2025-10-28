'use client';

import { logout } from '@/data/nodehive/auth/server';
import { LogOut } from 'lucide-react';
import { useFormStatus } from 'react-dom';

import { cn } from '@/lib/utils';

export default function LogoutForm() {
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
      <LogOut className="h-5 w-5" />
    </button>
  );
}
