import { HTMLAttributes } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cva } from 'class-variance-authority';
import parse, {
  DOMNode,
  domToReact,
  Element,
  HTMLReactParserOptions,
} from 'html-react-parser';

import { sanitizeHtml } from '@/lib/sanitize-html';
import { cn, isRelative } from '@/lib/utils';

// Helper to narrow node type
const isElement = (domNode: DOMNode): domNode is Element =>
  domNode.type === 'tag';

// Helper to convert style string to React CSSProperties
function styleStringToObject(styles?: string): React.CSSProperties | undefined {
  if (!styles) return undefined;
  return styles.split(';').reduce<Record<string, string>>((acc, style) => {
    const [key, value] = style.split(':');
    if (key && value) {
      const camelKey = key
        .trim()
        .replace(/-([a-z])/g, (_, char) => char.toUpperCase());
      acc[camelKey] = value.trim();
    }
    return acc;
  }, {}) as React.CSSProperties;
}

interface BodyCopyProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'base' | 'lg' | 'xl' | '2xl';
}

export const bodyCopyVariants = cva('prose prose-theme', {
  variants: {
    size: {
      base: '',
      sm: 'prose-sm',
      lg: 'prose-lg',
      xl: 'prose-xl',
      '2xl': 'prose-2xl',
    },
  },
  defaultVariants: {
    size: 'base',
  },
});

export default function BodyCopy({
  size = 'base',
  children,
  className,
  ...props
}: BodyCopyProps) {
  const options: HTMLReactParserOptions = {
    replace: (domNode) => {
      if (!isElement(domNode)) return;

      const { name, attribs, children } = domNode;
      const classes = attribs?.class;
      const styles = attribs?.style;

      switch (name) {
        case 'img': {
          const { src, alt, width = 100, height = 100 } = attribs;
          const numberWidth = Number(width);
          const numberHeight = Number(height);
          const styleObj = styleStringToObject(styles);

          if (isRelative(src)) {
            return (
              <Image
                src={`${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}${src}`}
                width={numberWidth}
                height={numberHeight}
                alt={alt}
                className={cn('block max-w-full', classes)}
                style={styleObj}
              />
            );
          }
          break;
        }

        case 'a': {
          const { href, target } = attribs;
          const styleObj = styleStringToObject(styles);
          if (href && isRelative(href)) {
            return (
              <Link
                href={href}
                target={target}
                className={cn(classes, 'link')}
                style={styleObj}
                prefetch={false}
              >
                {domToReact(children as DOMNode[], options)}
              </Link>
            );
          }
          break;
        }

        default:
          return undefined;
      }
    },
  };

  // Helper function to parse content
  const parseContent = (content: string) => {
    const sanitizedContent = sanitizeHtml(content);
    return parse(sanitizedContent, options);
  };

  // Determine what to render
  const renderContent = () => {
    if (children) {
      // If children is a string, parse it
      if (typeof children === 'string') {
        return parseContent(children);
      }
      // Otherwise, return children as is
      return children;
    }

    return null;
  };

  if (!children) return null;

  return (
    <div className={cn(bodyCopyVariants({ size }), className)} {...props}>
      {renderContent()}
    </div>
  );
}
