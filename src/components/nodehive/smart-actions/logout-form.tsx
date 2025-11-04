'use client';

import { ButtonHTMLAttributes, ClassAttributes, useActionState } from 'react';
import { JSX } from 'react/jsx-runtime';
import { logout } from '@/data/nodehive/auth/actions';
import { LogOut } from 'lucide-react';

import { cn } from '@/lib/utils';

export default function LogoutForm(
  props: JSX.IntrinsicAttributes &
    ClassAttributes<HTMLButtonElement> &
    ButtonHTMLAttributes<HTMLButtonElement>
) {
  const [state, dispatch, isPending] = useActionState(logout, undefined);
  return (
    <form action={dispatch}>
      <button
        {...props}
        type="submit"
        className={cn(
          'flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-white transition-colors hover:bg-neutral-700',
          {
            'cursor-auto text-slate-200': isPending,
          }
        )}
      >
        <span className="sr-only">Logout</span>
        <LogOut className="h-5 w-5" />
      </button>
    </form>
  );
}
