'use client';

import { subscribe, SubscribeState } from '@/actions/_newsletter';
import { DrupalParagraph } from '@/nodehive/types';
import { useFormState, useFormStatus } from 'react-dom';

import { cn } from '@/lib/utils';

export interface ParagraphNewsletterProps {
  paragraph: DrupalParagraph;
}

export default function ParagraphNewsletter({
  paragraph,
}: ParagraphNewsletterProps) {
  const title = paragraph?.field_title;

  const initialState: SubscribeState = {} as SubscribeState;
  const [state, dispatch] = useFormState(subscribe, initialState);

  return (
    <section data-paragraph-type="Newsletter" className="rounded-lg border p-8">
      <h2 className="mb-4 mt-2 text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl">
        {title}
      </h2>

      <form action={dispatch} className="space-y-4">
        <div className="flex flex-col gap-4 md:flex-row">
          <div>
            <label htmlFor="email-address" className="sr-only">
              Email address
            </label>

            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="Enter your email"
              className="rounded-md"
            />
          </div>

          <SubmitButton />
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
      </form>
    </section>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button disabled={pending} className="btn btn-primary">
      {pending ? 'Submitting...' : 'Signup'}
    </button>
  );
}
