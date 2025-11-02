import CallToAction from '@/components/theme/atoms-content/call-to-action/call-to-action';
import { H1 } from '@/components/theme/atoms-content/heading/heading';
import Container from '@/components/theme/atoms-layout/container/container';

export default function NotFound() {
  return (
    <Container className="py-16">
      <section className="space-y-8">
        <H1>404 - Page Not Found</H1>

        <p>
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>

        <CallToAction href="/" variant={'button'}>
          Go Back Home
        </CallToAction>
      </section>
    </Container>
  );
}
