import FragmentText from '@/components/drupal/fragment/text/fragment-text';

export const fragmentTypes = {
  'nodehive_fragment--text': FragmentText,
} as const;

export function isFragmentType(key: string): key is keyof typeof fragmentTypes {
  return key in fragmentTypes;
}
