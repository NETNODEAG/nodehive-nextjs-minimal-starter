import { ErrorBoundary } from 'react-error-boundary';

import { DrupalFragment } from '@/types/nodehive';
import VisualEditorFragmentWrapper from '@/components/nodehive/visual-editor/fragment/fragment-wrapper';
import { fragmentTypes, isFragmentType } from './fragments';

interface FragmentProps {
  fragment: DrupalFragment;
}

export default function Fragment({ fragment }: FragmentProps) {
  const fragmentType = fragment?.type;

  if (!isFragmentType(fragmentType)) {
    return null;
  }

  const FragmentInstance = fragmentTypes[fragmentType];
  return (
    <VisualEditorFragmentWrapper entity={fragment}>
      <ErrorBoundary
        fallback={
          <div>
            Error loading fragment: {fragmentType}{' '}
            <pre className="mt-8">{JSON.stringify(fragment, null, 2)}</pre>
          </div>
        }
      >
        <FragmentInstance fragment={fragment} />
      </ErrorBoundary>
    </VisualEditorFragmentWrapper>
  );
}
