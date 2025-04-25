import { DrupalNode, DrupalParagraph } from '@/nodehive/types';

import Paragraph from '@/components/paragraph/Paragraph';

export interface NodePageProps {
  node: DrupalNode;
}

export default function NodePage({ node }: NodePageProps) {
  const title = node?.title;
  const paragraphs = node?.field_paragraphs;

  return (
    <article data-node-type="Page">
      <h1 className="mb-16 text-4xl font-bold sm:text-6xl">{title}</h1>

      {Array.isArray(paragraphs) && (
        <div className="space-y-16">
          {paragraphs?.map((paragraph: DrupalParagraph) => {
            return <Paragraph key={paragraph.id} paragraph={paragraph} />;
          })}
        </div>
      )}

      <details className="container mx-auto mt-10 mb-10 rounded-md bg-black p-4 text-xs text-slate-50">
        <summary className="cursor-pointer font-bold">
          Node API JSON Output
        </summary>
        <pre className="mt-8">{JSON.stringify(node, null, 2)}</pre>
      </details>
    </article>
  );
}
