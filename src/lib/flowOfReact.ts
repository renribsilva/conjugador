import { useState, useEffect } from "react";
import { conjVerbByAPI } from "./conjVerbByAPI";
import { ni } from "./normalizeVerb";
import { isValidVerbByAPI } from "./isValidVerbByAPI";
import { getPropsOfVerb } from "./getPropsOfVerb";
import type { Conjugation } from "../types";
import getSimilarVerbs from "./getSimilarWords";
import isValidPrefix from "./isValidPrefix";

export const flowOfReact = () => {
  const [state, setState] = useState<{
    conjugations: Conjugation | null;
    inputValue: string;
    inputReq: string;
    showConjugations: boolean;
    foundVerb: string | null;
    isValidVerb: boolean;
    abundance: object | null | undefined;
    afixo: string | null | undefined;
    ending: string | null | undefined;
    hasTarget: string | boolean | null ;
    note_plain: string[] | null | undefined;
    note_ref: object | null;
    types: string[] | null | undefined;
    loading: boolean;
    suggestions: string[] | null;
    showSuggestions: boolean;
    showButton: boolean;
    isButtonDisabled: boolean;
    showHome: boolean;
    showSobre: boolean;
    showReviewButton: boolean;
    hasNonPrefixVerb: boolean;
    nonPrefixVerb: string | null;
    similar: string[] | null;
    askForSimilar: boolean;
    hasPunct: boolean;
    puncts: string[] | null;
    forced: boolean;
    goThrough: boolean;
    enter: boolean;
    originalInput: string | null

  }>({

    conjugations: null,
    inputValue: "",
    inputReq: "",
    showConjugations: false,
    foundVerb: null,
    isValidVerb: false,
    abundance: null,
    afixo: null,
    ending: null,
    hasTarget: null,
    note_plain: null,
    note_ref: null,
    types: null,
    loading: false,
    suggestions: null,
    showButton: false,
    isButtonDisabled: false,
    showSuggestions: false,
    showHome: true,
    showSobre: false,
    showReviewButton: false,
    hasNonPrefixVerb: false,
    nonPrefixVerb: null,
    similar: null,
    askForSimilar: false,
    hasPunct:false,
    puncts: null,
    forced: false,
    goThrough: false,
    enter: false,
    originalInput: null

  });

  const fetchConjugations = async () => {
    const response = await fetch("/api/queryVerb");
    if (!response.ok) {throw new Error("Erro ao buscar as conjugações");}
    const data: Conjugation = await response.json();
    setState(prev => ({
      ...prev,
      conjugations: data,
    }));
  };

  const handleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {

    if (event.key === "Enter" && state.inputValue !== "") {

      const normalizedInputValue = ni(state.inputValue);
      const suggestions = getSimilarVerbs(state.inputValue);

      setState(prev => ({
        ...prev,
        conjugations: null,
        loading: true,
        inputValue: "",
        inputReq: state.inputValue,
        showConjugations: false,
        suggestions: suggestions,
        showSuggestions: false,
        showButton: false,
        isButtonDisabled: false,
        showHome: false,
        showSobre: false,
        showReviewButton: false,
        hasNonPrefixVerb: false,
        nonPrefixVerb: null,
        askForSimilar: false,

        foundVerb: null,
        isValidVerb: false,
        abundance: null,
        afixo: null,
        ending: null,
        hasTarget: null,
        note_plain: null,
        note_ref: null,
        types: null,
        similar: null,
        hasPunct:false,
        puncts: null,
        forced:false,
        originalInput: null

      }));

      let isRePrefix = isValidPrefix(state.inputValue)
      let hasNonPrefixVerb = false
      let nonPrefixVerb = null

      if ( isRePrefix.isValid ) {

        let or = state.inputValue.replace((isRePrefix.afixo as string), '').replace(/-/g, '');
        const apiRes = await isValidVerbByAPI(ni(or))
        hasNonPrefixVerb = apiRes.result
        nonPrefixVerb = apiRes.findedWord

      }

      setState(prev => ({
        ...prev,
        hasNonPrefixVerb: hasNonPrefixVerb,
        nonPrefixVerb: nonPrefixVerb
      }))

      let result = false;
      let findedWord = "";
      let similar = null
      let hasPunct  = false
      let punct  = null
      let forced = null
      let originalInput = null
  
      if (normalizedInputValue !== "") {

        const apiResponse = await isValidVerbByAPI(normalizedInputValue);

        result = apiResponse.result;
        findedWord = apiResponse.findedWord;
        similar = apiResponse.similar;
        hasPunct = apiResponse.hasPunct;
        punct = apiResponse.punct;
        forced = apiResponse.forced;
        originalInput = apiResponse.originalInput

        // console.log(similar)

      }

      setState(prev => ({
        ...prev,
        originalInput: originalInput
      }))

      if (hasPunct) {

        setState(prev => ({
          ...prev,
          loading: false,
          hasPunct: hasPunct,
          puncts: punct,
          showButton: true,
          conjugations: null,
          isValidVerb: result,
          foundVerb: findedWord

        }));
        return
      }

      if (!result) {

        setState(prev => ({
          ...prev,
          loading: false,
          showButton: true,
          showSuggestions: true,
        }));

      } else {

        if (forced) {
          setState(prev => ({

            ...prev,
            loading: false,
            showButton: true,
            showSuggestions: true,
            forced: forced,
            foundVerb: findedWord

          }));
          return
        }

        if (similar !== null && !state.goThrough) {

          setState(prev => ({
            ...prev,
            loading: false,
            showButton: true,
            showSuggestions: true,
            similar:similar,
            foundVerb: findedWord
          }));
          return
        }

        const propsOfWord = await getPropsOfVerb(normalizedInputValue, result, findedWord);
        
        setState(prev => ({
          ...prev,
          ending: propsOfWord[0].ending,
          hasTarget: propsOfWord[0].hasTarget,
          types: propsOfWord[0].types,
          abundance: propsOfWord[0].abundance,
          note_plain: propsOfWord[0].note_plain,
          note_ref: propsOfWord[0].note_ref,
          afixo: propsOfWord[0].afixo,
          similar: similar,
          showReviewButton: true,
          goThrough: false
        }));
        
        await conjVerbByAPI(ni(findedWord));
        await fetchConjugations();

        setState(prev => ({
          ...prev,
          loading: false,
          showConjugations: true,
        }));
      }
    }

    setState(prev => ({
      ...prev,
      enter:false
    }))

  };

  const dependencies = [
    state.inputReq,
    state.conjugations,
    state.hasTarget,
    state.showConjugations,
    state.foundVerb,
    state.abundance,
    state.afixo,
    state.ending,
    state.note_plain,
    state.note_ref,
    state.types,
    state.isValidVerb,
    state.suggestions,
    state.showButton,
    state.isButtonDisabled,
    state.showSuggestions,
    state.showHome,
    state.showSobre,
    state.showReviewButton,
    state.hasNonPrefixVerb,
    state.nonPrefixVerb,
    state.similar,
    state.askForSimilar,
    state.hasPunct,
    state.puncts,
    state.forced,
    state.goThrough,
    state.originalInput

  ];
  
  useEffect(() => {
    const data = {
      conjugations: state.conjugations,
      inputValue: state.inputValue,
      inputReq: state.inputReq,
      showConjugations: state.showConjugations,
      foundVerb: state.foundVerb,
      isValidVerb: state.isValidVerb,
      abundance: state.abundance,
      afixo: state.afixo,
      ending: state.ending,
      hasTarget: state.hasTarget,
      note_plain: state.note_ref,
      types: state.types,
      loading: state.loading,
      suggestions: state.suggestions,
      showButton: state.showButton,
      isButtonDisabled: state.isButtonDisabled,
      showSuggestions: state.showSuggestions,
      showHome: state.showHome,
      showSobre: state.showSobre,
      showReviewButton: state.showReviewButton,
      hasNonPrefixVerb: state.hasNonPrefixVerb,
      nonPrefixVerb: state.nonPrefixVerb,
      similar: state.similar,
      askForSimilar: state.askForSimilar,
      hasPunct: state.hasPunct,
      puncts: state.puncts,
      forced: state.forced,
      goThrough: state.goThrough,
      originalInput: state.originalInput

    };
  
    console.log(data);
  }, dependencies);

  return {
    state,
    setState,
    handleKeyDown,
  };
};
