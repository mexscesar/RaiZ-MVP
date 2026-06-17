export type RecordType = 'referencia' | 'historia' | 'decisao' | 'reflexao';

export interface RecordItem {
  id: string;
  projectId: string;
  type: RecordType;
  title: string;
  description: string;
  createdAt: string;
  // Specific optional fields to enrich details:
  category?: string; // used for reference category (e.g. "Artesanato", "Música")
  visualManifestation?: string; // used for decisions of design (how it appeared visually)
  authorMemory?: string; // person or storyteller associated with history
  tags?: string[];
}

export interface Project {
  id: string;
  name: string;
  objective: string;
  mainCulturalContext: string; // e.g. "Cultura Nordestina", "Cultura Amazônica", "Cultura Urbana" etc.
  createdAt: string;
  records: RecordItem[];
}

export interface UserSession {
  name: string;
  email: string;
  loggedInAt: string;
}

export interface IndexCalculation {
  score: number; // 0 - 100
  level: string; // "Iniciante", "Conectado", "Enraizado", "Profundamente Enraizado"
  levelColor: string;
  explanation: string;
  breakdown: {
    volumeScore: number; // up to 35
    diversityScore: number; // up to 35
    balanceScore: number; // up to 30
  };
}
