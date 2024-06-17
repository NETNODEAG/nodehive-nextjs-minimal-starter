import { DrupalFragment } from '@/nodehive/types';

import { FormattedText } from '@/components/layout/FormattedText';

interface FragmentTextProps {
  fragment: DrupalFragment;
}

export default function FragmentText({ fragment }: FragmentTextProps) {
  const text = fragment?.field_text_content;

  return <FormattedText html={text?.processed} className="prose" />;
}
