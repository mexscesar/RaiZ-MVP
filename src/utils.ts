import { Project, RecordItem, RecordType, IndexCalculation, UserSession } from './types';

// Standard LocalStorage keys
const PROJECTS_KEY = 'raiz_projects';
const USER_KEY = 'raiz_user_session';

// Helper to generate IDs
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

// Format date elegantly for display
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

// Calculation for the Índice de Enraizamento Cultural
export function calculateEmbeddingIndex(project: Project): IndexCalculation {
  const records = project.records || [];
  const totalCount = records.length;

  if (totalCount === 0) {
    return {
      score: 0,
      level: "Sem Registros",
      levelColor: "text-raiz-gray border-raiz-border bg-gray-50",
      explanation: "Este índice representa o nível de contextualização cultural documentada neste projeto. Adicione registros para iniciar o enraizamento.",
      breakdown: { volumeScore: 0, diversityScore: 0, balanceScore: 0 }
    };
  }

  // 1. Volume Score (Max 35 points)
  // Each record adds 7 points, capped at 5 records for maximum scoring
  const volumeScore = Math.min(35, totalCount * 7);

  // 2. Diversity Score (Max 35 points)
  // We check which of the 4 categories are present: 'referencia', 'historia', 'decisao', 'reflexao'
  const uniqueTypes = new Set(records.map(r => r.type));
  const distinctTypesCount = uniqueTypes.size;

  let diversityScore = 0;
  if (distinctTypesCount === 4) diversityScore = 35;
  else if (distinctTypesCount === 3) diversityScore = 25;
  else if (distinctTypesCount === 2) diversityScore = 15;
  else if (distinctTypesCount === 1) diversityScore = 5;

  // Let's add extra diversity incentive for distinct custom category values in references
  const referenceCategories = new Set(
    records.filter(r => r.type === 'referencia' && r.category).map(r => r.category?.toLowerCase())
  );
  if (referenceCategories.size > 1) {
    diversityScore = Math.min(35, diversityScore + (referenceCategories.size - 1) * 3);
  }

  // 3. Balance Score (Max 30 points)
  // Evaluates how well distributed the records are over the 4 categories
  const counts = {
    referencia: records.filter(r => r.type === 'referencia').length,
    historia: records.filter(r => r.type === 'historia').length,
    decisao: records.filter(r => r.type === 'decisao').length,
    reflexao: records.filter(r => r.type === 'reflexao').length,
  };

  const activeCategoriesCount = [counts.referencia, counts.historia, counts.decisao, counts.reflexao].filter(c => c > 0).length;

  let balanceScore = 0;
  if (activeCategoriesCount === 4) {
    balanceScore = 25;
  } else if (activeCategoriesCount === 3) {
    balanceScore = 15;
  } else if (activeCategoriesCount === 2) {
    balanceScore = 8;
  } else {
    balanceScore = 3;
  }

  // Harmonious distribution bonus: if there is active presence, and standard deviation is low
  if (activeCategoriesCount >= 2) {
    const list = [counts.referencia, counts.historia, counts.decisao, counts.reflexao].filter(c => c > 0);
    const mean = list.reduce((a, b) => a + b, 0) / list.length;
    const variance = list.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / list.length;
    const stdDev = Math.sqrt(variance);

    if (stdDev <= 1.0) {
      balanceScore += 5; // highly balanced
    } else if (stdDev <= 2.0) {
      balanceScore += 3; // moderately balanced
    }
  }
  balanceScore = Math.min(30, balanceScore);

  const score = Math.round(volumeScore + diversityScore + balanceScore);

  // Formatting level and colors
  let level = "";
  let levelColor = "";
  if (score <= 25) {
    level = "Raso (Incipiente)";
    levelColor = "text-raiz-terracotta border-raiz-terracotta/20 bg-raiz-terracotta/[0.03]";
  } else if (score <= 55) {
    level = "Arraigando (Conectado)";
    levelColor = "text-amber-700 border-amber-200 bg-amber-50/50";
  } else if (score <= 85) {
    level = "Enraizado (Mapeado)";
    levelColor = "text-raiz-green border-raiz-green/25 bg-raiz-green/[0.04]";
  } else {
    level = "Profundamente Enraizado (Pleno)";
    levelColor = "text-emerald-900 border-emerald-300 bg-emerald-50";
  }

  return {
    score,
    level,
    levelColor,
    explanation: "Este índice representa o nível de contextualização cultural documentada neste projeto.",
    breakdown: {
      volumeScore,
      diversityScore,
      balanceScore
    }
  };
}

// Preset Demo data representing Brazil's deep regional cultures
const PRESET_PROJECTS: Project[] = [
  {
    id: "lume-sertao",
    name: "LUME - Luminária Cabocla de Argila e Fibra",
    objective: "Desenvolver uma luminária tátil que resgata a iluminação acolhedora dos lampiões do sertão utilizando polímero biodegradável texturizado e fibra crua.",
    mainCulturalContext: "Cultura Nordestina & Sertaneja",
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
    records: [
      {
        id: "rec-l1",
        projectId: "lume-sertao",
        type: "referencia",
        title: "Xilogravura da Literatura de Cordel",
        description: "Inspirado no contraste cru da tinta preta sobre o papel claro do cordel e o entalhe rígido em madeira. A fiação e o encaixe da luminária usam contrastes geométricos marcantes baseados nas obras de J. Borges.",
        category: "Artes Visuais e Grafismo",
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        tags: ["Nordeste", "Gravura", "Grafismo"]
      },
      {
        id: "rec-l2",
        projectId: "lume-sertao",
        type: "historia",
        title: "Roda de Conversa sob o Candeeiro",
        description: "Eu me lembrei dos relatos do meu avô sobre noites quentes no Cariri, onde toda a vizinhança se sentava à calçada sob a luz fraca de um candeeiro a querosene. A luz da luminária precisa recriar essa dispersão difusa e avermelhada, evocando abrigo e história oral.",
        authorMemory: "Memória de Infância do Avô e Tradição Oral",
        createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
        tags: ["Memória Familiar", "Tradição Oral", "Candeeiro"]
      },
      {
        id: "rec-l3",
        projectId: "lume-sertao",
        type: "decisao",
        title: "Micro-perfurações Fractais na Cúpula",
        description: "Para simular visualmente a passagem de luz pelas palhas trançadas do sertão cearense, desenhamos um padrão de corte a laser paramétrico que emula as imperfeições e frestas aleatórias do trançado natural da Carnaúba.",
        visualManifestation: "Perfurações geométricas que projetam sombras orgânicas nas paredes circundantes.",
        createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        tags: ["Estética Paramétrica", "Palha de Carnaúba", "Sombras"]
      },
      {
        id: "rec-l4",
        projectId: "lume-sertao",
        type: "reflexao",
        title: "Resistência ao Minimalismo Escandinavo",
        description: "Em um mercado saturado de luminárias nórdicas de alumínio escovado e tons frios gerados por prompts homogêneos, o LUME reivindica a imperfeição tátil, o barro e o calor dos tons terrosos como portadores legítimos de dignidade tecnológica.",
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        tags: ["Futuro Sustentável", "Descolonização do Olhar", "Identidade"]
      }
    ]
  },
  {
    id: "ybyra-tapajos",
    name: "YBYRÁ - Mobiliário Urbano de Coleta",
    objective: "Mobiliário público modular para captação de água pluvial e abrigo solar urbano inspirado na arquitetura palafítica ribeirinha.",
    mainCulturalContext: "Cultura Amazônica e Ribeirinha",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
    records: [
      {
        id: "rec-y1",
        projectId: "ybyra-tapajos",
        type: "referencia",
        title: "Tecnologia Naval das Canoas de Pesca",
        description: "A hidrodinâmica das canoas esculpidas em troncos únicos inspira os formatos dos assentos e o direcionador de fluxo pluvial da cobertura do abrigo escolar.",
        category: "Artesanato Utilitário",
        createdAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
        tags: ["Engenharia Ribeirinha", "Amazônia", "Madeira"]
      },
      {
        id: "rec-y2",
        projectId: "ybyra-tapajos",
        type: "decisao",
        title: "Suspensão Estrutural de Palafitas",
        description: "O abrigo eleva-se levemente do solo através de sapatas metálicas finas, imitando as estacas que sustentam as habitações ribeirinhas durante as cheias dos rios, evitando o acúmulo térmico do asfalto quente.",
        visualManifestation: "Pórticos metálicos vazados que mantêm as vigas a 15 cm do piso urbano.",
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        tags: ["Estrutura Suspensa", "Adaptação Térmica"]
      }
    ]
  }
];

// Load Session
export function getStoredUser(): UserSession | null {
  const data = localStorage.getItem(USER_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch (e) {
    return null;
  }
}

// Save Session
export function storeUser(name: string, email: string): UserSession {
  const session: UserSession = {
    name,
    email,
    loggedInAt: new Date().toISOString()
  };
  localStorage.setItem(USER_KEY, JSON.stringify(session));
  return session;
}

// Clear Session
export function clearUserSession() {
  localStorage.removeItem(USER_KEY);
}

// Load Projects
export function getStoredProjects(): Project[] {
  const data = localStorage.getItem(PROJECTS_KEY);
  if (!data) {
    // Seed with our default deeply curated design-rich content
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(PRESET_PROJECTS));
    return PRESET_PROJECTS;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return PRESET_PROJECTS;
  }
}

// Save Projects
export function storeProjects(projects: Project[]) {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
}

// Add New Project
export function createNewProject(name: string, objective: string, mainCulturalContext: string): Project {
  const projects = getStoredProjects();
  const newProj: Project = {
    id: 'proj-' + generateId(),
    name,
    objective,
    mainCulturalContext,
    createdAt: new Date().toISOString(),
    records: []
  };
  projects.unshift(newProj); // highlight new projects on top
  storeProjects(projects);
  return newProj;
}

// Delete Project
export function deleteProject(projectId: string): Project[] {
  const projects = getStoredProjects();
  const filtered = projects.filter(p => p.id !== projectId);
  storeProjects(filtered);
  return filtered;
}

// Add Record to Project
export function addRecordToProject(projectId: string, recordData: Omit<RecordItem, 'id' | 'projectId' | 'createdAt'>): RecordItem {
  const projects = getStoredProjects();
  const projectIdx = projects.findIndex(p => p.id === projectId);

  if (projectIdx === -1) {
    throw new Error('Project not found');
  }

  const newRecord: RecordItem = {
    ...recordData,
    id: 'rec-' + generateId(),
    projectId,
    createdAt: new Date().toISOString()
  };

  projects[projectIdx].records.unshift(newRecord); // show newest record first on the feed/timeline
  storeProjects(projects);
  return newRecord;
}

// Remove Record from Project
export function removeRecordFromProject(projectId: string, recordId: string): Project[] {
  const projects = getStoredProjects();
  const projectIdx = projects.findIndex(p => p.id === projectId);

  if (projectIdx !== -1) {
    projects[projectIdx].records = projects[projectIdx].records.filter(r => r.id !== recordId);
    storeProjects(projects);
  }
  return projects;
}
