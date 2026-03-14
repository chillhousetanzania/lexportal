export type TransactionType = 'revenue' | 'expense' | 'refund' | 'adjustment';

export interface FinancialRecord {
  id: string;
  transactionDate: Date;
  type: TransactionType;
  category: string;
  amount: number;
  description: string;
  createdBy: string;
  createdAt: Date;
}

export interface CreateFinancialRecordRequest {
  transactionDate: Date;
  type: TransactionType;
  category: string;
  amount: number;
  description: string;
}

export interface FinancialMetrics {
  totalRevenue: number;
  totalExpenses: number;
  netIncome: number;
  revenueGrowth: number;
  expensesByCategory: CategoryBreakdown[];
}

export interface CategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
}

export interface TimeRange {
  start: Date;
  end: Date;
  preset?: 'week' | 'month' | 'quarter' | 'year' | 'custom';
}
