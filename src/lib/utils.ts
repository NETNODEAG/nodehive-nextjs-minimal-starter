import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Tailwind CSS classnames generator
 *
 * @param inputs - Classnames to be merged
 * @returns Tailwind CSS classnames
 *
 * @example
 * ```tsx
 * import { cn } from 'lib/utils';
 *
 * const className = cn('text-red-500', 'bg-blue-500');
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * This function is used to generate an absolute URL from a relative URL
 * It will use the NEXT_PUBLIC_DRUPAL_BASE_URL environment variable to generate the absolute URL
 *
 * @example
 * ```tsx
 * <img src={absoluteUrl(image.url)} alt={image.alt} />
 * ```
 */
export function absoluteUrl(input: string) {
  return `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}${input}`;
}

/**
 * This function is used to check if a URL is relative or absolute
 *
 * @example
 * ```tsx
 * <a href={isRelative(url) ? url : absoluteUrl(url)} />
 * ```
 */
export function isRelative(url: string) {
  return !new RegExp('^(?:[a-z]+:)?//', 'i').test(url);
}

/**
 * This function is used to transform an internal link uri to a slug
 * Example: entity:node/123 -> /de/node/123
 *
 * @param uri - The internal link uri
 * @returns The slug
 */
export function internalLinkUriToSlug(uri: string) {
  // Return null if uri is falsy or an empty string
  if (!uri || uri.trim() === '') return null;

  // If uri contains 'entity:node/', replace 'entity:' with '/{lang}/'
  if (uri.includes('entity:node/')) {
    return uri.replace('entity:', `/`);
  }

  // Return uri if it doesn't contain 'entity:node/'
  return uri;
}

/**
 * This function is used to format a date in a short format
 * It will use the locale de-CH
 * Example: 01.01.2021
 *
 * @param input - The date to format
 *
 * @returns The formatted date
 */
export function formatDate(input: string): string {
  const date = new Date(input);

  const formattedDate = date.toLocaleDateString('de-CH', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZone: 'Europe/Zurich',
  });

  return formattedDate;
}
