export interface Message {
  id: string;
  type: 'user' | 'system';
  content: string;
  timestamp: Date;
  tool?: string;
  isThinking?: boolean;
  thinkingStage?: string;
  tableData?: Array<Record<string, any>>;
  error?: boolean;
  isBookmarked?: boolean;
}

export interface ChatHistory {
  id: string;
  title: string;
  timestamp: Date;
  preview: string;
  messages: Message[];
}

export interface Bookmark {
  id: string;
  messageId: string;
  title: string;
  content: string;
  timestamp: Date;
  tags?: string[];
}

export interface ThinkingStage {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'completed' | 'error';
  progress?: number;
  duration?: number;
}

export interface TableColumn {
  key: string;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
}

export interface TableProps {
  data: Array<Record<string, any>>;
  columns?: TableColumn[];
  pageSize?: number;
  searchable?: boolean;
}