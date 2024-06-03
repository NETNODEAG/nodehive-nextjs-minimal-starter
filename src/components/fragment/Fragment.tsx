import VisualEditorFragmentWrapper from '@/nodehive/components/visual-editor/fragment/fragment-wrapper';
import { DrupalFragment } from '@/nodehive/types';

import { fragmentTypes, isFragmentType } from './fragments';

interface FragmentProps {
  fragment: DrupalFragment;
}

export default function Fragment({ fragment }: FragmentProps) {
  const fragmentType = fragment?.type;

  if (isFragmentType(fragmentType)) {
    const FragmentInstance = fragmentTypes[fragmentType];
    return (
      <VisualEditorFragmentWrapper entity={fragment}>
        <FragmentInstance fragment={fragment} />
      </VisualEditorFragmentWrapper>
    );
  }

  return null;
}
