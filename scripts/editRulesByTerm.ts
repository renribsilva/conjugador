import fs from "fs/promises";
import path from "path";

// Definindo o tipo para cada verbo
interface Verb {
  verb: string[];
  model: number[];
  ending: string[];
  pronominal: boolean[];
}

// Definindo o tipo para a estrutura de cada regra
interface RuleData {
  verb: string[];
  model: number[];
  ending: string[];
  pronominal: boolean[];
  verbs?: Record<string, string[]>; // Verbs serão adicionados com chave ending
  test?: Record<string, number[]>;
  note?: {
    plain: string[];
    ref: Record<string, string[]>;
  };
  type?: number[];
  abundance1?: Record<string, unknown>;
  rules?: Record<string, unknown>;
}

// Função para listar as regras a partir do arquivo JSON
async function listRulesByTerm() {
  const filePath = path.join(process.cwd(), "src", "json", "rulesByTerm.json");
  const data = await fs.readFile(filePath, "utf-8");
  return JSON.parse(data);
}

// Função para listar os verbos que terminam com o sufixo especificado
async function listVerbsByEnding(ending: string) {
  try {
    const basePath = path.join(process.cwd(), "src", "json");
    const verbsFilePath = path.join(basePath, "allVerbs.json");

    const verbsData = await fs.readFile(verbsFilePath, "utf-8");
    const verbs: Record<string, Verb> = JSON.parse(verbsData);

    // Filtra os verbos que terminam com o sufixo desejado
    const filteredVerbs = Object.entries(verbs)
      .filter(([key, value]) => value.ending.includes(ending))
      .map(([key, value]) => value.verb);

    return filteredVerbs.flat(); // Retorna todos os verbos em um único array
  } catch (error) {
    console.error("Erro ao processar os arquivos JSON:", error);
    throw error;
  }
}

// Função para adicionar os verbos ao arquivo rulesByTerm.json
async function addVerbsToRules() {
  try {
    const rulesFilePath = path.join(process.cwd(), "src", "json", "rulesByTerm.json");
    const rulesData = await fs.readFile(rulesFilePath, "utf-8");
    const rules: Record<string, RuleData> = JSON.parse(rulesData); // Define o tipo das regras

    // Iterar sobre cada entrada em rulesByTerm
    for (const [term, ruleData] of Object.entries(rules)) {
      const endings = ruleData.ending || [];

      // Para cada ending, buscar os verbos correspondentes
      for (const ending of endings) {
        const verbsWithEnding = await listVerbsByEnding(ending);
        
        // Adicionar os verbos encontrados à chave "verbs" na regra
        if (verbsWithEnding.length > 0) {
          if (!ruleData.verbs) {
            ruleData.verbs = {}; // Cria a chave "verbs" se não existir
          }
          ruleData.verbs[ending] = verbsWithEnding;
        }
      }
    }

    // Salvar o arquivo JSON atualizado
    await fs.writeFile(rulesFilePath, JSON.stringify(rules, null, 2), "utf-8");
    console.log("Arquivo rulesByTerm.json atualizado com os verbos.");
  } catch (error) {
    console.error("Erro ao processar e salvar o arquivo:", error);
    throw error;
  }
}

// Exemplo de uso
(async () => {
  try {
    await addVerbsToRules();
  } catch (error) {
    console.error("Erro:", error);
  }
})();
