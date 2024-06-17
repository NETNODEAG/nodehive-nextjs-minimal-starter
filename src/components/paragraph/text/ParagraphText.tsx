import { DrupalParagraph } from '@/nodehive/types';

export interface ParagraphTextProps {
  paragraph: DrupalParagraph;
}

export default function ParagraphText({ paragraph }: ParagraphTextProps) {
  return (
    <section data-paragraph-type="Text" className="rounded-lg border p-4">
      <h2>Paragraph Text</h2>
    </section>
  );
}
