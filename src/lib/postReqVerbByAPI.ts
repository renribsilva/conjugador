export default async function postReqVerbByAPI(data: string, type: string) {
  try {
    const response = await fetch('/api/postReqVerb', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data, type }),
    });

    if (response.ok) {
      const result = await response.json();
      console.log(result.message); 
    } else {
      const error = await response.json();
      console.error('Erro:', error.error); 
    }
  } catch (error) {
    console.error('Erro na requisição:', error);
  }
}
