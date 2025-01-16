import fs from 'fs';
import path from 'path'; 
import { getPropsOfVerb } from '../src/lib/getPropsOfVerb';
import { ni } from '../src/lib/normalizeVerb';
import processVerbsFile from './editAllVerbJson';

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

async function addVerbsToJson() {
  
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

    let specificMainKey: string | string[] | null = null
    if (Array.isArray(specificMainKey)) {
      specificMainKey = Array.from(new Set(specificMainKey));
    }

    for (let index = 0; index < totalKeys; index++) {
      const mainKey = mainKeys[index];
      
      // Verifica se specificMainKey é um array e não contém mainKey, ou se é uma string que não é igual a mainKey
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
            plain: ["Terminação não estabelecida"],
            ref: {}
          },
          abundance1: {},
          rules: {},
          test: [false]
        };

        dataChanged = true;
      }

      // Filtrar verbos correspondentes ao mainKey
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

          const verbPropsPromises = batch.map(verb =>
            getPropsOfVerb(ni(verb), true, verb).then(props => {
              if (props && props.length > 0) {
                const termEntrie = props[0].termEntrie ?? '';
                if (!result[termEntrie]) {
                  result[termEntrie] = {};
                }
                result[termEntrie][verb] = allVerbsData[verb]?.model || [];
              }
            })
          );

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
      
        subKeyData.type = subKeyData.abundance1 && Object.entries(subKeyData.abundance1).length > 0
        ? Array.from(new Set([...allClassesForModels, 4]))
        : Array.from(new Set(allClassesForModels)).length === 0 
        ? Array.from(new Set([1]))
        : Array.from(new Set(allClassesForModels))

        const reorderedSubKeyData = { type: subKeyData.type, ...subKeyData };
        rulesByTermData[mainKey][subKey] = reorderedSubKeyData;

        if (dataChanged) {
          await saveToFile(rulesByTermData, rulesByTermPath);
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

    let maxMainKey = '';
    let maxTotal = 0;

    console.log(`Verificando terminação com maior quantidade de verbos...`)

    Object.entries(rulesByTermData).forEach(([mainKey, mainKeyData]) => {
      Object.entries(mainKeyData).forEach(([subKey, subKeyData]) => {
        const total = subKeyData.verbs?.total || 0;
        if (total > maxTotal) {
          maxTotal = total;
          maxMainKey = mainKey;
        }
      });
    });

    console.log(`- mainKey com mais verbos: ${maxMainKey}`);
    console.log(`- total: ${maxTotal}`);

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
    (match, p1) => `[${p1.replace(/\s*,\s*/g, ', ').replace(/\n\s*/g, '')}]`
  );
  await fs.promises.writeFile(filePath, jsonString, 'utf8');
}

async function executeInOrder() {
  // await processVerbsFile(); 
  await addVerbsToJson();
}

executeInOrder();