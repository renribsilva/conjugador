import fs from 'fs';
import https from 'https';

// Função para baixar a lista de palavras do LibreOffice
export default async function pullLibreOfficeWords(url: string, dest: string): Promise<void> {
  const file = fs.createWriteStream(dest);
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close((err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    }).on('error', (error) => {
      fs.unlink(dest, () => reject(error));
    });
  });
}