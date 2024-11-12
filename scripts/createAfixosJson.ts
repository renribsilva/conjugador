import fs from 'fs';
import path from 'path';

function createAfixosJson() {
  const caminhoTxt = path.join(process.cwd(), 'assets', 'afixos.txt');
  const caminhoJson = path.join(process.cwd(), 'src', 'json', 'afixos.json');

  try {
    // Lê o arquivo de texto
    const dados = fs.readFileSync(caminhoTxt, 'utf-8');

    // Divide o conteúdo em linhas e remove linhas vazias
    const linhas = dados.split('\n').map(linha => linha.trim()).filter(Boolean);

    // Converte as linhas em um array JSON
    const jsonData = JSON.stringify(linhas, null, 2);

    // Escreve o arquivo JSON
    fs.writeFileSync(caminhoJson, jsonData, 'utf-8');

    console.log('Arquivo JSON criado com sucesso em:', caminhoJson);
  } catch (erro) {
    console.error('Erro ao processar o arquivo:', erro);
  }
}

createAfixosJson()