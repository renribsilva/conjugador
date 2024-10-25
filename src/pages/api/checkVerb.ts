import fs from 'fs/promises'; // Usando a versão de promessas do módulo fs
import path from 'path';

// Função para ler o arquivo JSON e verificar se o verbo está contido
export default async function handler(req, res) {
  // Verifica se o método é POST
  if (req.method === 'POST') {
    const { verb } = req.body; // Obtém o verbo do corpo da requisição

    // Caminho para o arquivo JSON
    const filePath = path.join(process.cwd(), 'src/json/allVerbs.json');

    try {
      // Lendo o arquivo JSON
      const data = await fs.readFile(filePath, 'utf-8');

      // Convertendo o JSON lido para um objeto
      const jsonObject = JSON.parse(data);

      // Verificando se o verbo está nas chaves do objeto
      const exists = jsonObject.hasOwnProperty(verb);

      // Retornando a resposta
      return res.status(200).json({ exists });
    } catch (err) {
      // Tratando erros de leitura e parsing
      if (err.code === 'ENOENT') {
        return res.status(404).json({ error: 'Arquivo não encontrado por checkVerb.' });
      }
      return res.status(500).json({ error: 'Erro ao processar o arquivo JSON por checkVerb: ' + err.message });
    }
  } else {
    // Responde com método não permitido se não for POST
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Método ${req.method} não permitido.`);
  }
}
