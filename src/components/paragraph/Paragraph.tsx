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

  return null;
}
