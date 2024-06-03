import FragmentCallToAction from './cta/fragment-call-to-action';
import FragmentText from './text/fragment-text';

export function isFragmentType(key: string) {
  return key in fragmentTypes;
}

export const fragmentTypes = {
  'nodehive_fragment--cta': FragmentCallToAction,
  'nodehive_fragment--text': FragmentText,
};
