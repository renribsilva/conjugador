// pages/api/saveVerb.js

import fs from 'fs/promises'; // Importa fs/promises para usar async/await
import path from 'path';
import { conjugateVerb } from '../../lib/conjugateVerb'; // Importe a função de conjugação

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { verb } = req.body;

    // Verifica se o verbo foi fornecido
    if (!verb) {
      return res.status(400).json({ message: 'verbo não fornecido em conjVerb' });
    }

    // Conjugue o verbo usando a função importada
    const conjugations = conjugateVerb(verb);

    // Verifica se as conjugações são válidas
    if (!conjugations) {
      return res.status(500).json({ message: 'conjugateVerb() em conVerbs failed' });
    }

    // Define o caminho onde você quer salvar o arquivo JSON
    const jsonDir = path.join(process.cwd(), 'src', 'json');

    // Cria o diretório se não existir
    await fs.mkdir(jsonDir, { recursive: true });

    // Define o caminho do arquivo como file.json
    const filePath = path.join(jsonDir, 'file.json'); // Nome do arquivo fixo

    try {
      // Escreve o arquivo JSON com o verbo e suas conjugações
      await fs.writeFile(filePath, JSON.stringify({ verb, conjugations }, null, 2), 'utf8');
      return res.status(200).json({ message: 'file.json salvo com sucesso por conjVerb', verb, conjugations, filePath });
    } catch (error) {
      console.error('Erro ao salvar o arquivo:', error);
      return res.status(500).json({ message: 'Erro ao escrever file.json por conjVerb' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
