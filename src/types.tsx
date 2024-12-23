// types/conjugation.ts

type Person = {
  p1: string[];
  p2: string[];
  p3: string[];
  p4: string[];
  p5: string[];
  p6: string[];
};

export type Conjugation = {
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
  prefix: string[];
};

export type AllVerbsEntry = {
  [key: string]: VerbEntry
}