export default async function checkVerbByAPI(verb) {
  try {
    const response = await fetch('/api/checkVerb', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ verb }),
    });

    const data = await response.json();
    return data.exists; // Retorna true ou false
  } catch (error) {
    console.error('checkVerbByAPI Failed:', error);
    return null; 
  }
}
