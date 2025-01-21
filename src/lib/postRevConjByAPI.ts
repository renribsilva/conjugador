export default async function postRevConjByAPI(data: string, deleteAll: boolean) {
  try {
    const response = await fetch('/api/postRevConj', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data, deleteAll }), // Passando o flag deleteAll
    });

    if (response.ok) {
      const result = await response.json();
      console.log(result.message); // Mensagem de sucesso
    } else {
      const error = await response.json();
      console.error('Erro:', error.error); // Mensagem de erro
    }
  } catch (error) {
    console.error('Erro na requisição:', error);
  }
}
