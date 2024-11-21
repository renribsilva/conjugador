import allVerbs from '../json/allVerbs.json';
import afixos from '../json/afixos.json';
import { nw } from './normalizeVerb';

type ValidPrefixResult = {
  isValid: boolean;
  afixo: string | null;
  conector: string | null;
};

export default function isValidPrefix(input: string): ValidPrefixResult {
  const verb = input.replace(/-/g, '')  
  const sortedAfixos = afixos.sort((a, b) => b.length - a.length);
  const normSortedAfixos = sortedAfixos.map(afixo => nw(afixo));

  for (const afixo of normSortedAfixos) {
    if (verb.startsWith(afixo)) {

      let restOfVerb = verb.slice(afixo.length);
      let conector: string | null = null; 

      if (/^([rs])\1/.test(restOfVerb)) {
        conector = restOfVerb[0];  
        
        restOfVerb = restOfVerb.slice(1);
      } else if (/^n[cdfghjklmnqrstvwxyz]/.test(restOfVerb)) {
        conector = 'n'; 
        restOfVerb = restOfVerb.slice(1);
      } else if (/^m[pb]/.test(restOfVerb)) {
        conector = 'm';  
        restOfVerb = restOfVerb.slice(1);
      }

      if (allVerbs.hasOwnProperty(restOfVerb)) {
        return { isValid: true, afixo, conector }; 
      }
    }
  }

  return { isValid: false, afixo: null, conector: null }; 

}
