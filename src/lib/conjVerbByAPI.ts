import { conjugateVerb } from './conjugateVerb';
import { ni } from './normalizeVerb';

export const conjVerbByAPI = async (verb: string) => {
  
  const conjugations = conjugateVerb(ni(verb));
  await fetch('/api/conjVerb', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ verb, conjugations }),
  });
  return conjugations.propOfVerb; 
  
};