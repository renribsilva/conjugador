// Função para chamar a API e passar a string
export default async function postReqConjByAPI(data) {
  try {
    // Chama a API usando fetch e passa a string como JSON
    const response = await fetch('api/postReqConj', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Define o tipo do conteúdo como JSON
      },
      body: JSON.stringify({ data }), // Passa a string 'data' no corpo da requisição
    });

    // Checa se a resposta foi bem-sucedida
    if (response.ok) {
      const result = await response.json();
      console.log(result.message); // Exibe a mensagem de sucesso
    } else {
      const error = await response.json();
      console.error('Erro:', error.error); // Exibe o erro, se houver
    }
  } catch (error) {
    console.error('Erro na requisição:', error);
  }
}
