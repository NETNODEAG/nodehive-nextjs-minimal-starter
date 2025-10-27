import { DrupalFragment } from '@/nodehive/types';

import BodyCopy from '@/components/theme/atoms-content/body-copy/body-copy';

interface FragmentTextProps {
  fragment: DrupalFragment;
}

export default function FragmentText({ fragment }: FragmentTextProps) {
  const text = fragment?.field_text_content;

  return <BodyCopy>{text?.processed}</BodyCopy>;
}
