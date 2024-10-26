// types/conjugation.ts

type Person = {
  p1: string;
  p2: string;
  p3: string;
  p4: string;
  p5: string;
  p6: string;
};

export interface Conjugation {
  gd: {
    n: string; // "amando"
  };
  pa: {
    n: string; // "amado"
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
