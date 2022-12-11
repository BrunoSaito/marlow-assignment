export enum ChecklistItemStatus {
  NotDone = 'Not Done',
  Pending = 'Pending',
  Done = 'Done',
  Skipped = 'Skipped',
}

export enum ChecklistStatus {
  Archived = 'Archived',
}

export enum ChecklistItemCategory {
  Mandatory = '1',
  'Attention Required' = '2',
  Optional = '3',
}

export interface DepartureChecklist {
  id: string;
  status: ChecklistStatus;
  percentage: number;
  items: DepartureChecklistItem[];
}

export interface DepartureChecklistItem {
  id: string;
  status: ChecklistItemStatus;
  documentInfo: DocumentInfo;
}

export interface DocumentInfo {
  description: string;
  documentNumber: string;
  issueDate: number;
  unlimited: boolean;
  categoryName: string;
  categoryId: ChecklistItemCategory;
  documentId: string;
  expiryDate?: number;
  nation: string;
  counter: number;
  followUp: boolean;
  optional: boolean;
}