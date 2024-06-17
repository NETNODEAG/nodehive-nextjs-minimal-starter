import FragmentText from '@/components/fragment/text/FragmentText';

export function isFragmentType(key: string) {
  return key in fragmentTypes;
}

export const fragmentTypes = {
  'nodehive_fragment--text': FragmentText,
};
