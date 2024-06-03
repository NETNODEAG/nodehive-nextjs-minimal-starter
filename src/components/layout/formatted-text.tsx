import { HTMLAttributes } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import parse, {
  DOMNode,
  domToReact,
  Element,
  HTMLReactParserOptions,
} from 'html-react-parser';

import { cn, isRelative } from '@/lib/utils';

const isElement = (domNode: DOMNode): domNode is Element =>
  domNode.type === 'tag';

const options: HTMLReactParserOptions = {
  /*
   * If `undefined` is returned from this `replace` function, nothing is changed and the given DOMNode is rendered as usual.
   * But if anything else is returned, that value replaces the original value.
   * For example, return `null` to remove it, or some other component to replace it.
   */
  replace: (domNode) => {
    if (!isElement(domNode)) return;

    switch (domNode.name) {
      case 'img': {
        const { src, alt, width = 100, height = 100 } = domNode.attribs;

        const numberWidth = Number(width);
        const numberHeight = Number(height);

        if (isRelative(src)) {
          return (
            <Image
              src={`${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}${src}`}
              width={numberWidth}
              height={numberHeight}
              alt={alt}
              className={`block max-w-full ${domNode.attribs.class}`}
            />
          );
        }
        break;
      }

      case 'a': {
        const { href, target } = domNode.attribs;
        const styles = domNode.attribs.class;

        if (href && isRelative(href)) {
          return (
            <Link
              href={href}
              target={target}
              className={cn(styles && styles, 'link')}
            >
              {domToReact(domNode.children as DOMNode[], options)}
            </Link>
          );
        }
        break;
      }

      default: {
        return undefined;
      }
    }
  },
};

interface FormattedTextProps extends HTMLAttributes<HTMLDivElement> {
  html: string;
}

export function FormattedText({ html, ...props }: FormattedTextProps) {
  return <div {...props}>{parse(html, options)}</div>;
}
