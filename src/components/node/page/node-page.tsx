import { DrupalNode, DrupalParagraph } from '@/types/nodehive';
import Paragraph from '@/components/paragraph/paragraph';
import Debug from '@/components/ui/atoms/debug/debug';

export interface NodePageProps {
  node: DrupalNode;
}

export default function NodePage({ node }: NodePageProps) {
  const title = node?.title;
  const paragraphs = node?.field_paragraphs;

  return (
    <article data-node-type="page">
      <h1 className="mb-16 text-4xl font-bold sm:text-6xl">{title}</h1>
      <Debug data={node} />

      {Array.isArray(paragraphs) && (
        <div className="space-y-16">
          {paragraphs?.map((paragraph: DrupalParagraph) => {
            return <Paragraph key={paragraph.id} paragraph={paragraph} />;
          })}
        </div>
      )}
    </article>
  );
}
