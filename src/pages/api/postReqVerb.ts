// /pages/api/addToFile.js
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  // Só responde a requisições POST
  if (req.method === 'POST') {
    const { data } = req.body;

    if (!data) {
      return res.status(400).json({ error: 'A string "data" é obrigatória.' });
    }

    // Caminho do arquivo onde vamos gravar a string
    const filePath = path.join(process.cwd(), 'assets', 'reqToDo', 'reqVerbs.txt');

    // Verifica se o diretório existe, se não, cria
    if (!fs.existsSync(path.dirname(filePath))) {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
    }

    // Escreve a string no arquivo (adicionando no final)
    fs.appendFileSync(filePath, data + '\n', 'utf8');

    // Responde com sucesso
    return res.status(200).json({ message: `String '${data}' foi adicionada ao arquivo.` });
  } else {
    // Retorna erro para métodos que não sejam POST
    return res.status(405).json({ error: 'Método não permitido.' });
  }
}
