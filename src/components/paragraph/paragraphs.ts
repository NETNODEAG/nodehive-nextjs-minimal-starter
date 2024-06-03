import { FunctionComponent } from 'react';

import ParagraphNewsletter, {
  ParagraphNewsletterProps,
} from './newsletter/paragraph-newsletter';
import ParagraphText, { ParagraphTextProps } from './text/paragraph-text';

interface ParagraphPropMap {
  'paragraph--text': ParagraphTextProps;
  'paragraph--newsletter': ParagraphNewsletterProps;
}

type ParagraphTypes = {
  [K in keyof ParagraphPropMap]: FunctionComponent<ParagraphPropMap[K]>;
};

export function isParagraphType(key: string): key is keyof ParagraphTypes {
  return key in paragraphTypes;
}

export const paragraphTypes: ParagraphTypes = {
  'paragraph--text': ParagraphText,
  'paragraph--newsletter': ParagraphNewsletter,
};
