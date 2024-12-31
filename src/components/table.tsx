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

  const isOnlyReflexive = conjugations.pronoun[0]

  const [activePronoun, setActiveButton] = useState<string | null>("ela");
  const [isSeActive, setSeActive] = useState(false);

  const handlePronounClick = (pronoun: string) => {
    setActiveButton(pronoun);
  };

  const handleSeClick = () => {
    if (!isOnlyReflexive) {
      setSeActive((prev) => !prev);
    }
  };

  const block = ({ adv, ten, conj, mod, modext }) => {

    const X = conj[mod];
    const isAfirmative = ten === "Afirmativo"
    const isNegative = ten === "Negativo"
    const isInfinitive = ten === "Pessoal";
    const isFutPres = ten === "Futuro do Presente";
    const isFutPret = ten === "Futuro do Pretérito";
    const isIndicativo = modext === "Indicativo";
    const isSubjuntivo = modext === "Subjuntivo";

    const isValid = (p: string) => X[p][0] !== "---"

    const C2util = ({ 
      p, 
      removeS, 
      isFut, 
      suffix = '', 
      order 
    } : { 
      p: string, 
      removeS?: boolean, 
      isFut?: boolean, 
      suffix?: string, 
      order?: string }) => {

      const value = Array.isArray(X[p]) 
        ? X[p].filter((item) => item !== null).map(nw) 
        : [nw(X[p])];
    
      const lengthX = (p: string, i: number) => (X[p][i].replace("*", "").length);
      const lengthW = conj["inf"].p3[0].length
    
      let adjustedValue: string[] | string = value.map((item, index) => {

        const originalItem = item
        
        if (removeS && typeof item === 'string' && (item.endsWith('s') || item.endsWith('s*'))) {
          item = item.endsWith('s*')
            ? `${item.replace("*", "").slice(0, -1)}*`
            : item.slice(0, -1);
        }
        
        if (suffix && item !== '') {
          isFut
          ? item = `${item.slice(0, lengthW)}-${suffix}-${originalItem.replace("*","").slice(lengthW-lengthX(p, index))}`
          : order === "ênclise" ? item = `${item}-${suffix}` : item = `${suffix} ${item}`;
        }

        return item;

      });
    
      if (Array.isArray(adjustedValue)) {
        adjustedValue = adjustedValue.join(' / ');
      }
    
      return (
        <span>{adjustedValue}</span>
      );
    };

    const C1Wrapper = ({ p }: { p: string }) => {
      return (
        <span className={styles.adv}>
          {Array.isArray(X[p]) && X[p][0] !== "---" ? adv : ""}
        </span>
      );
    };
    
    const C2Wrapper = (
      { p, 
        removeS, 
        suffix = '',
      }: 
      { p: string, 
        removeS?: boolean, 
        suffix?: string
      }) => {

      return (
        <>
          {isSeActive && isValid(p) 
          ?
          isIndicativo && (isFutPres || isFutPret) 
            ? <C2util p={p} isFut={true} suffix={suffix} removeS={removeS}/> 
            : isSubjuntivo 
              ? <C2util p={p} suffix={suffix} /> 
              : isNegative 
                ? <C2util p={p} suffix={suffix} removeS={removeS}/> 
                : <C2util p={p} suffix={suffix} order="ênclise" removeS={removeS}/> 
          : 
          (
            <C2util p={p} />
          )}
        </>
      ); 
    };      

    const C3Wrapper = ({ p, q }: { p: string , q: string}) => {
      return (
        <span className={styles.pronouns}>
          {Array.isArray(X[p]) && X[p][0] !== "---" ? pronouns[q] : ""}
        </span>
      );
    };

    useEffect(() => {
      if (isOnlyReflexive) {
        setSeActive(true);
      }
    }, []);
  
    useEffect(() => {
    }, [activePronoun, isSeActive]);
  
    return (
      <div className={styles.col}>
        <div className={styles.ten}>{ten}</div>
        {(isNegative) ? (
          <>
            <div>{nw(X.p1[0])}</div>
            <div>
              <C1Wrapper p="p2" />{" "}
              <C2Wrapper p="p2" suffix="te"/>{" "}
              <C3Wrapper p="p2" q="tu" />
            </div>
            <div>
              <C1Wrapper p="p3" />{" "}
              <C2Wrapper p="p3" suffix="se"/>{" "}
              <C3Wrapper p="p3" q={activePronoun? `${activePronoun}` : "ela"}/>
            </div>
            <div>
              <C1Wrapper p="p4" />{" "}
              <C2Wrapper p="p4" suffix="nos"/>{" "}
              <C3Wrapper p="p4" q="nós" />
            </div>
            <div>
              <C1Wrapper p="p5" />{" "}
              <C2Wrapper p="p5" suffix="vos"/>{" "}
              <C3Wrapper p="p5" q="vós" />
            </div>
            <div>
              <C1Wrapper p="p6" />{" "}
              <C2Wrapper p="p6" suffix="se"/>{" "}
              <C3Wrapper p="p6" q={activePronoun? `${activePronoun}s` : "elas"} />
            </div>
          </>
        ) : isAfirmative ? (
          <>
            <div>
              <C1Wrapper p="p1" />{" "}
              <C2Wrapper p="p1" />{" "}
              <C3Wrapper p="p1" q="eu" />
            </div>
            <div>
              <C1Wrapper p="p2" />{" "}
              <C2Wrapper p="p2" suffix="te"/>{" "}
              <C3Wrapper p="p2" q="tu" />
            </div>
            <div>
              <C1Wrapper p="p3" />{" "}
              <C2Wrapper p="p3" suffix="se"/>{" "}
              <C3Wrapper p="p3" q={activePronoun? `${activePronoun}` : "ela"} />
              </div>
            <div>
              <C1Wrapper p="p4" />{" "}
              <C2Wrapper p="p4" suffix="nos" removeS={true}/>{" "}
              <C3Wrapper p="p4" q="nós" />
            </div>
            <div>
              <C1Wrapper p="p5" />{" "}
              <C2Wrapper p="p5" suffix="vos"/>{" "}
              <C3Wrapper p="p5" q="vós" />
            </div>
            <div>
              <C1Wrapper p="p6" />{" "}
              <C2Wrapper p="p6" suffix="se"/>{" "}
              <C3Wrapper p="p6" q={activePronoun? `${activePronoun}s` : "elas"} />
            </div>
          </>
        ) : isInfinitive ? (
          <>
            <div>
              <C1Wrapper p="p1" />{" "}
              <C2Wrapper p="p1" suffix="me"/>{" "}
              <C3Wrapper p="p1" q="eu" />
            </div>
            <div>
              <C1Wrapper p="p2" />{" "}
              <C2Wrapper p="p2" suffix="te"/>{" "}
              <C3Wrapper p="p2" q="tu" />
            </div>
            <div>
              <C1Wrapper p="p3" />{" "}
              <C2Wrapper p="p3" suffix="se"/>{" "}
              <C3Wrapper p="p3" q={activePronoun? `${activePronoun}` : "ela"} />
              </div>
            <div>
              <C1Wrapper p="p4" />{" "}
              <C2Wrapper p="p4" suffix="nos" removeS={true}/>{" "}
              <C3Wrapper p="p4" q="nós" />
            </div>
            <div>
              <C1Wrapper p="p5" />{" "}
              <C2Wrapper p="p5" suffix="vos"/>{" "}
              <C3Wrapper p="p5" q="vós" />
            </div>
            <div>
              <C1Wrapper p="p6" />{" "}
              <C2Wrapper p="p6" suffix="se"/>{" "}
              <C3Wrapper p="p6" q={activePronoun? `${activePronoun}s` : "elas"} />
            </div>
          </>
        ) : (
          <>
            <div>
              <C1Wrapper p="p1" />{" "}
              <C3Wrapper p="p1" q="eu" />{" "}
              <C2Wrapper p="p1" suffix="me" />
            </div>
            <div>
              <C1Wrapper p="p2" />{" "}
              <C3Wrapper p="p2" q="tu" />{" "}
              <C2Wrapper p="p2" suffix="te" />
            </div>
            <div>
              <C1Wrapper p="p3" />{" "}
              <C3Wrapper p="p3" q={activePronoun? `${activePronoun}` : "ela"} />{" "}
              <C2Wrapper p="p3" suffix="se" />
            </div>
            <div>
              <C1Wrapper p="p4" />{" "}
              <C3Wrapper p="p4" q="nós" />{" "}
              <C2Wrapper p="p4" suffix="nos" removeS={true}/>
            </div>
            <div>
              <C1Wrapper p="p5" />{" "}
              <C3Wrapper p="p5" q="vós" />{" "}
              <C2Wrapper p="p5" suffix="vos" />
            </div>
            <div>
              <C1Wrapper p="p6" />{" "}
              <C3Wrapper p="p6" q={activePronoun? `${activePronoun}s` : "elas"} />{" "}
              <C2Wrapper p="p6" suffix="se" />
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
            <span>
              {Array.isArray(conjugations.inf.p3)
                ? conjugations.inf.p3
                    .filter((item) => item !== null)
                    .map((item) => (isSeActive ? `${nw(item)}-se` : nw(item)))
                    .join(' / ')
                : nw(conjugations.inf.p3[0]) + (isSeActive ? "-se" : "")} 
            </span>
          </div>
          <div>
            <strong>Gerúndio: </strong>
            <span>
              {Array.isArray(conjugations.gd.n)
                ? conjugations.gd.n
                    .filter((item) => item !== null)
                    .map((item) => (isSeActive ? `${nw(item)}-se` : nw(item)))
                    .join(' / ')
                : nw(conjugations.gd.n[0]) + (isSeActive ? "-se" : "")}
            </span>
          </div>
          <div>
            <strong>Particípio: </strong>
            <span>
              {Array.isArray(conjugations.pa.n)
                ? conjugations.pa.n
                    .filter((item) => item !== null)
                    .map((item) => (isSeActive ? `se ${nw(item)}` : nw(item)))
                    .join(' / ')
                : (isSeActive ? "se " : "") + nw(conjugations.pa.n[0])}
            </span>
          </div>
        </div>
        <div className={styles.table_tabs}>
          <div className={styles.table_tabs_pronouns_container}>
            {["ela", "elu", "ele"].map((pronoun) => (
              <button
                key={pronoun}
                className={`${styles.table_tabs_pronouns_button} ${
                  activePronoun === pronoun ? styles.active : styles.inactive
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
                isSeActive ? styles.active : styles.inactive
              }`}
              onClick={() => {handleSeClick()}}
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
              {block({ adv: "", ten: "Presente", conj: conjugations, mod: "pr_ind", modext: "Indicativo"})}
              {block({ adv: "", ten: "Pretérito Perfeito", conj: conjugations, mod: "pt1_ind", modext: "Indicativo"})}
              {block({ adv: "", ten: "Pretérito Imperfeito", conj: conjugations, mod: "pt2_ind", modext: "Indicativo"})}
            </div>
            <div className={styles.row}>
              {block({ adv: "", ten: "Pretérito Mais-que-perfeito", conj: conjugations, mod: "pt3_ind", modext: "Indicativo"})}
              {block({ adv: "", ten: "Futuro do Presente", conj: conjugations, mod: "ft1_ind", modext: "Indicativo"})}
              {block({ adv: "", ten: "Futuro do Pretérito", conj: conjugations, mod: "ft2_ind", modext: "Indicativo"})}
            </div>
          </div>
          {/* Subjuntivo */}
          <div className={styles.b2}>
            <h3 className={styles.mod}>Subjuntivo</h3>
            <div className={styles.row}>
              {block({ adv: "que", ten: "Presente", conj: conjugations, mod: "pr_sub", modext: "Subjuntivo"})}
              {block({ adv: "se", ten: "Pretérito Imperfeito", conj: conjugations, mod: "pt_sub", modext: "Subjuntivo"})}
              {block({ adv: "quando", ten: "Futuro", conj: conjugations, mod: "fut_sub", modext: "Subjuntivo"})}
            </div>
          </div>
          {/* Imperativo */}
          <div className={styles.b3}>
            <section className={styles.section1_b3}>
              <h3 className={styles.mod}>Imperativo</h3>
              <div className={styles.row}>
                {block({ adv: "", ten: "Afirmativo", conj: conjugations, mod: "im1", modext: "Imperativo"})}
                {block({ adv: "não", ten: "Negativo", conj: conjugations, mod: "im2", modext: "Imperativo"})}
              </div>
            </section>
            <section className={styles.section2_b3}>
              {/* Infinitivo */}
              <h3 className={styles.mod}>Infinitivo</h3>
              <div className={styles.row}>
                {block({ adv: "por", ten: "Pessoal", conj: conjugations, mod: "inf", modext: "Infinitivo"})}
              </div>
            </section>
          </div>
        </div>
      </section>
  );
};
