import { AuthWrapper } from '@/nodehive/components/auth/auth-wrapper';
import NodeEditButton from '@/nodehive/components/visual-editor/node/node-edit-button';
import { DrupalNode, DrupalParagraph } from '@/nodehive/types';

import Paragraph from '@/components/paragraph/Paragraph';

export interface NodePageProps {
  node: DrupalNode;
}

export default function NodePage({ node }: NodePageProps) {
  const nodeData = node?.data;
  const title = nodeData?.title;
  const paragraphs = nodeData?.field_paragraphs;

  return (
    <article data-node-type="Page">
      <AuthWrapper>
        <NodeEditButton node={node} />
      </AuthWrapper>

      <h1 className="mb-16 text-4xl font-bold sm:text-6xl">{title}</h1>

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
