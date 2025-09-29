import { useState, useEffect, useRef } from "react";
import { conjVerbByAPI } from "./conjVerbByAPI";
import { ni } from "./normalizeVerb";
import { isValidVerbByAPI } from "./isValidVerbByAPI";
import type { Conjugation } from "../types";
import getSimilarVerbs from "./getSimilarWords";

export const flowOfReact = () => { 

  const [state, setState] = useState<{
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
    progress: number;
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

    isOnline: boolean | null

  }>({

    conjugations: null,
    inputValue: "",
    inputReq: "",
    showConjugations: false,
    foundVerb: null,
    termination: null,
    termEntrie: null,
    hasTargetCanonical1: null,
    hasTargetCanonical2: null,
    hasTargetAbundance1: null,
    hasTargetAbundance2: null,
    note_plain: null,
    note_ref: null,
    types: null,
    model: null,
    loading: false,
    suggestions: null,
    showButton: false,
    isButtonDisabled: false,
    showSuggestions: false,
    showHome: true,
    showSobre: false,
    showStatistic: false,
    showReviewButton: false,
    goThrough: false,
    enter: false,
    progress: 0,
    isDisabled: false,

    originalVerb: null,
    variationVerb: null,
    result: null,
    findedWord: null,
    similar: null,
    punct: null,

    variations: null,
    varHasVariations: false,
    varProcessedInput: null,
    varForcedVerb: false,
    varPrefixFounded: false,
    varMatchingAfixo: null,
    varConector: null,
    varOriginalInput: null,

    canonical: "canonical1",

    isOnline: null

  });

  const checkConnection = async () => {
    try {
      const response = await fetch("/api/checkConnection");  
      if (!response.ok) {
        setState(prev => ({ ...prev, isOnline: navigator.onLine }));
      }      
      const data = await response.json();
      setState(prev => ({ ...prev, isOnline: data.ok }));
      return data.ok;
    } catch (error) {
      setState(prev => ({ ...prev, isOnline: false }));
      return false;
    }
  };

  useEffect(() => {
    checkConnection().then(isOnline => {
      if (isOnline) {
        isValidVerbByAPI("reabracar");
        isValidVerbByAPI("reabraçar");
        isValidVerbByAPI("descalcar");
        conjVerbByAPI("recomeçar");
        getSimilarVerbs("renato");
        console.log("pré-carregamento ok");
      }
    });
  }, []);

  const fetchConjugationsData = async () => {
    const response = await fetch("/api/queryVerb");
    if (!response.ok) {throw new Error("Erro ao buscar as conjugações");}
    const data: Conjugation = await response.json();
    setState(prev => ({
      ...prev,
      conjugations: data,
    }));
  };

  const updateProgress = (n: number) => {
    setState(prev => ({
      ...prev,
      progress: n,
    }));
  };

  const processEnter = async () => {

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
      showStatistic: false,
      showReviewButton: false,

      foundVerb: null,
      termination: null,
      termEntrie: null,
      hasTargetCanonical: null,
      hasTargetAbundance1: null,
      hasTargetAbundance2: null,
      note_plain: null,
      note_ref: null,
      types: null,
      model: null,

      goThrough: false,
      enter: false,
      progress: 0,
      isDisabled: true,

      originalVerb: null,
      variationVerb: null,
      result: null,
      findedWord: null,
      similar: null,
      punct: null,

      variations: null,
      varHasVariations: false,
      varProcessedInput: null,
      varForcedVerb: false,
      varPrefixFounded: false,
      varMatchingAfixo: null,
      varConector: null,
      varOriginalInput: null,

      canonical: "canonical1",

      isOnline: true

    }));

    if (normalizedInputValue.trim() === "") {

      setState(prev => ({
        ...prev,
        showHome: true,
        loading: false
      }));

      updateProgress(100);

      setState(prev => ({
        ...prev,
        isDisabled: false,
      }));

      return

    }

    const apiResponse = await isValidVerbByAPI(normalizedInputValue);
    const originalVerb = apiResponse.originalVerb;
    const variationVerb = apiResponse.variationVerb;

    updateProgress(50);

    if (normalizedInputValue !== "") {
      
      setState(prev => ({
        ...prev,
        originalVerb: originalVerb,
        variationVerb: variationVerb
      }))

    }

    if (originalVerb === null && variationVerb === null ) {

      setState(prev => ({
        
        ...prev,
        loading: false,
        showButton: true,
      }));

      updateProgress(100);

      setState(prev => ({
        ...prev,
        isDisabled: false,
      }));

      return

    }

    let puncts = null
    puncts = apiResponse.originalVerb?.punct || apiResponse.variationVerb?.punct || null;


    if (originalVerb !== null || variationVerb !== null ) {

      setState(prev => ({          
        ...prev,
        punct: puncts
      }))

    }

    if (puncts !== null) {

      setState(prev => ({
        
        ...prev,
        loading: false,
        showButton: true,
        punct: puncts,
        foundVerb: apiResponse.originalVerb?.findedWord || apiResponse.variationVerb?.findedWord

      }));

      updateProgress(100);

      setState(prev => ({
        ...prev,
        isDisabled: false,
      }));

      return
    }

    //isValidVerb returns
    let result = '';
    let findedWord = ''
    let similar = null
    let punct = null
    let variations = null
    let varHasVariations = false
    let varForcedVerb = false 
    let varProcessedInput = null
    let varOriginalInput = null
    let varPrefixFounded = false 
    let varMatchingAfixo = null
    let varConector = null

    if (variationVerb !== null && originalVerb === null) {

      result = "variationVerb";
      findedWord = apiResponse.variationVerb.findedWord;
      similar = apiResponse.variationVerb.similar;
      variations = apiResponse.variationVerb.variations;
      punct = apiResponse.variationVerb.punct

      varHasVariations = apiResponse.variationVerb.variations.hasVariations;
      varForcedVerb = apiResponse.variationVerb.variations.forcedVerb
      varProcessedInput = apiResponse.variationVerb.variations.processedInput;
      varOriginalInput = apiResponse.variationVerb.variations.originalInput;
      varPrefixFounded = apiResponse.variationVerb.variations.prefixFounded;
      varMatchingAfixo = apiResponse.variationVerb.variations.matchingAfixo;
      varConector = apiResponse.variationVerb.variations.conector;

      setState(prev => ({
        
        ...prev,
        inputReq: state.inputValue,
        loading: false,
        showButton: true,

        result: result,
        findedWord: findedWord,
        similar: similar,
        variations: variations,
        punct: punct,

        varHasVariations: varHasVariations,
        varForcedVerb: varForcedVerb,
        varProcessedInput: varProcessedInput,
        varOriginalInput: varOriginalInput,
        varPrefixFounded: varPrefixFounded,
        varMatchingAfixo: varMatchingAfixo,
        varConector: varConector,

        foundVerb: findedWord,

      }));

      updateProgress(100);

      setState(prev => ({
        ...prev,
        isDisabled: false,
      }));

      return

    }

    if (originalVerb !== null && variationVerb === null) {

      result = "originalVerb";
      findedWord = apiResponse.originalVerb.findedWord;
      similar = apiResponse.originalVerb.similar;
      variations = apiResponse.originalVerb.variations;
      punct = apiResponse.originalVerb.punct

      varHasVariations = apiResponse.originalVerb.variations.hasVariations;
      varForcedVerb = apiResponse.originalVerb.variations.forcedVerb
      varProcessedInput = apiResponse.originalVerb.variations.processedInput;
      varOriginalInput = apiResponse.originalVerb.variations.originalInput;
      varPrefixFounded = apiResponse.originalVerb.variations.prefixFounded;
      varMatchingAfixo = apiResponse.originalVerb.variations.matchingAfixo;
      varConector = apiResponse.originalVerb.variations.conector;

      if  (similar !== null && !state.goThrough) {

        setState(prev => ({

          ...prev,
          inputReq: state.inputValue,
          loading: false,
          showButton: true,

          result: result,
          findedWord: findedWord,
          similar: similar,
          variations: variations,
          punct: punct,

          varHasVariations: varHasVariations,
          varForcedVerb: varForcedVerb,
          varProcessedInput: varProcessedInput,
          varOriginalInput: varOriginalInput,
          varPrefixFounded: varPrefixFounded,
          varMatchingAfixo: varMatchingAfixo,
          varConector: varConector,

          foundVerb: findedWord,

        }));

        updateProgress(100);

        setState(prev => ({
          ...prev,
          isDisabled: false,
        }));
        return
      }

      updateProgress(50);
      
      const propsOfWord = await conjVerbByAPI(ni(findedWord));
      // console.log(propsOfWord)
      
      setState(prev => ({

        ...prev,
        termination: propsOfWord.termination,
        termEntrie: propsOfWord.termEntrie,
        hasTargetCanonical1: propsOfWord.hasTargetCanonical1,
        hasTargetCanonical2: propsOfWord.hasTargetCanonical2,
        hasTargetAbundance1: propsOfWord.hasTargetAbundance1,
        hasTargetAbundance2: propsOfWord.hasTargetAbundance2,
        types: propsOfWord.types,
        note_plain: propsOfWord.note_plain,
        note_ref: propsOfWord.note_ref,
        afixo: propsOfWord.afixo,
        model: propsOfWord.model,

        showReviewButton: true,
        goThrough: false,

        result: result,
        findedWord: findedWord,
        similar: similar,
        variations: variations,
        punct: punct,

        varHasVariations: varHasVariations,
        varForcedVerb: varForcedVerb,
        varProcessedInput: varProcessedInput,
        varOriginalInput: varOriginalInput,
        varPrefixFounded: varPrefixFounded,
        varMatchingAfixo: varMatchingAfixo,
        varConector: varConector,

        foundVerb: findedWord,
        
      }));

      updateProgress(100);

      await fetchConjugationsData();

      setState(prev => ({
        ...prev,
        loading: false,
        showConjugations: true,
      }));

    }

    updateProgress(100);
    
    setState(prev => ({
      ...prev,
      isDisabled: false,
    }));

  }

  const handleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    
    if (event.key === "Enter" && state.inputValue !== "") {      

      const check = await checkConnection();
      
      setState(prev => ({
        ...prev,
        loading: false
      }));
      
      event.preventDefault();
      
      setTimeout(() => {
        (event.target as HTMLInputElement).blur();
      }, 0);
      
      if (!check) {
        setState(prev => ({
          ...prev,
          showHome: false,
          showSobre: false,
          showStatistic: false,
          showConjugations: false,
          loading: false
        }));
        alert("Você está offline. A conjugação não está disponível no momento")
        return
      } else {
        processEnter();
      }
    }
    setState(prev => ({
      ...prev,
      isDisabled: false,
    }));
    return
  };

  const dependencies = [
    state.isDisabled,
  ];

  useEffect(() => {

    if (state.isDisabled) return;

    const data = {
      A_INPUT: {
        inputReq: state.inputReq,
      },
      B_VALIDAÇÃO_DO_VERBO: {
        result: state.result,
        foundVerb: state.foundVerb,
        similar: state.similar,
        punct: state.punct,
        variations: {
          varHasVariations: state.varHasVariations,
          varProcessedInput: state.varProcessedInput,
          varForcedVerb: state.varForcedVerb,
          varPrefixFounded: state.varPrefixFounded,
          varMatchingAfixo: state.varMatchingAfixo,
          varConector: state.varConector,
          varOriginalInput: state.varOriginalInput,
        }
      },
      C_OUTPUT: {
        conjugations: state.conjugations,
        propsOfVerb: {
          hasTargetCanonical1: state.hasTargetCanonical1,
          hasTargetCanonical2: state.hasTargetCanonical2,
          hasTargetAbundance1: state.hasTargetAbundance1,
          hasTargetAbundance2: state.hasTargetAbundance2,
          termination: state.termination,
          termEntrie: state.termEntrie,
          types: state.types,
          note_plain: state.note_plain, 
          note_ref: state.note_ref,
          model: state.model
        },
        suggestions: state.suggestions,
      },
      D_CONTROLADORES_DE_FLUXO: {
        showConjugations: state.showConjugations,
        canonical: state.canonical,
        loading: state.loading,
        showButton: state.showButton,
        isButtonDisabled: state.isButtonDisabled,
        showSuggestions: state.showSuggestions,
        showHome: state.showHome,
        showSobre: state.showSobre,
        showStatistic: state.showStatistic,
        showReviewButton: state.showReviewButton,
        goThrough: state.goThrough,
        enter: state.enter,
        progress: state.progress,
        isDisabled: state.isDisabled
      },
    };
  
    console.log(data);
  }, dependencies); 

  return {
    state,
    setState,
    handleKeyDown,
    checkConnection
  };
};