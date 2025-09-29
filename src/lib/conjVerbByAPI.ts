import { conjugateVerb } from './conjugateVerb';
import { ni } from './normalizeVerb';

export const conjVerbByAPI = async (verb: string) => {
  
  const conjugations = conjugateVerb(ni(verb));
  await fetch('/api/conjVerb')
  return conjugations.propOfVerb
  
};