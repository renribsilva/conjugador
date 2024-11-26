// components/ConjugationSection.tsx
import React from "react";
import styles from "../styles/components.module.css";
import { nw } from "../lib/normalizeVerb";
import { Conjugation } from "../types";

const pronouns = {
  eu: "eu",
  tu: "tu",
  ele: "ela",
  nós: "nós",
  vós: "vós",
  eles: "elas"
};

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
            <div>{nw(X.p1[0])}</div>
            <div>
              <span className={styles.adv}>{Array.isArray(X.p2) && X.p2[0] !== "---" ? adv : ""} </span>
              <span>{Array.isArray(X.p2) && X.p2[1] !== null ? `${nw(X.p2[0])} / ${nw(X.p2[1])}` : nw(X.p2[0])}</span>
              <span className={styles.pronouns}> {Array.isArray(X.p2) && X.p2[0] !== "---" ? pronouns.tu : ""}</span>
            </div>
            <div>
              <span className={styles.adv}>{Array.isArray(X.p3) && X.p3[0] !== "---" ? adv : ""} </span>
              <span>{Array.isArray(X.p3) && X.p3[1] !== null ? `${nw(X.p3[0])} / ${nw(X.p3[1])}` : nw(X.p3[0])}</span>
              <span className={styles.pronouns}> {Array.isArray(X.p3) && X.p3[0] !== "---" ? pronouns.ele : ""}</span>
            </div>
            <div>
              <span className={styles.adv}>{Array.isArray(X.p4) && X.p4[0] !== "---" ? adv : ""} </span>
              <span>{Array.isArray(X.p4) && X.p4[1] !== null ? `${nw(X.p4[0])} / ${nw(X.p4[1])}` : nw(X.p4[0])}</span>
              <span className={styles.pronouns}> {Array.isArray(X.p4) && X.p4[0] !== "---" ? pronouns.nós : ""}</span>
            </div>
            <div>
              <span className={styles.adv}>{Array.isArray(X.p5) && X.p5[0] !== "---" ? adv : ""} </span>
              <span>{Array.isArray(X.p5) && X.p5[1] !== null ? `${nw(X.p5[0])} / ${nw(X.p5[1])}` : nw(X.p5[0])}</span>
              <span className={styles.pronouns}> {Array.isArray(X.p5) && X.p5[0] !== "---" ? pronouns.vós : ""}</span>
            </div>
            <div>
              <span className={styles.adv}>{Array.isArray(X.p6) && X.p6[0] !== "---" ? adv : ""} </span>
              <span>{Array.isArray(X.p6) && X.p6[1] !== null ? `${nw(X.p6[0])} / ${nw(X.p6[1])}` : nw(X.p6[0])}</span>
              <span className={styles.pronouns}> {Array.isArray(X.p6) && X.p6[0] !== "---" ? pronouns.eles : ""}</span>
            </div>
          </>
        ) : isInfinitive ? (
          <>
            <div>
              <span className={styles.adv}>{Array.isArray(X.p1) && X.p1[0] !== "---" ? adv : ""} </span>
              <span>{Array.isArray(X.p1) && X.p1[1] !== null ? `${nw(X.p1[0])} / ${nw(X.p1[1])}` : nw(X.p1[0])}</span>
              <span className={styles.pronouns}> {Array.isArray(X.p1) && X.p1[0] !== "---" ? pronouns.eu : ""}</span>
            </div>
            <div>
              <span className={styles.adv}>{Array.isArray(X.p2) && X.p2[0] !== "---" ? adv : ""} </span>
              <span>{Array.isArray(X.p2) && X.p2[1] !== null ? `${nw(X.p2[0])} / ${nw(X.p2[1])}` : nw(X.p2[0])}</span>
              <span className={styles.pronouns}> {Array.isArray(X.p2) && X.p2[0] !== "---" ? pronouns.tu : ""}</span>
            </div>
            <div>
              <span className={styles.adv}>{Array.isArray(X.p3) && X.p3[0] !== "---" ? adv : ""} </span>
              <span>{Array.isArray(X.p3) && X.p3[1] !== null ? `${nw(X.p3[0])} / ${nw(X.p3[1])}` : nw(X.p3[0])}</span>
              <span className={styles.pronouns}> {Array.isArray(X.p3) && X.p3[0] !== "---" ? pronouns.ele : ""}</span>
            </div>
            <div>
              <span className={styles.adv}>{Array.isArray(X.p4) && X.p4[0] !== "---" ? adv : ""} </span>
              <span>{Array.isArray(X.p4) && X.p4[1] !== null ? `${nw(X.p4[0])} / ${nw(X.p4[1])}` : nw(X.p4[0])}</span>
              <span className={styles.pronouns}> {Array.isArray(X.p4) && X.p4[0] !== "---" ? pronouns.nós : ""}</span>
            </div>
            <div>
              <span className={styles.adv}>{Array.isArray(X.p5) && X.p5[0] !== "---" ? adv : ""} </span>
              <span>{Array.isArray(X.p5) && X.p5[1] !== null ? `${nw(X.p5[0])} / ${nw(X.p5[1])}` : nw(X.p5[0])}</span>
              <span className={styles.pronouns}> {Array.isArray(X.p5) && X.p5[0] !== "---" ? pronouns.vós : ""}</span>
            </div>
            <div>
              <span className={styles.adv}>{Array.isArray(X.p6) && X.p6[0] !== "---" ? adv : ""} </span>
              <span>{Array.isArray(X.p6) && X.p6[1] !== null ? `${nw(X.p6[0])} / ${nw(X.p6[1])}` : nw(X.p6[0])}</span>
              <span className={styles.pronouns}> {Array.isArray(X.p6) && X.p6[0] !== "---" ? pronouns.eles : ""}</span>
            </div>
          </>
        ) : (
          <>
            <div>
              <span className={styles.adv}>{Array.isArray(X.p1) && X.p1[0] !== "---" ? adv : ""} </span>
              <span className={styles.pronouns}>{Array.isArray(X.p1) && X.p1[0] !== "---" ? pronouns.eu : ""}</span>
              <span> {Array.isArray(X.p1) && X.p1[1] !== null ? `${nw(X.p1[0])} / ${nw(X.p1[1])}` : nw(X.p1[0])}</span>
            </div>
            <div>
              <span className={styles.adv}>{Array.isArray(X.p2) && X.p2[0] !== "---" ? adv : ""} </span>
              <span className={styles.pronouns}>{Array.isArray(X.p2) && X.p2[0] !== "---" ? pronouns.tu : ""}</span>
              <span> {Array.isArray(X.p2) && X.p2[1] !== null ? `${nw(X.p2[0])} / ${nw(X.p2[1])}` : nw(X.p2[0])}</span>
            </div>
            <div>
              <span className={styles.adv}>{Array.isArray(X.p3) && X.p3[0] !== "---" ? adv : ""} </span>
              <span className={styles.pronouns}>{Array.isArray(X.p3) && X.p3[0] !== "---" ? pronouns.ele : ""}</span>
              <span> {Array.isArray(X.p3) && X.p3[1] !== null ? `${nw(X.p3[0])} / ${nw(X.p3[1])}` : nw(X.p3[0])}</span>
            </div>
            <div>
              <span className={styles.adv}>{Array.isArray(X.p4) && X.p4[0] !== "---" ? adv : ""} </span>
              <span className={styles.pronouns}>{Array.isArray(X.p4) && X.p4[0] !== "---" ? pronouns.nós : ""}</span>
              <span> {Array.isArray(X.p4) && X.p4[1] !== null ? `${nw(X.p4[0])} / ${nw(X.p4[1])}` : nw(X.p4[0])}</span>
            </div>
            <div>
              <span className={styles.adv}>{Array.isArray(X.p5) && X.p5[0] !== "---" ? adv : ""} </span>
              <span className={styles.pronouns}>{Array.isArray(X.p5) && X.p5[0] !== "---" ? pronouns.vós : ""}</span>
              <span> {Array.isArray(X.p5) && X.p5[1] !== null ? `${nw(X.p5[0])} / ${nw(X.p5[1])}` : nw(X.p5[0])}</span>
            </div>
            <div>
              <span className={styles.adv}>{Array.isArray(X.p6) && X.p6[0] !== "---" ? adv : ""} </span>
              <span className={styles.pronouns}>{Array.isArray(X.p6) && X.p6[0] !== "---" ? pronouns.eles : ""}</span>
              <span> {Array.isArray(X.p6) && X.p6[1] !== null ? `${nw(X.p6[0])} / ${nw(X.p6[1])}` : nw(X.p6[0])}</span>
            </div>
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
            <span>{
              Array.isArray(conjugations.inf.p3) && 
              conjugations.inf.p3[1] !== null ? 
                `${nw(conjugations.inf.p3[0])} / ${nw(conjugations.inf.p3[1])}` : 
                nw(conjugations.inf.p3[0])
            }</span>
          </div>
          <div>
            <strong>Gerúndio: </strong>
            <span>{
              Array.isArray(conjugations.gd.n) && 
              conjugations.gd.n[1] !== null ? 
                `${nw(conjugations.gd.n[0])} / ${nw(conjugations.gd.n[1])}` : 
                nw(conjugations.gd.n[0])
            }</span>
          </div>
          <div>
            <strong>Particípio: </strong>
            <span>{
              Array.isArray(conjugations.pa.n) && 
              conjugations.pa.n[1] !== null ? 
                `${nw(conjugations.pa.n[0])} / ${nw(conjugations.pa.n[1])}` : 
                nw(conjugations.pa.n[0])
            }</span>
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
