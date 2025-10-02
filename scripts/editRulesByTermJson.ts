import fs from 'fs';
import path from 'path'; 
import { ni } from '../src/lib/ssr/normalizeVerb';
import { conjugateVerb } from '../src/lib/ssr/conjugateVerb';
import allVerbsJson from "../public/json/allVerbs.json"
import regJson from "../public/json/rulesByTerm.json"

interface VerbData {
  verb: string[];
  model: number[];
  ending: string[]; 
  pronominal: boolean[];
}

interface ModelsData {
  [model: string]: {
    ref: string[];
    class: number[];
    total: number[];
  };
}

interface RulesByTermData {
  [key: string]: {
    [subKey: string]: {
      verbs?: { 
        total: number; 
        models: number[]; 
        entries: { [verb: string]: number[] }; 
      }; 
      [key: string]: any;
    };
  };
}

const allVerbsPath = path.join(process.cwd(), 'src/json/allVerbs.json');
const rulesByTermPath = path.join(process.cwd(), 'src/json/rulesByTerm.json');
const modelsPath = path.join(process.cwd(), 'src/json/models.json');

// SUBSTITUA NULL POR UMA TERMINAÇÃO VERBAL ESPECÍFICA PARA EXECUTAR O SCRIPT SELETIVAMENTE
const specificMainKeyObject = null

async function editRulesByTerm() {

  async function X (verb: string) {
    const props = (await conjugateVerb(ni(verb), allVerbsJson)).propOfVerb;
    return props
  }
  
  try {
    
    const [allVerbsDataStr, rulesByTermDataStr, modelsDataStr] = await Promise.all([
      fs.promises.readFile(allVerbsPath, 'utf8'),
      fs.promises.readFile(rulesByTermPath, 'utf8'),
      fs.promises.readFile(modelsPath, 'utf8')
    ]);

    const allVerbsData: { [key: string]: VerbData } = JSON.parse(allVerbsDataStr);
    const rulesByTermData: RulesByTermData = JSON.parse(rulesByTermDataStr);
    const modelsData: ModelsData = JSON.parse(modelsDataStr);

    const mainKeys = Object.keys(rulesByTermData);
    const totalKeys = mainKeys.length;

    console.log("Iniciando verificação de terminações em allVerbs.json...")

    const invalidVerbs = Object.entries(allVerbsData)
      .filter(([_, value]) => value.ending.length === 0)
      .map(([key]) => key);

    console.log (
      invalidVerbs.length === 0
        ? '- todos os verbos possuem valor na propriedade ending'
        : `- verbos sem terminação: ${invalidVerbs.join(', ')}`
    );

    console.log('Iniciando a busca por verbos correspondentes a cada terminação...');

    const batchSize = 100;
    let dataChanged = false;
    const startTime = Date.now();

    let specificMainKey: string | string[] | null = specificMainKeyObject

    if (Array.isArray(specificMainKey)) {
      specificMainKey = Array.from(new Set(specificMainKey));
    }

    for (let index = 0; index < totalKeys; index++) {
      const mainKey = mainKeys[index];
      
      if (
        specificMainKey &&
        ((Array.isArray(specificMainKey) && !specificMainKey.includes(mainKey)) ||
        (!Array.isArray(specificMainKey) && mainKey !== specificMainKey))
      ) {
        continue;
      }

      const progress = Math.floor(((index + 1) / totalKeys) * 100);
      const elapsedTime = Date.now() - startTime;
      const estimatedTotalTime = (elapsedTime / (index + 1)) * totalKeys;
      const remainingTime = estimatedTotalTime - elapsedTime;

      process.stdout.write(
        `- progresso: ${progress}% | Tempo restante: ${Math.floor(remainingTime / 60000)}min\r`
      );

      if (!rulesByTermData[mainKey]) continue;

      if (!rulesByTermData[mainKey]["..."]) {
        rulesByTermData[mainKey]["..."] = {
          type: [1],
          note: {
            plain: [],
            ref: {}
          },
          abundance1: {},
          canonical1: {}
        };

        dataChanged = true;
      }

      const filteredVerbs = Object.entries(allVerbsData)
      .filter(([_, value]) => value.ending.includes(mainKey))
      .map(([key]) => key);

      const subKeys = Object.keys(rulesByTermData[mainKey]).sort();

      for (const subKey of subKeys) {

        const subKeyData = rulesByTermData[mainKey][subKey];

        if (!subKeyData.verbs) {
          subKeyData.verbs = { total: 0, models: [], entries: {} };
          dataChanged = true;
        }

        const result: { [termEntrie: string]: { [verb: string]: number[] } } = {};

        for (let i = 0; i < filteredVerbs.length; i += batchSize) {
          const batch = filteredVerbs.slice(i, i + batchSize);

          // ESSA FUNÇÃO FOI ALTERADA QUANDO GETPROPSOSVERBS FOI SUBSTITUÍDA POR CONJUGATEVERB... FALTAM TESTES
          const verbPropsPromises = batch.map(verb => {
            const props = X(verb);
            if (props) {
              const termEntrie = props[0].termEntrie ?? '';
              if (!result[termEntrie]) {
                result[termEntrie] = {};
              }
              result[termEntrie][verb] = allVerbsData[verb]?.model || [];
            }
          });

          await Promise.all(verbPropsPromises);
        }

        const newEntries = result[subKey] || {};

        subKeyData.verbs.entries = newEntries;
        subKeyData.verbs.total = Object.keys(newEntries).length;
        subKeyData.verbs.models = Object.values(newEntries)
          .flat()
          .filter((value, index, self) => self.indexOf(value) === index);

        dataChanged = true;

        const allClassesForModels: number[] = [];

        for (const model of subKeyData.verbs.models) {
          if (modelsData[model]) {
            allClassesForModels.push(...modelsData[model].class);
          }
        }

        let uniqueClasses = Array.from(new Set(allClassesForModels));
        if (uniqueClasses.includes(1) && uniqueClasses.includes(2)) {
          uniqueClasses = uniqueClasses.filter((value) => value !== 1); 
        }

        subKeyData.type = subKeyData.abundance1 && Object.entries(subKeyData.abundance1).length > 0
          ? [...uniqueClasses, 4]
          : uniqueClasses.length === 0
          ? [1]
          : uniqueClasses;

        const reorderedSubKeyData = { type: subKeyData.type, ...subKeyData };
        rulesByTermData[mainKey][subKey] = reorderedSubKeyData;

        if (dataChanged) {
          await saveToFile(rulesByTermData, rulesByTermPath);
        }

        if (subKey === "..." && Object.entries(subKeyData.verbs.entries).length === 0) {
          subKeyData.note.plain = []
        }
      }
    } 

    if (dataChanged) {
      await saveToFile(rulesByTermData, rulesByTermPath);
    }

    console.log('- progresso: 100%');

    console.log(`Calculando o total de verbos encontrados...`);

    const totalVerbs = Object.values(rulesByTermData)
      .flatMap(mainKeyData =>
        Object.values(mainKeyData)
          .map(subKeyData => subKeyData.verbs?.total || 0)
      )
      .reduce((acc, curr) => acc + curr, 0);

    console.log(`- total: ${totalVerbs}`);

    console.log("Verificando a ocorrência de verbos em mais de uma terminação...")

    const seenVerbs = new Set();
    Object.entries(rulesByTermData).forEach(([_, mainKeyData]) => {
      Object.entries(mainKeyData).forEach(([_, subKeyData]) => {
        if (subKeyData.verbs?.entries) {
          Object.entries(subKeyData.verbs.entries).forEach(([verb, _]) => {
            if (seenVerbs.has(verb)) {
              console.log(`- ${verb}`);
            } else {
              seenVerbs.add(verb);
            }
          });
        }
      });
    });

    console.log(`Calculando o total de terminações verbais...`);
    const totalTerm = Object.entries(rulesByTermData).length
    console.log(`- total: ${totalTerm}`);

    console.log(`Verificando as 3 terminações com mais verbos...`);

    const totals: { mainKey: string; total: number }[] = [];

    Object.entries(rulesByTermData).forEach(([mainKey, mainKeyData]) => {
      let mainKeyTotal = 0;
      Object.values(mainKeyData).forEach((subKeyData) => {
        mainKeyTotal += subKeyData.verbs?.total || 0;
      });
      totals.push({ mainKey, total: mainKeyTotal });
    });

    totals.sort((a, b) => b.total - a.total);

    const top3 = totals.slice(0, 3);

    top3.forEach((entry, index) => {
      console.log(`- ${entry.mainKey}: ${entry.total}`);
    });

    await compareAndLogMissingVerbs(allVerbsData, rulesByTermData);

    console.log(dataChanged ? 'Dados atualizados com sucesso!' : 'Nenhuma alteração detectada.');
  } catch (error) {
    console.error('Erro ao processar o arquivo:', error);
  }
}

async function compareAndLogMissingVerbs(
  allVerbsData: { [key: string]: VerbData },
  rulesByTermData: RulesByTermData
) {
  console.log('Comparando verbos de allVerbs.json com verbos em rulesByTerm.json...');
  const entries = extractVerbsEntries(rulesByTermData);

  const entryOfArray = Object.keys(entries);
  const allVerbsArray = Object.keys(allVerbsData);
  const missingVerbs = allVerbsArray.filter(verb => !entryOfArray.includes(verb));

  if (missingVerbs.length > 0 && entryOfArray.length !== allVerbsArray.length) {
    console.log(`- verbos ausentes: ${missingVerbs.join(', ')}`);
  } else if (entryOfArray.length === allVerbsArray.length) {
    console.log('- todos os verbos de allVerbsData estão presentes nos entries.');
  } else {
    console.log('- ocorreu algum problema na verificação.');
  }
}

function extractVerbsEntries(rulesByTermData: RulesByTermData): { [key: string]: number[] } {
  const allEntries: { [verb: string]: number[] } = {};

  for (const mainKey in rulesByTermData) {
    const mainKeyData = rulesByTermData[mainKey];
    for (const subKey in mainKeyData) {
      const subKeyData = mainKeyData[subKey];
      if (subKeyData.verbs?.entries) {
        Object.entries(subKeyData.verbs.entries).forEach(([verb, models]) => {
          if (!allEntries[verb]) {
            allEntries[verb] = [];
          }
          allEntries[verb] = Array.from(new Set([...allEntries[verb], ...models]));
        });
      }
    }
  }
  return allEntries;
}

async function saveToFile(data: any, filePath: string) {
  const jsonString = JSON.stringify(data, null, 2).replace(
    /\[\s*([\s\S]*?)\s*\]/g,
    (_, p1) => `[${p1.replace(/\s*,\s*/g, ', ').replace(/\n\s*/g, '')}]`
  );
  await fs.promises.writeFile(filePath, jsonString, 'utf8');
}

editRulesByTerm();