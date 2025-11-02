import { DrupalNode, DrupalParagraph } from '@/types/nodehive';
import Paragraph from '@/components/drupal/paragraph/paragraph';
import { H1 } from '@/components/theme/atoms-content/heading/heading';
import Container from '@/components/theme/atoms-layout/container/container';
import Debug from '@/components/ui/atoms/debug/debug';

export interface NodePageProps {
  node: DrupalNode;
}

export default function NodePage({ node }: NodePageProps) {
  const title = node?.title;
  const paragraphs = node?.field_paragraphs;

  return (
    <article data-node-type="page" className="py-16">
      <Container>
        <H1>{title}</H1>
        <Debug data={node} />

        {Array.isArray(paragraphs) && (
          <div className="space-y-16">
            {paragraphs?.map((paragraph: DrupalParagraph) => {
              return <Paragraph key={paragraph.id} paragraph={paragraph} />;
            })}
          </div>
        )}
      </Container>
    </article>
  );
}
