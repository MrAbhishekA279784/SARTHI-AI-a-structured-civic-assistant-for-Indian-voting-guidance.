export interface TrustBadge {
  source: string;
  confidence: 'high' | 'medium' | 'low';
  lastUpdated: string;
}

export interface ScenarioData {
  key: string;
  triggers: string[];
  title: string;
  answer: string;
  steps: string[];
  alternateDocuments?: string[];
  links: { label: string; url: string }[];
  trust: TrustBadge;
}

export interface ScenarioResult {
  id: string;
  userId: string;
  scenarioKey: string;   // e.g., "lost_voter_id"
  query: string;         // Original user input
  answer: string;
  steps: string[];
  documents: string[];
  links: { label: string; url: string }[];
  trustSource: string;
  trustConfidence: 'high' | 'medium' | 'low';
  trustLastUpdated: string;
  source: 'rules' | 'ai';
  createdAt: number;
}
