'use client'

import { useState, useEffect } from "react";
import { ni } from "../ssr/normalizeVerb";
import type { flowTypes } from "../../types";
import { initialFlow } from "../ssr/certainObjects";   

export const flowOfReact = () => { 

  const [state, setState] = useState<flowTypes>(initialFlow);

  useEffect(() => {
    async function warmUpAPI() {
      const [{ isValidVerbByAPI }, { conjVerbByAPI }] = 
        await Promise.all([
          import("./isValidVerbByAPI"),
          import("./conjVerbByAPI")
        ]);
      // dispara sem precisar esperar resposta
      void isValidVerbByAPI("recomeçar");
      void conjVerbByAPI("realçar");
      console.log("Warm-up de API feito");
    }
    setTimeout(() => {
      warmUpAPI();
    }, 2000)
  }, []);

  // useEffect (() => {
  //   async function cachear () {
  //     const cacheNames = await caches.keys();
  //     console.log("Lista de caches:", cacheNames)
  //     for (const name of cacheNames) {
  //       const cache = await caches.open(name);
  //       const requests = await cache.keys();
  //       if (!requests.length) {
  //         console.log(`Cache de ${name} vazio`);
  //         continue;
  //       }
  //       for (const req of requests) {
  //         const response = await cache.match(req);
  //         if (response) {
  //           const contentType = response.headers.get("content-type") || "";
  //           if (contentType.includes("application/json")) {
  //             const data = await response.json();
  //             console.log(`Conteúdo de ${name}`, data);
  //           }
  //         }
  //       }
  //     }      
  //   }
  //   cachear();
  // },[])

  const updateProgress = (n: number | null) => {
    setTimeout(() => {
      setState(prev => ({ ...prev, progress: n }));
    }, 0);
  };

  const handleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {

    updateProgress(null)

    if (event.key === "Enter" && state.inputValue !== "") {      
      event.preventDefault();      
      setTimeout(() => {
        (event.target as HTMLInputElement).blur();
      }, 0);
      setTimeout(() => {
        processEnter();
      }, 0)     
    }

    // updateProgress(null)
    
    setState(prev => ({
      ...prev,
      isDisabled: false,
    }));
    
    return

  };

  const processEnter = async () => {

    updateProgress(0)

    const { isValidVerbByAPI } = await import("./isValidVerbByAPI");
    const { getSimilarVerbs } = await import("../ssr/getSimilarWords");
    const { conjVerbByAPI } = await import("./conjVerbByAPI");

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
      progress: null,
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

    }));

    if (normalizedInputValue.trim() === "") {

      setState(prev => ({
        ...prev,
        showHome: true,
        loading: false
      }));

      updateProgress(100)

      setState(prev => ({
        ...prev,
        isDisabled: false,
      }));

      return

    }

    const apiResponse = await isValidVerbByAPI(normalizedInputValue);
    // console.log("resposta de isValidVerbByAPI no flow:", apiResponse)
    const originalVerb = apiResponse.originalVerb;
    const variationVerb = apiResponse.variationVerb;

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

      updateProgress(50)

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

      updateProgress(100)

      const conjData = await conjVerbByAPI(ni(findedWord));
      // console.log("resposta de conVerbByAPI no flow:", conjData)
      const propsOfWord = conjData.propOfVerb
      const conjugations = conjData.conjugations
      
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

      setState(prev => ({
        ...prev,
        conjugations: conjugations,
        loading: false,
        showConjugations: true,
      }));

    }

    updateProgress(100);
    
    setState(prev => ({
      ...prev,
      isDisabled: false,
    }));

    return

  }

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
        isDisabled: state.isDisabled,
        postReq: state.postReq
      },
    };
  
    console.log(data);
  }, dependencies); 

  return {
    state,
    setState,
    handleKeyDown
  };
};