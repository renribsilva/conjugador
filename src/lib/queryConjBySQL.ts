import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import { Conjugation } from '../types';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL, 
});


export const queryConjBySQL = async (verb: string): Promise<Conjugation | null> => {
  try {
    
    const query = 'SELECT conjugations FROM json WHERE verb = $1';
    const res = await pool.query(query, [verb]);

    
    if (res.rows.length === 1) {
      const conjugations: Conjugation = res.rows[0].conjugations; 
      return conjugations;
    } else {
      console.log('Número de conjugações:', res.rows.length);
      return null; 
    }
  } catch (error) {
    console.error('Erro ao obter conjugações:', error);
    throw error; 
  }
};
