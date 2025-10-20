import { DrupalFragment } from '@/nodehive/types';
import { ErrorBoundary } from 'react-error-boundary';

import VisualEditorFragmentWrapper from '@/components/nodehive/visual-editor/fragment/FragmentWrapper';
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

  return null;
}
