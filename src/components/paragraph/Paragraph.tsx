import VisualEditorParagraphWrapper from '@/nodehive/components/visual-editor/paragraph/paragraph-wrapper';
import { DrupalParagraph } from '@/nodehive/types';

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
        <ParagraphInstance paragraph={paragraph} />
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
