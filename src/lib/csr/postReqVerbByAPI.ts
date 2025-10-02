'use client'

export default async function postReqVerbByAPI(data: string, type: string) {
  try {
    await fetch('/api/postReqVerb', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data, type }),
    });
    return true
  } catch {
    return false
  }
}
