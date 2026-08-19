export interface AnalyticsDistribution {
  label: string;
  count: number;
  percentage: number;
}

export interface AnalyticsMonthlyPoint {
  month: string;
  count: number;
}

export type ContentFlowStage = 'backlog' | 'pipeline' | 'completed';
