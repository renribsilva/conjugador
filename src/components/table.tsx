// components/ConjugationSection.tsx
import React, { useEffect, useState } from "react";
import styles from "../styles/components.module.css";
import { nw } from "../lib/normalizeVerb";
import { Conjugation } from "../types";

const pronouns = {
  eu: "eu",
  tu: "tu",
  ele: "ele",
  ela: "ela",
  elu: "elu",
  nós: "nós",
  vós: "vós",
  eles: "eles",
  elas: "elas",
  elus: "elus"
};

export default function Table ({ conjugations }: { conjugations: Conjugation }) {

  const [activePronoun, setActiveButton] = useState<string | null>("ela");
  const [isSeActive, setSeActive] = useState(false);

  const handlePronounClick = (pronoun: string) => {
    setActiveButton(pronoun);
  };

  const handleSeClick = () => {
    setSeActive(!isSeActive);
  };

  useEffect(() => {
  }, [activePronoun, isSeActive]);

  const block = ({ adv, ten, conj, mod }) => {

    const X = conj[mod];
    const isSpecialOrder = ten === "Afirmativo" || ten === "Negativo";
    const isInfinitive = ten === "Pessoal";

    const C1 = ({ p }: { p: string }) => {
      return (
        <span className={styles.adv}>
          {Array.isArray(X[p]) && X[p][0] !== "---" ? adv : ""}
        </span>
      );
    };

    const C2 = ({ p }: { p: string }) => {
      return (
        <span>
          {Array.isArray(X[p]) ? X[p].filter((item) => item !== null).map(nw).join(' / ') : nw(X[p])}
        </span>
      );
    };

    const C3 = ({ p, q }: { p: string , q: string}) => {
      return (
        <span className={styles.pronouns}>
          {Array.isArray(X[p]) && X[p][0] !== "---" ? pronouns[q] : ""}
        </span>
      );
    };
  
    return (
      <div className={styles.col}>
        <div className={styles.ten}>{ten}</div>
        {isSpecialOrder ? (
          <>
            <div>{nw(X.p1[0])}</div>
            <div><C1 p="p2" /> <C2 p="p2" /> <C3 p="p2" q="tu" /></div>
            <div><C1 p="p3" /> <C2 p="p3" /> <C3 p="p3" q={activePronoun? `${activePronoun}` : "ela"}/></div>
            <div><C1 p="p4" /> <C2 p="p4" /> <C3 p="p4" q="nós" /></div>
            <div><C1 p="p5" /> <C2 p="p5" /> <C3 p="p5" q="vós" /></div>
            <div><C1 p="p6" /> <C2 p="p6" /> <C3 p="p6" q={activePronoun? `${activePronoun}s` : "elas"} /></div>
          </>
        ) : isInfinitive ? (
          <>
            <div><C1 p="p1" /> <C2 p="p1" /> <C3 p="p1" q="eu" /></div>
            <div><C1 p="p2" /> <C2 p="p2" /> <C3 p="p2" q="tu" /></div>
            <div><C1 p="p3" /> <C2 p="p3" /> <C3 p="p3" q={activePronoun? `${activePronoun}` : "ela"} /></div>
            <div><C1 p="p4" /> <C2 p="p4" /> <C3 p="p4" q="nós" /></div>
            <div><C1 p="p5" /> <C2 p="p5" /> <C3 p="p5" q="vós" /></div>
            <div><C1 p="p6" /> <C2 p="p6" /> <C3 p="p6" q={activePronoun? `${activePronoun}s` : "elas"} /></div>
          </>
        ) : (
          <>
            <div><C1 p="p1" /> <C3 p="p1" q="eu" /> <C2 p="p1" /></div>
            <div><C1 p="p2" /> <C3 p="p2" q="tu" /> <C2 p="p2" /></div>
            <div><C1 p="p3" /> <C3 p="p3" q={activePronoun? `${activePronoun}` : "ela"} /> <C2 p="p3" /></div>
            <div><C1 p="p4" /> <C3 p="p4" q="nós" /> <C2 p="p4" /></div>
            <div><C1 p="p5" /> <C3 p="p5" q="vós" /> <C2 p="p5" /></div>
            <div><C1 p="p6" /> <C3 p="p6" q={activePronoun? `${activePronoun}s` : "elas"} /> <C2 p="p6" /></div>
          </>
        )}
      </div>
    );
  };  

  return (
    <section>
        <div>
          <div>
            <strong>Infinitivo: </strong>
            <span>
              {Array.isArray(conjugations.inf.p3)
                ? conjugations.inf.p3
                    .filter((item) => item !== null)
                    .map(nw)
                    .join(' / ')
                : nw(conjugations.inf.p3[0])}
            </span>
          </div>
          <div>
            <strong>Gerúndio: </strong>
            <span>
              {Array.isArray(conjugations.gd.n)
                ? conjugations.gd.n
                    .filter((item) => item !== null)
                    .map(nw)
                    .join(' / ')
                : nw(conjugations.gd.n[0])}
            </span>
          </div>
          <div>
            <strong>Particípio: </strong>
            <span>
              {Array.isArray(conjugations.pa.n)
                ? conjugations.pa.n
                    .filter((item) => item !== null)
                    .map(nw)
                    .join(' / ')
                : nw(conjugations.pa.n[0])}
            </span>
          </div>
        </div>
        <div className={styles.table_tabs}>
          <div className={styles.table_tabs_pronouns_container}>
            {["ele", "ela", "elu"].map((pronoun) => (
              <button
                key={pronoun}
                className={`${styles.table_tabs_pronouns_button} ${
                  activePronoun === pronoun ? styles.active : ""
                }`}
                onClick={() => handlePronounClick(pronoun)}
              >
                {pronoun}
              </button>
            ))}
          </div>
          <div className={styles.table_tabs_se_container}>
            <button
              className={`${styles.table_tabs_se_button} ${
                isSeActive ? styles.active : ""
              }`}
              onClick={handleSeClick}
            >
              -se
            </button>
          </div>
        </div>
        <div className={styles.table}>
          {/* Indicativo */}
          <div className={styles.b1}>
            <h3 className={styles.mod}>Indicativo</h3>
            <div className={styles.row}>
              {block({ adv: "", ten: "Presente", conj: conjugations, mod: "pr_ind"})}
              {block({ adv: "", ten: "Pretérito Perfeito", conj: conjugations, mod: "pt1_ind"})}
              {block({ adv: "", ten: "Pretérito Imperfeito", conj: conjugations, mod: "pt2_ind"})}
            </div>
            <div className={styles.row}>
              {block({ adv: "", ten: "Pretérito Mais-que-perfeito", conj: conjugations, mod: "pt3_ind"})}
              {block({ adv: "", ten: "Futuro do Presente", conj: conjugations, mod: "ft1_ind"})}
              {block({ adv: "", ten: "Futuro do Pretérito", conj: conjugations, mod: "ft2_ind"})}
            </div>
          </div>
          {/* Subjuntivo */}
          <div className={styles.b2}>
            <h3 className={styles.mod}>Subjuntivo</h3>
            <div className={styles.row}>
              {block({ adv: "que", ten: "Presente", conj: conjugations, mod: "pr_sub"})}
              {block({ adv: "se", ten: "Pretérito Imperfeito", conj: conjugations, mod: "pt_sub"})}
              {block({ adv: "quando", ten: "Futuro", conj: conjugations, mod: "fut_sub"})}
            </div>
          </div>
          {/* Imperativo */}
          <div className={styles.b3}>
            <section className={styles.section1_b3}>
              <h3 className={styles.mod}>Imperativo</h3>
              <div className={styles.row}>
                {block({ adv: "", ten: "Afirmativo", conj: conjugations, mod: "im1"})}
                {block({ adv: "não", ten: "Negativo", conj: conjugations, mod: "im2"})}
              </div>
            </section>
            <section className={styles.section2_b3}>
              {/* Infinitivo */}
              <h3 className={styles.mod}>Infinitivo</h3>
              <div className={styles.row}>
                {block({ adv: "por", ten: "Pessoal", conj: conjugations, mod: "inf"})}
              </div>
            </section>
          </div>
        </div>
      </section>
  );
};
