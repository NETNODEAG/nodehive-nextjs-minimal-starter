import { FunctionComponent } from 'react';

import ParagraphText, { ParagraphTextProps } from './text/ParagraphText';

interface ParagraphPropMap {
  'paragraph--text': ParagraphTextProps;
}

type ParagraphTypes = {
  [K in keyof ParagraphPropMap]: FunctionComponent<ParagraphPropMap[K]>;
};

export function isParagraphType(key: string): key is keyof ParagraphTypes {
  return key in paragraphTypes;
}

export const paragraphTypes: ParagraphTypes = {
  'paragraph--text': ParagraphText,
};
