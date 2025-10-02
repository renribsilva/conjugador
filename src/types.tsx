type Person = {
  p1: string[];
  p2: string[];
  p3: string[];
  p4: string[];
  p5: string[];
  p6: string[];
};

type CanonicalForms = {
  gd: {
    n: string[];
  };
  pa: {
    n: string[];
  };
  im1: Person;
  im2: Person;
  inf: Person;
  pr_ind: Person;
  pr_sub: Person;
  pt_sub: Person;
  ft1_ind: Person;
  ft2_ind: Person;
  fut_sub: Person;
  pt1_ind: Person;
  pt2_ind: Person;
  pt3_ind: Person;
}

export type Conjugation = {
  model: string[],
  only_reflexive: boolean[],
  multiple_conj: boolean[],
  canonical1: CanonicalForms;
  canonical2: CanonicalForms;
};

export type ConjugationData = {
  conjugations: object,
  propOfVerb: object
}

export type InputTypes = {
  A: React.RefObject<HTMLInputElement>;
  B: { inputValue: string };
  C: React.Dispatch<React.SetStateAction<{ inputValue: string }>>;
  D: { inputValue: string };
  E: (e: React.KeyboardEvent) => void;
  children?: React.ReactNode; 
}

export type VerbEntry = {
  verb: string[];
  model: (string | number)[];
  ending: string[];
};

export type AllVerbsEntry = {
  [key: string]: VerbEntry
}

export type VerbProps = {
  hasTargetCanonical1: boolean;
  hasTargetCanonical2: boolean;
  hasTargetAbundance1: boolean;
  hasTargetAbundance2: boolean;
  termination: string | null;
  termEntrie: string | null | undefined;
  verb: string | null;
  types: string[] | null;
  note_plain: string[] | null;
  note_ref: object | null;
  afixo: string | null | undefined;
  model: object | null;
}

export type flowTypes = {
  conjugations: Conjugation | null;
  inputValue: string; 
  inputReq: string;
  showConjugations: boolean;
  foundVerb: string | null;
  termination: string | null | undefined;
  termEntrie: string | null | undefined;
  hasTargetCanonical1: string | boolean | null ;
  hasTargetCanonical2: string | boolean | null ;
  hasTargetAbundance1: string | boolean | null ;
  hasTargetAbundance2: string | boolean | null ;
  note_plain: string[] | null | undefined;
  note_ref: object | null;
  types: string[] | null | undefined;
  model: object | null;
  loading: boolean;
  suggestions: string[] | null;
  showSuggestions: boolean;
  showButton: boolean;
  isButtonDisabled: boolean;
  showHome: boolean;
  showSobre: boolean;
  showStatistic: boolean;
  showReviewButton: boolean;
  goThrough: boolean;
  enter: boolean;
  progress: number | null;
  isDisabled: boolean;

  originalVerb: object | null;
  variationVerb: object| null,
  result: string | null,
  findedWord: string | null,
  similar: string[] | null,
  punct: string [] | null,

  variations: object | null,
  varHasVariations: boolean,
  varProcessedInput: string | null,
  varForcedVerb: boolean,
  varPrefixFounded: boolean,
  varMatchingAfixo: string | null,
  varConector: string | null,
  varOriginalInput: string | null,
  
  canonical: string

  postReq: boolean | null
  
}