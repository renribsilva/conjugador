import allVerbs from '../json/allVerbs.json';
import afixos from '../json/afixos.json';  
import { nw } from './normalizeVerb';

export default function isValidPrefix(verb: string): { isValid: boolean; afixo: string | null } {  
    const sortedAfixos = afixos.sort((a, b) => b.length - a.length);
    const normSortedAfixos = sortedAfixos.map(afixo => nw(afixo));

    for (const afixo of normSortedAfixos) {
        if (verb.startsWith(afixo)) {
            let restOfVerb = verb.slice(afixo.length);

            if (/^([rs])\1/.test(restOfVerb)) { 
                restOfVerb = restOfVerb.slice(1);
            } else if (/^n[cdfghjklmnqrstvwxyz]/.test(restOfVerb)) { 
                restOfVerb = restOfVerb.slice(1);
            } else if (/^m[pb]/.test(restOfVerb)) { 
                restOfVerb = restOfVerb.slice(1);
            }

            if (allVerbs.hasOwnProperty(restOfVerb)) {
                return { isValid: true, afixo }; 
            }
        }
    }

    return { isValid: false, afixo: null }; 
}
