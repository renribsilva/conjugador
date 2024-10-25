// pages/api/findVerb.js
import fs from 'fs/promises';
import path from 'path';

export default async function handler(req, res) {
  const { verb } = req.query; // Obtém o verbo da query string

  // Caminho para o arquivo JSON
  const filePath = path.join(process.cwd(), 'src/json/allVerbs.json');

  try {
    // Lendo o arquivo JSON
    const data = await fs.readFile(filePath, 'utf-8');
    const jsonObject = JSON.parse(data);

    // Verificando se a chave existe e retornando a primeira string do array
    if (jsonObject.hasOwnProperty(verb)) {
      return res.status(200).json({ result: jsonObject[verb][0] });
    } else {
      return res.status(404).json({ error: 'Verbo não encontrado por findedVerb.' });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao processar o arquivo JSON por findedVerb: ' + err.message });
  }
}
