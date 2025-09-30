import { Conjugation } from "../types";

export async function queryVerbByAPI() {
  try {
    const response = await fetch(`/api/queryVerb`, {
      method: 'GET',
    });
    if (response.ok) {
      if (response.ok) {
        const data: Conjugation = await response.json();
        return data
      } else {
        return null
      }
    }
  } catch (error) {
    return null
  }
}