import fs from 'fs/promises';
import path from 'path';

const listsDir = path.join(process.cwd(), 'lists');

async function rewriteNewVerbsToNewFile(): Promise<void> {
  try {
    const filePath = path.join(listsDir, 'newVerbs.txt');
    const newFilePath = path.join(listsDir, 'newVerbs2.txt');

    // Lê o conteúdo do arquivo
    const fileContent = await fs.readFile(filePath, 'utf8');

    // Cria um Set para eliminar duplicatas e ordena os verbos
    const sortedVerbs = Array.from(new Set(fileContent.split('\n').map(line => line.trim()).filter(Boolean)))
      .sort();

    // Reescreve os verbos ordenados no novo arquivo
    await fs.writeFile(newFilePath, sortedVerbs.join('\n'), 'utf8');

    console.log(`Arquivo ${newFilePath} reescrito com sucesso em ordem alfabética.`);
  } catch (error) {
    console.error('Erro ao processar o arquivo:', error.message);
  }
}

// Executa a função
rewriteNewVerbsToNewFile();
