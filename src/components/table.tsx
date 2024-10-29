// components/ConjugationSection.tsx
import React from 'react';
import styles from "../styles/components.module.css";
import { nw } from '../lib/normalizeVerb';
import { Conjugation } from '../types';

const Table = ({ conjugations }: { conjugations: Conjugation }) => {
  return (
    <section>
        <div>
          <div>Infinitivo: {nw(conjugations.inf.p1)}</div>
          <div>Gerúndio: {nw(conjugations.gd.n)}</div>
          <div>Particípio: {nw(conjugations.pa.n)}</div>
        </div>
        <div className={styles.table}>
          {/* Indicativo */}
          <div className={styles.b1}>
            <div className={styles.mod}>Indicativo</div>
            <div className={styles.row}>
              <div className={styles.col}>
                <div className={styles.tense}>Presente</div>
                <div>eu {nw(conjugations.pr_ind.p1)}</div>
                <div>tu {nw(conjugations.pr_ind.p2)}</div>
                <div>ela {nw(conjugations.pr_ind.p3)}</div>
                <div>nós {nw(conjugations.pr_ind.p4)}</div>
                <div>vós {nw(conjugations.pr_ind.p5)}</div>
                <div>elas {nw(conjugations.pr_ind.p6)}</div>
              </div>
              <div className={styles.col}>
                <div className={styles.tense}>Pretérito Perfeito</div>
                <div>eu {nw(conjugations.pt1_ind.p1)}</div>
                <div>tu {nw(conjugations.pt1_ind.p2)}</div>
                <div>ela {nw(conjugations.pt1_ind.p3)}</div>
                <div>nós {nw(conjugations.pt1_ind.p4)}</div>
                <div>vós {nw(conjugations.pt1_ind.p5)}</div>
                <div>elas {nw(conjugations.pt1_ind.p6)}</div>
              </div>
              <div className={styles.col}>
                <div className={styles.tense}>Pretérito Imperfeito</div>
                <div>eu {nw(conjugations.pt2_ind.p1)}</div>
                <div>tu {nw(conjugations.pt2_ind.p2)}</div>
                <div>ela {nw(conjugations.pt2_ind.p3)}</div>
                <div>nós {nw(conjugations.pt2_ind.p4)}</div>
                <div>vós {nw(conjugations.pt2_ind.p5)}</div>
                <div>elas {nw(conjugations.pt2_ind.p6)}</div>
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.col}>
                <div className={styles.tense}>Pretérito Mais-que-perfeito</div>
                <div>eu {nw(conjugations.pt3_ind.p1)}</div>
                <div>tu {nw(conjugations.pt3_ind.p2)}</div>
                <div>ela {nw(conjugations.pt3_ind.p3)}</div>
                <div>nós {nw(conjugations.pt3_ind.p4)}</div>
                <div>vós {nw(conjugations.pt3_ind.p5)}</div>
                <div>elas {nw(conjugations.pt3_ind.p6)}</div>
              </div>
              <div className={styles.col}>
                <div className={styles.tense}>Futuro do Presente</div>
                <div>eu {nw(conjugations.ft1_ind.p1)}</div>
                <div>tu {nw(conjugations.ft1_ind.p2)}</div>
                <div>ela {nw(conjugations.ft1_ind.p3)}</div>
                <div>nós {nw(conjugations.ft1_ind.p4)}</div>
                <div>vós {nw(conjugations.ft1_ind.p5)}</div>
                <div>elas {nw(conjugations.ft1_ind.p6)}</div>
              </div>
              <div className={styles.col}>
                <div className={styles.tense}>Futuro do Pretérito</div>
                <div>eu {nw(conjugations.ft2_ind.p1)}</div>
                <div>tu {nw(conjugations.ft2_ind.p2)}</div>
                <div>ela {nw(conjugations.ft2_ind.p3)}</div>
                <div>nós {nw(conjugations.ft2_ind.p4)}</div>
                <div>vós {nw(conjugations.ft2_ind.p5)}</div>
                <div>elas {nw(conjugations.ft2_ind.p6)}</div>
              </div>
            </div>
          </div>
          {/* Subjuntivo */}
          <div className={styles.b2}>
            <div className={styles.mod}>Subjuntivo</div>
            <div className={styles.row}>
              <div className={styles.col}>
                <div className={styles.tense}>Presente</div>
                <div>que eu {nw(conjugations.pr_sub.p1)}</div>
                <div>que tu {nw(conjugations.pr_sub.p2)}</div>
                <div>que ela {nw(conjugations.pr_sub.p3)}</div>
                <div>que nós {nw(conjugations.pr_sub.p4)}</div>
                <div>que vós {nw(conjugations.pr_sub.p5)}</div>
                <div>que elas {nw(conjugations.pr_sub.p6)}</div>
              </div>
              <div className={styles.col}>
                <div className={styles.tense}>Pretérito Imperfeito</div>
                <div>se eu {nw(conjugations.pt_sub.p1)}</div>
                <div>se tu {nw(conjugations.pt_sub.p2)}</div>
                <div>se ela {nw(conjugations.pt_sub.p3)}</div>
                <div>se nós {nw(conjugations.pt_sub.p4)}</div>
                <div>se vós {nw(conjugations.pt_sub.p5)}</div>
                <div>se elas {nw(conjugations.pt_sub.p6)}</div>
              </div>
              <div className={styles.col}>
                <div className={styles.tense}>Futuro</div>
                <div>quando eu {nw(conjugations.fut_sub.p1)}</div>
                <div>quando tu {nw(conjugations.fut_sub.p2)}</div>
                <div>quando ela {nw(conjugations.fut_sub.p3)}</div>
                <div>quando nós {nw(conjugations.fut_sub.p4)}</div>
                <div>quando vós {nw(conjugations.fut_sub.p5)}</div>
                <div>quando elas {nw(conjugations.fut_sub.p6)}</div>
              </div>
            </div>
          </div>
          {/* Imperativo */}
          <div className={styles.b3}>
            <section className={styles.section1_b3}>
              <div className={styles.mod}>Imperativo</div>
              <div className={styles.row}>
                <div className={styles.col}>
                  <div className={styles.tense}>Afirmativo</div>
                  <div>{nw(conjugations.im1.p1)}</div>
                  <div>{nw(conjugations.im1.p2)} tu</div>
                  <div>{nw(conjugations.im1.p3)} você</div>
                  <div>{nw(conjugations.im1.p4)} nós</div>
                  <div>{nw(conjugations.im1.p5)} vós</div>
                  <div>{nw(conjugations.im1.p6)} vocês</div>
                </div>
                <div className={styles.col}>
                  <div className={styles.tense}>Negativo</div>
                  <div>{nw(conjugations.im2.p1)}</div>
                  <div>não {nw(conjugations.im2.p2)} tu</div>
                  <div>não {nw(conjugations.im2.p3)} você</div>
                  <div>não {nw(conjugations.im2.p4)} nós</div>
                  <div>não {nw(conjugations.im2.p5)} vós</div>
                  <div>não {nw(conjugations.im2.p6)} vocês</div>
                </div>
              </div>
            </section>
            <section className={styles.section2_b3}>
              {/* Infinitivo */}
              <div className={styles.mod}>Infinitivo</div>
              <div className={styles.row}>
                <div className={styles.col}>
                  <div className={styles.tense}>Infinitivo Pessoal</div>
                  <div>por {nw(conjugations.inf.p1)} eu</div>
                  <div>por {nw(conjugations.inf.p2)} tu</div>
                  <div>por {nw(conjugations.inf.p3)} ele</div>
                  <div>por {nw(conjugations.inf.p4)} nós</div>
                  <div>por {nw(conjugations.inf.p5)} vós</div>
                  <div>por {nw(conjugations.inf.p6)} eles</div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>
  );
};

export default Table;
