export interface ChecklistItem {
  id: string;            // e.g., "step_1_item_1"
  label: string;
  checked: boolean;
  checkedAt?: number;
}

export interface JourneyStep {
  id: string;            // e.g., "step_1_eligibility"
  userId: string;
  order: number;         // 1-7
  title: string;
  description: string;
  status: 'completed' | 'in_progress' | 'pending';
  checklistItems: ChecklistItem[];
  trustSource: string;
  trustConfidence: 'high' | 'medium' | 'low';
  trustLastUpdated: string;  // ISO date string
  completedAt?: number;
  createdAt: number;
  updatedAt: number;
}
