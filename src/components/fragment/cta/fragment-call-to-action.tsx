import Link from 'next/link';
import { DrupalFragment } from '@/nodehive/types';

import { internalLinkUriToSlug } from '@/lib/utils';

interface FragmentCallToActionProps {
  fragment: DrupalFragment;
}

export default function FragmentCallToAction({
  fragment,
}: FragmentCallToActionProps) {
  const cta = fragment?.field_cta_link;
  const ctaUrl = internalLinkUriToSlug(cta?.uri);
  const ctaLabel = cta?.title;

  if (!ctaUrl || !ctaLabel) return null;

  return (
    <div className="flex justify-center">
      <Link
        href={ctaUrl}
        className="btn btn-primary"
        target={ctaUrl.startsWith('http') ? '_blank' : '_self'}
        rel={ctaUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
      >
        {ctaLabel}
      </Link>
    </div>
  );
}
