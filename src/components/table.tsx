// components/ConjugationSection.tsx
import React from 'react';
import styles from "../styles/components.module.css";
import { nw } from '../lib/normalizeVerb';
import { Conjugation } from '../types';

const pronouns = {
  eu: "eu",
  tu: "tu",
  ele: "ela",
  nós: "nós",
  vós: "vós",
  eles: "elas"
}

export default function Table ({ conjugations }: { conjugations: Conjugation }) {

  const block = ({ adv, ten, conj, mod }) => {
    const X = conj[mod];
    const isSpecialOrder = ten === "Afirmativo" || ten === "Negativo";
    const isInfinitive = ten === "Pessoal";
  
    return (
      <div className={styles.col}>
        <div className={styles.ten}>{ten}</div>
        {isSpecialOrder ? (
          <>
            <div>{nw(X.p1)}</div>
            <div><span className={styles.adv}>{X.p2 === '---' ? '' : adv} </span>{nw(X.p2)} <span className={styles.pronouns}>{X.p2 === '---' ? '' : pronouns.tu}</span></div>
            <div><span className={styles.adv}>{X.p3 === '---' ? '' : adv} </span>{nw(X.p3)} <span className={styles.pronouns}>{X.p3 === '---' ? '' : pronouns.ele}</span></div>
            <div><span className={styles.adv}>{X.p4 === '---' ? '' : adv} </span>{nw(X.p4)} <span className={styles.pronouns}>{X.p4 === '---' ? '' : pronouns.nós}</span></div>
            <div><span className={styles.adv}>{X.p5 === '---' ? '' : adv} </span>{nw(X.p5)} <span className={styles.pronouns}>{X.p5 === '---' ? '' : pronouns.vós}</span></div>
            <div><span className={styles.adv}>{X.p6 === '---' ? '' : adv} </span>{nw(X.p6)} <span className={styles.pronouns}>{X.p6 === '---' ? '' : pronouns.eles}</span></div>
          </>
        ) : isInfinitive ? (
          <>
            <div><span className={styles.adv}>{X.p1 === '---' ? '' : adv} </span>{nw(X.p1)} <span className={styles.pronouns}>{X.p1 === '---' ? '' : pronouns.eu}</span></div>
            <div><span className={styles.adv}>{X.p2 === '---' ? '' : adv} </span>{nw(X.p2)} <span className={styles.pronouns}>{X.p2 === '---' ? '' : pronouns.tu}</span></div>
            <div><span className={styles.adv}>{X.p3 === '---' ? '' : adv} </span>{nw(X.p3)} <span className={styles.pronouns}>{X.p3 === '---' ? '' : pronouns.ele}</span></div>
            <div><span className={styles.adv}>{X.p4 === '---' ? '' : adv} </span>{nw(X.p4)} <span className={styles.pronouns}>{X.p4 === '---' ? '' : pronouns.nós}</span></div>
            <div><span className={styles.adv}>{X.p5 === '---' ? '' : adv} </span>{nw(X.p5)} <span className={styles.pronouns}>{X.p5 === '---' ? '' : pronouns.vós}</span></div>
            <div><span className={styles.adv}>{X.p6 === '---' ? '' : adv} </span>{nw(X.p6)} <span className={styles.pronouns}>{X.p6 === '---' ? '' : pronouns.eles}</span></div>
          </>
        ) : (
          <>
            <div><span className={styles.adv}>{X.p1 === '---' ? '' : adv} </span><span className={styles.pronouns}>{X.p1 === '---' ? '' : pronouns.eu}</span> {nw(X.p1)}</div>
            <div><span className={styles.adv}>{X.p2 === '---' ? '' : adv} </span><span className={styles.pronouns}>{X.p2 === '---' ? '' : pronouns.tu}</span> {nw(X.p2)}</div>
            <div><span className={styles.adv}>{X.p3 === '---' ? '' : adv} </span><span className={styles.pronouns}>{X.p3 === '---' ? '' : pronouns.ele}</span> {nw(X.p3)}</div>
            <div><span className={styles.adv}>{X.p4 === '---' ? '' : adv} </span><span className={styles.pronouns}>{X.p4 === '---' ? '' : pronouns.nós}</span> {nw(X.p4)}</div>
            <div><span className={styles.adv}>{X.p5 === '---' ? '' : adv} </span><span className={styles.pronouns}>{X.p5 === '---' ? '' : pronouns.vós}</span> {nw(X.p5)}</div>
            <div><span className={styles.adv}>{X.p6 === '---' ? '' : adv} </span><span className={styles.pronouns}>{X.p6 === '---' ? '' : pronouns.eles}</span> {nw(X.p6)}</div>
          </>
        )}
      </div>
    );
  };  

  return (
    <section>
        <div>
          <div><strong>Infinitivo: </strong> {nw(conjugations.inf.p1)}</div>
          <div><strong>Gerúndio: </strong> {nw(conjugations.gd.n)}</div>
          <div><strong>Particípio: </strong>{nw(conjugations.pa.n)}</div>
        </div>
        <div className={styles.table}>
          {/* Indicativo */}
          <div className={styles.b1}>
            <h3 className={styles.mod}>Indicativo</h3>
            <div className={styles.row}>
              {block({ adv: '', ten: 'Presente', conj: conjugations, mod: "pr_ind"})}
              {block({ adv: '', ten: 'Pretérito Perfeito', conj: conjugations, mod: "pt1_ind"})}
              {block({ adv: '', ten: 'Pretérito Imperfeito', conj: conjugations, mod: "pt2_ind"})}
            </div>
            <div className={styles.row}>
              {block({ adv: '', ten: 'Pretérito Mais-que-perfeito', conj: conjugations, mod: "pt3_ind"})}
              {block({ adv: '', ten: 'Futuro do Presente', conj: conjugations, mod: "ft1_ind"})}
              {block({ adv: '', ten: 'Futuro do Pretérito', conj: conjugations, mod: "ft2_ind"})}
            </div>
          </div>
          {/* Subjuntivo */}
          <div className={styles.b2}>
            <h3 className={styles.mod}>Subjuntivo</h3>
            <div className={styles.row}>
              {block({ adv: 'que', ten: 'Presente', conj: conjugations, mod: "pr_sub"})}
              {block({ adv: 'se', ten: 'Pretérito Imperfeito', conj: conjugations, mod: "pt_sub"})}
              {block({ adv: 'quando', ten: 'Futuro', conj: conjugations, mod: "fut_sub"})}
            </div>
          </div>
          {/* Imperativo */}
          <div className={styles.b3}>
            <section className={styles.section1_b3}>
              <h3 className={styles.mod}>Imperativo</h3>
              <div className={styles.row}>
                {block({ adv: '', ten: 'Afirmativo', conj: conjugations, mod: "im1"})}
                {block({ adv: 'não', ten: 'Negativo', conj: conjugations, mod: "im2"})}
              </div>
            </section>
            <section className={styles.section2_b3}>
              {/* Infinitivo */}
              <h3 className={styles.mod}>Infinitivo</h3>
              <div className={styles.row}>
                {block({ adv: 'por', ten: 'Pessoal', conj: conjugations, mod: "inf"})}
              </div>
            </section>
          </div>
        </div>
      </section>
  );
};
