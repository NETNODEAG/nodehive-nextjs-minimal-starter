import Link from 'next/link';

import Container from '@/components/theme/atoms-layout/container/container';

export default function Forbidden() {
  return (
    <Container className="py-16">
      <section className="space-y-8">
        <h1>403 - Forbidden</h1>

        <p>You do not have permission to access this resource.</p>

        <Link href="/" className="btn-primary">
          Go Back Home
        </Link>
      </section>
    </Container>
  );
}
