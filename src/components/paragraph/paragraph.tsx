import { ErrorBoundary } from 'react-error-boundary';

import { DrupalParagraph } from '@/types/nodehive';
import VisualEditorParagraphWrapper from '@/components/nodehive/visual-editor/paragraph/paragraph-wrapper';
import { isParagraphType, paragraphTypes } from './paragraphs';

interface ParagraphProps {
  paragraph: DrupalParagraph;
}

export default function Paragraph({ paragraph }: ParagraphProps) {
  const paragraphType = paragraph?.type;

  if (isParagraphType(paragraphType)) {
    const ParagraphInstance = paragraphTypes[paragraphType];
    return (
      <VisualEditorParagraphWrapper entity={paragraph}>
        <ErrorBoundary
          fallback={
            <div>
              Error loading paragraph: {paragraphType}{' '}
              <pre className="mt-8">{JSON.stringify(paragraph, null, 2)}</pre>
            </div>
          }
        >
          <ParagraphInstance paragraph={paragraph} />
        </ErrorBoundary>
      </VisualEditorParagraphWrapper>
    );
  }

  return (
    <section data-paragraph-type="Unknown">
      <h2>Unknown paragraph type: {paragraphType}</h2>

      <details className="container mx-auto mt-2 rounded-md bg-black p-4 text-xs text-slate-50">
        <summary className="cursor-pointer font-bold">
          Paragraph API:JSON Output
        </summary>
        <pre className="mt-8">{JSON.stringify(paragraph, null, 2)}</pre>
      </details>
    </section>
  );
}
