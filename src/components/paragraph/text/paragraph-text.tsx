import Image from 'next/image';
import { DrupalParagraph } from '@/nodehive/types';

import { FormattedText } from '@/components/layout/formatted-text';

export interface ParagraphTextProps {
  paragraph: DrupalParagraph;
}

export default function ParagraphText({ paragraph }: ParagraphTextProps) {
  const byline = paragraph?.field_byline;
  const title = paragraph?.field_title;
  const text = paragraph?.field_text;
  const image = paragraph?.field_image;
  const imageUrl =
    paragraph.field_image[0]?.field_media_image?.image_style_uri?.large;

  return (
    <section
      data-paragraph-type="Text"
      className="grid grid-cols-2 gap-2 rounded-lg border p-8"
    >
      <div>
        {byline && <h2 className="text-xl">{byline}</h2>}

        <h2 className="mb-4 mt-2 text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl">
          {title}
        </h2>

        {text && (
          <FormattedText html={text?.processed} className="prose max-w-prose" />
        )}
      </div>

      {imageUrl && (
        <div className="max-w-xs px-2.5 lg:max-w-none">
          <Image
            src={imageUrl}
            priority={true}
            alt=""
            width={300}
            height={300}
            sizes="(min-width: 1024px) 32rem, 20rem"
            className="aspect-square rounded-2xl bg-zinc-100 object-cover dark:bg-zinc-800"
          />
        </div>
      )}
    </section>
  );
}
