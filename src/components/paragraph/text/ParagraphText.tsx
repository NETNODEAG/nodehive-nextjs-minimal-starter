import { DrupalParagraph } from '@/nodehive/types';

export interface ParagraphTextProps {
  paragraph: DrupalParagraph;
}

export default function ParagraphText({ paragraph }: ParagraphTextProps) {
  return (
    <section
      data-paragraph-type="Text"
      className="grid grid-cols-2 gap-2 rounded-lg border p-8"
    >
      <h2>Paragraph Text</h2>
    </section>
  );
}
