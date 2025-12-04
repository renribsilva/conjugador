'use client'

import React, { useEffect, useState } from "react";
import styles from "../../styles/components.module.css";
import { nw } from "../../lib/ssr/normalizeVerb";
import { Conjugation } from "../../types";

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

const STORAGE_KEY = "activePronoun";
const EXPIRATION_KEY = "activePronounExpires";

export default function Table ({ conj, canonical }: { conj: Conjugation, canonical: string }) {

  const [activePronoun, setActivePronoun] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ?? "ela";
    }
    return "ela";
  });
  const [isSeActive, setSeActive] = useState(false);
  const [canonicalType, setCanonicalType] = useState(canonical)

  useEffect(() => {
    if (isOnlyReflexive) {
      setSeActive(true);
    }
    const savedPronoun = localStorage.getItem(STORAGE_KEY);
    const expires = localStorage.getItem(EXPIRATION_KEY);
    if (savedPronoun && expires) {
      const expiresDate = new Date(expires);
      const now = new Date();
      if (now < expiresDate) {
        setActivePronoun(savedPronoun); // mantém o pronome salvo
      } else {
        // expirou, limpa storage
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(EXPIRATION_KEY);
        setActivePronoun("ela"); // volta para o padrão
      }
    }
  }, []);
  
  const conjugations = conj[canonicalType]
  
  let isOnlyReflexive = conj.only_reflexive[0]
  const isMultiple = conj.multiple_conj[0]

  const handlePronounClick = (pronoun: string) => {
    setActivePronoun(pronoun);
    localStorage.setItem(STORAGE_KEY, pronoun);
    const expires = new Date();
    expires.setDate(expires.getDate() + 1); // expira em 1 dia
    localStorage.setItem(EXPIRATION_KEY, expires.toISOString());
  };

  const handleSeClick = () => {
    if (!isOnlyReflexive) {
      setSeActive((prev) => !prev);
    }
  };

  const handleCanonicalClick = () => {
    setCanonicalType(canonicalType === "canonical1" ? "canonical2" : "canonical1");
    setSeActive(false)
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
      const lengthW = conj["ft1_ind"].p1[0] !== "---" 
        ? conj["ft1_ind"].p1[0].replace("*", "").length-2
        : conj["ft1_ind"].p3[0].replace("*", "").length-1
    
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
      if (conjugations.inf.p3.includes("doer") && canonicalType === "canonical2") {
        isOnlyReflexive = true;
      }
      if (isOnlyReflexive) {
        setSeActive(true);
      }
    }, [activePronoun, isSeActive, canonicalType]);

    const Line = ({p, q, suffix, removeS, order}: {p:string, q: string, suffix?: string, removeS?: boolean, order: number}) => {
      
      if (order === 1) {
        return (
          <div>
            <C1Wrapper p={p} />{" "}
            <C2Wrapper p={p} suffix={suffix} removeS={removeS}/>{" "}
            <C3Wrapper p={p} q={q} />
          </div>
        )
      } else if (order === 2) {
        return (
          <div>
            <C1Wrapper p={p} />{" "}
            <C3Wrapper p={p} q={q} />{" "}
            <C2Wrapper p={p} suffix={suffix} removeS={removeS}/>
          </div>
        )
      }
    }
  
    return (
      <div className={styles.col}>
        <div className={styles.ten}>{ten}</div>
        {(isNegative) ? (
          <>
            <div>{nw(X.p1[0])}</div>
            <Line p="p2" q="tu" suffix="te" order={1}/>
            <Line p="p3" q={activePronoun? `${activePronoun}` : "ela"} suffix="se" order={1}/>
            <Line p="p4" q="nós" suffix="nos" order={1}/>
            <Line p="p5" q="vós" suffix="vos" order={1}/>
            <Line p="p6" q={activePronoun? `${activePronoun}s` : "elas"} suffix="se" order={1}/>
          </>
        ) : isAfirmative ? (
          <>
            <Line p="p1" q="eu" order={1}/>
            <Line p="p2" q="tu" suffix="te" order={1}/>
            <Line p="p3" q={activePronoun? `${activePronoun}` : "ela"} suffix="se" order={1}/>
            <Line p="p4" q="nós" suffix="nos" removeS={true} order={1}/>
            <Line p="p5" q="vós" suffix="vos" order={1}/>
            <Line p="p6" q={activePronoun? `${activePronoun}s` : "elas"} suffix="se" order={1}/>
          </>
        ) : isInfinitive ? (
          <>
            <Line p="p1" q="eu" suffix="me" order={1}/>
            <Line p="p2" q="tu" suffix="te" order={1}/>
            <Line p="p3" q={activePronoun? `${activePronoun}` : "ela"} suffix="se" order={1}/>
            <Line p="p4" q="nós" suffix="nos" removeS={true} order={1}/>
            <Line p="p5" q="vós" suffix="vos" order={1}/>
            <Line p="p6" q={activePronoun? `${activePronoun}s` : "elas"} suffix="se" order={1}/>
          </>
        ) : (
          <>
            <Line p="p1" q="eu" suffix="me" order={2}/>
            <Line p="p2" q="tu" suffix="te" order={2}/>
            <Line p="p3" q={activePronoun? `${activePronoun}` : "ela"} suffix="se" order={2}/>
            <Line p="p4" q="nós" suffix="nos" removeS={true} order={2}/>
            <Line p="p5" q="vós" suffix="vos" order={2}/>
            <Line p="p6" q={activePronoun? `${activePronoun}s` : "elas"} suffix="se" order={2}/>
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
                    .map((item) => (isSeActive && item !== "---" ? `${nw(item)}-se` : nw(item)))
                    .join(' / ')
                : nw(conjugations.inf.p3[0]) 
                  + (isSeActive && conjugations.inf.p3[0] !== "---" ? "-se" : "")} 
            </span>
          </div>
          <div>
            <strong>Gerúndio: </strong>
            <span>
              {Array.isArray(conjugations.gd.n)
                ? conjugations.gd.n
                    .filter((item) => item !== null)
                    .map((item) => (isSeActive && item !== "---" ? `${nw(item)}-se` : nw(item)))
                    .join(' / ')
                : nw(conjugations.gd.n[0]) 
                  + (isSeActive && conjugations.inf.p3[0] !== "---" ? "-se" : "")}
            </span>
          </div>
          <div>
            <strong>Particípio: </strong>
            <span>
              {Array.isArray(conjugations.pa.n)
                ? conjugations.pa.n
                    .filter((item) => item !== null)
                    .map((item) => (isSeActive && item !== "---" ? `se ${nw(item)}` : nw(item)))
                    .join(' / ')
                : (isSeActive && conjugations.inf.p3[0] !== "---" ? "se " : "") 
                  + nw(conjugations.pa.n[0])}
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
        {isMultiple && (
          <div className={styles.table_tabs_mult_container}>
            <button
              className={`${styles.table_tabs_mult_button} ${
                canonicalType === "canonical1" ? styles.active : styles.inactive
              }`}
              onClick={() => {handleCanonicalClick()}}
            >
              conj 1
            </button>
            <button
              className={`${styles.table_tabs_mult_button} ${
                canonicalType === "canonical2" ? styles.active : styles.inactive
              }`}
              onClick={() => {handleCanonicalClick()}}
            >
              conj 2
            </button>
          </div>
        )}
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
