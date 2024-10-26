// src/lib/conectarBanco.ts

import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import { Conjugation } from '../types';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL, // URL do banco de dados
});

// Tipar o retorno da função
export const queryConjBySQL = async (verb: string): Promise<Conjugation | null> => {
  try {
    // Consulta SQL para obter as conjugações do verbo
    const query = 'SELECT conjugations FROM json WHERE verb = $1';
    const res = await pool.query(query, [verb]);

    // Verifica se a consulta retornou um resultado
    if (res.rows.length === 1) {
      const conjugations: Conjugation = res.rows[0].conjugations; // Retorna as conjugações
      return conjugations;
    } else {
      console.log('Número de conjugações:', res.rows.length);
      return null; // Retorna null se não houver resultados
    }
  } catch (error) {
    console.error('Erro ao obter conjugações:', error);
    throw error; // Lança o erro para tratamento posterior
  }
};
