import fs from 'fs';
import path from 'path'; 
import { getPropsOfVerb } from '../src/lib/getPropsOfVerb';
import { ni } from '../src/lib/normalizeVerb';

interface VerbData {
  verb: string[];
  model: number[];
  ending: string[]; 
  pronominal: boolean[];
}

interface RulesByTermData {
  [key: string]: {
    [subKey: string]: {
      verbs?: { [verb: string]: number[] }; 
      [key: string]: any;
    };
  };
}

const allVerbsPath = path.join(process.cwd(), 'src/json/allVerbs.json');
const rulesByTermPath = path.join(process.cwd(), 'src/json/rulesByTerm.json');

async function addVerbsToJson() {
  try {
    const [allVerbsDataStr, rulesByTermDataStr] = await Promise.all([
      fs.promises.readFile(allVerbsPath, 'utf8'),
      fs.promises.readFile(rulesByTermPath, 'utf8')
    ]);

    const allVerbsData: { [key: string]: VerbData } = JSON.parse(allVerbsDataStr);
    const rulesByTermData: RulesByTermData = JSON.parse(rulesByTermDataStr);

    const mainKeys = Object.keys(rulesByTermData);
    const totalKeys = mainKeys.length;

    const verbFilter = (verbData: VerbData, mainKey: string) => 
      Array.isArray(verbData.ending) && verbData.ending.includes(mainKey);

    console.log("Iniciando a busca por verbos correspondentes a cada terminação...");

    let dataChanged = false; 

    for (let index = 0; index < totalKeys; index++) {

      // const mainKey = "por";
      const mainKey = mainKeys[index];
      const progress = Math.floor(((index + 1) / totalKeys) * 100);
      process.stdout.write(`- progresso: ${progress}%\r`);

      if (rulesByTermData[mainKey]) {
        const subKeys = Object.keys(rulesByTermData[mainKey]);

        for (const subKey of subKeys) {

          const result: { [termEntrie: string]: { [verb: string]: number[] } } = {};

          let filteredVerbs = Object.entries(allVerbsData)
            .filter(([key, value]) => verbFilter(value, mainKey))
            .map(([key, value]) => value.verb[0]);

          const verbPropsPromises = filteredVerbs.map(verb =>
            getPropsOfVerb(ni(verb), true, verb)
              .then(props => {
                if (props && props.length > 0) {
                  const termEntrie = props[0].termEntrie ?? '';

                  if (!result[termEntrie]) {
                    result[termEntrie] = {};
                  }

                  const models = allVerbsData[verb]?.model || [];
                  result[termEntrie][verb] = models;

                }
              })
          );

          await Promise.all(verbPropsPromises);

          if (typeof rulesByTermData[mainKey][subKey] === 'object' 
                && rulesByTermData[mainKey][subKey] !== null) {
            // Verifica se a alteração vai acontecer
            const previousVerbs = rulesByTermData[mainKey][subKey].verbs || [];
            const newVerbs = result[subKey] || [];
            // rulesByTermData[mainKey][subKey].test = [false];
            // delete rulesByTermData[mainKey][subKey].test;

            if (JSON.stringify(previousVerbs) !== JSON.stringify(newVerbs)) {
              dataChanged = true;  // Marcar que houve alteração
            }

            // Atualiza os dados
            rulesByTermData[mainKey][subKey].verbs = newVerbs;
          }
        }
      }
    }

    process.stdout.write('Progresso: 100%\n');
    console.log("Editando o arquivo rulesByTerm.json...");

    // Só reescreve o arquivo se houve alterações
    if (dataChanged) {
      
      await fs.promises.writeFile(
        rulesByTermPath,
        JSON.stringify(rulesByTermData, null, 2)
          .replace(/\[\s*([\s\S]*?)\s*\]/g, (match, p1) => 
            `[${p1.replace(/\s*,\s*/g, ', ').replace(/\n\s*/g, '')}]`),
        'utf8'
      );

      console.log('A edição terminou com sucesso!');
    } else {
      console.log('Nenhuma alteração detectada. Nenhum arquivo foi escrito.');
    }
  } catch (error) {
    console.error('Erro ao processar o arquivo:', error);
  }
}

addVerbsToJson();
