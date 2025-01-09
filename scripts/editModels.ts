import fs from 'fs';
import path from 'path';

interface VerbEntry {
  [verb: string]: number[];
}

interface VerbData {
  ref: string[];
  entries: string[];
}

interface ModelsData {
  Regular: {
    [model: string]: VerbData;
  };
}

interface RulesByTermData {
  [key: string]: {
    [subKey: string]: {
      verbs?: {
        entries: VerbEntry;
      };
    };
  };
}

async function updateModelsJson() {
  const modelsPath = path.join(process.cwd(), 'src/json/models.json');
  const rulesByTermPath = path.join(process.cwd(), 'src/json/rulesByTerm.json');

  try {
    const [modelsDataStr, rulesByTermDataStr] = await Promise.all([
      fs.promises.readFile(modelsPath, 'utf8'),
      fs.promises.readFile(rulesByTermPath, 'utf8'),
    ]);

    const modelsData: ModelsData = JSON.parse(modelsDataStr);
    const rulesByTermData: RulesByTermData = JSON.parse(rulesByTermDataStr);

    // Iterar sobre os modelos em models.json
    for (const [modelKey, modelData] of Object.entries(modelsData.Regular)) {
      const allEntries: string[] = [];

      // Buscar todos os verbos em rulesByTermData que referenciam o modelo atual
      for (const mainKeyData of Object.values(rulesByTermData)) {
        for (const subKeyData of Object.values(mainKeyData)) {
          if (subKeyData.verbs?.entries) {
            const verbs = Object.keys(subKeyData.verbs.entries).filter(
              verb => subKeyData.verbs?.entries[verb]?.includes(Number(modelKey))
            );
            allEntries.push(...verbs);
          }
        }
      }

      // Atualizar o modelo com os verbos encontrados
      modelsData.Regular[modelKey] = {
        ref: modelData.ref,
        entries: allEntries,
      };
    }

    // Salvar o arquivo atualizado
    await fs.promises.writeFile(
      modelsPath,
      JSON.stringify(modelsData, null, 2),
      'utf8'
    );

    console.log('Arquivo models.json atualizado com sucesso!');
  } catch (error) {
    console.error('Erro ao atualizar o arquivo models.json:', error);
  }
}

updateModelsJson();
