import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="space-y-8">
      <h1>404 - Page Not Found</h1>

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
