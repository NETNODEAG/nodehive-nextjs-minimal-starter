'use client';

import { useActionState } from 'react';
import { login, LoginState } from '@/data/nodehive/auth/actions';
import { Loader2Icon } from 'lucide-react';

import { cn } from '@/lib/utils';
import Button from '@/components/ui/atoms/button/button';

const initialState: LoginState = {};

export default function LoginForm() {
  const [state, dispatch, isPending] = useActionState(login, initialState);

  return (
    <section>
      <form action={dispatch} className="space-y-6">
        <div className="flex flex-col">
          <label htmlFor="email" className="text-sm font-bold">
            Email
          </label>

          <input type="text" name="email" id="email" className="rounded-md" />
        </div>

        <div className="flex flex-col">
          <label htmlFor="password" className="text-sm font-bold">
            Password
          </label>

          <input
            type="password"
            name="password"
            id="password"
            className="rounded-md"
          />
        </div>

        {state?.message?.text && (
          <div
            className={cn(
              'rounded-md p-4 text-xs',
              state.message.type === 'error' ? 'bg-red-100' : 'bg-green-100'
            )}
          >
            <h4 className="mb-2 font-bold">{state.message.title}</h4>
            <p>{state.message.text}</p>
          </div>
        )}

        <LoginButton isPending={isPending} />
      </form>
    </section>
  );
}

function LoginButton({ isPending }: { isPending: boolean }) {
  return (
    <Button type="submit">
      {isPending && <Loader2Icon className="mr-1.5 h-4 w-4 animate-spin" />}
      <span>Login</span>
    </Button>
  );
}
