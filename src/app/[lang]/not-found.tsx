import Link from 'next/link';

import { H1 } from '@/components/theme/atoms-content/heading/heading';

export default function NotFound() {
  return (
    <section className="space-y-8">
      <H1>404 - Page Not Found</H1>

      <p>
        The page you are looking for might have been removed, had its name
        changed, or is temporarily unavailable.
      </p>

      <Link href="/" className="btn-primary">
        Go Back Home
      </Link>
    </section>
  );
}
