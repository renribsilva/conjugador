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

  async function addVerbsToJson() {
    try {
      // Carregar arquivos JSON
      const [allVerbsDataStr, rulesByTermDataStr] = await Promise.all([
        fs.promises.readFile(allVerbsPath, 'utf8'),
        fs.promises.readFile(rulesByTermPath, 'utf8')
      ]);

      const allVerbsData: { [key: string]: VerbData } = JSON.parse(allVerbsDataStr);
      const rulesByTermData: RulesByTermData = JSON.parse(rulesByTermDataStr);

      const mainKeys = Object.keys(rulesByTermData);
      const totalKeys = mainKeys.length;

      // Validar verbos sem terminação
      const invalidVerbs = Object.entries(allVerbsData)
        .filter(([_, value]) => value.ending.length === 0)
        .map(([key]) => key);

      console.log(
        invalidVerbs.length === 0
          ? '- Todos os verbos possuem valor na propriedade ending'
          : `- Verbos sem terminação: ${invalidVerbs.join(', ')}`
      );

      console.log('Iniciando a busca por verbos correspondentes a cada terminação...');

      const batchSize = 100;
      let dataChanged = false;
      const startTime = Date.now();

      const specificMainKey: string | null = null;

      for (let index = 0; index < totalKeys; index++) {

        const mainKey = mainKeys[index];
        if (specificMainKey && mainKey !== specificMainKey) {
          continue;
        }

        const progress = Math.floor(((index + 1) / totalKeys) * 100);
        const elapsedTime = Date.now() - startTime;
        const estimatedTotalTime = (elapsedTime / (index + 1)) * totalKeys;
        const remainingTime = estimatedTotalTime - elapsedTime;

        process.stdout.write(
          `- Progresso: ${progress}% | Tempo restante: ${Math.floor(remainingTime / 60000)}min\r`
        );

        if (!rulesByTermData[mainKey]) continue;

        if (!rulesByTermData[mainKey]["..."]) {
          rulesByTermData[mainKey]["..."] = {
            note: {
              plain: ["Terminação não estabelecida"],
              ref: {}
            },
            type: [1],
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
          // console.log(subKeys)

          delete subKeyData.verbs

          if (!subKeyData.verbs) {
            subKeyData.verbs = { total: 0, models: [], entries: {} };
            dataChanged = true;
          }

          const result: { [termEntrie: string]: { [verb: string]: number[] } } = {};

          // Processar em lotes
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

          if (dataChanged) {
            await saveToFile(rulesByTermData, rulesByTermPath);
          }

        }
      }

      if (dataChanged) {
        await saveToFile(rulesByTermData, rulesByTermPath);
      }

      console.log(`Calculando o total de verbos encontrados...`);

      const totalVerbs = Object.values(rulesByTermData)
        .flatMap(mainKeyData =>
          Object.values(mainKeyData)
            .map(subKeyData => subKeyData.verbs?.total || 0)
        )
        .reduce((acc, curr) => acc + curr, 0);

      console.log(`- total: ${totalVerbs}`);

      const seenVerbs = new Set();
      Object.entries(rulesByTermData).forEach(([_, mainKeyData]) => {
        Object.entries(mainKeyData).forEach(([_, subKeyData]) => {
          if (subKeyData.verbs?.entries) {
            Object.entries(subKeyData.verbs.entries).forEach(([verb, _]) => {
              if (seenVerbs.has(verb)) {
                console.log(`Duplicado encontrado: ${verb}`);
              } else {
                seenVerbs.add(verb);
              }
            });
          }
        });
      });

      console.log('\nProgresso: 100%');
      console.log(dataChanged ? 'Dados atualizados com sucesso!' : 'Nenhuma alteração detectada.');
    } catch (error) {
      console.error('Erro ao processar o arquivo:', error);
    }
  }

  // Função para salvar dados no arquivo
  async function saveToFile(data: any, filePath: string) {
    const jsonString = JSON.stringify(data, null, 2).replace(
      /\[\s*([\s\S]*?)\s*\]/g,
      (match, p1) => `[${p1.replace(/\s*,\s*/g, ', ').replace(/\n\s*/g, '')}]`
    );
    await fs.promises.writeFile(filePath, jsonString, 'utf8');
  }

  addVerbsToJson();