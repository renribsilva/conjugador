import fs from 'fs';
import path from 'path';

interface ModelsData {
  [model: string]: {
    ref: string[];
    class: number[];
    total: number[];
  };
}

interface AllVerbsData {
  [verb: string]: {
    verb: string[];
    model: number[];
    ending: string[];
    only_reflexive: boolean[];
    multiple_conj: boolean[];
  };
}

async function updateModelsJson() {
  const modelsPath = path.join(process.cwd(), 'src/json/models.json');
  const allVerbsPath = path.join(process.cwd(), 'src/json/allVerbs.json');

  try {
    const [modelsDataStr, allVerbsDataStr] = await Promise.all([
      fs.promises.readFile(modelsPath, 'utf8'),
      fs.promises.readFile(allVerbsPath, 'utf8'),
    ]);

    const modelsData: ModelsData = JSON.parse(modelsDataStr);
    const allVerbsData: AllVerbsData = JSON.parse(allVerbsDataStr);

    let totalSumModels = 0; 
    let totalSumClass1 = 0; 
    let totalSumClass2 = 0; 
    const totalAllVerbs = Object.keys(allVerbsData).length; // Total de entradas em allVerbs.json

    for (const [modelKey, modelData] of Object.entries(modelsData)) {
      if ('entries' in modelData) {
        delete modelData.entries;
      }

      const totalForModel = Object.values(allVerbsData).filter(verbData =>
        verbData.model.includes(Number(modelKey))
      ).length;

      modelData.total = [totalForModel]; 
      totalSumModels += totalForModel; 

      if (modelData.class.includes(1)) {
        totalSumClass1 += totalForModel;
      }
      if (modelData.class.includes(2)) {
        totalSumClass2 += totalForModel;
      }
    }

    await fs.promises.writeFile(
      modelsPath,
      JSON.stringify(modelsData, null, 2).replace(
        /\[\s*([\s\S]*?)\s*\]/g,
        (match, p1) => `[${p1.replace(/\s*,\s*/g, ', ').replace(/\n\s*/g, '')}]`
      ),
      'utf8'
    );

    console.log('Arquivo models.json atualizado com sucesso!');
    console.log('Total de entradas em allVerbs.json:', totalAllVerbs);
    console.log('- não possuem conjugação estabelecida:', totalAllVerbs - (totalSumClass1 + totalSumClass2));
    console.log('- possuem conjugação estabelecida:', totalSumModels);
    console.log('-- regulares:', totalSumClass1);
    console.log('-- irregulares:', totalSumClass2);
  } catch (error) {
    console.error('Erro ao atualizar o arquivo models.json:', error);
  }
}

updateModelsJson();
