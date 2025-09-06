export type TransactionProps = {
  id: string;
  title: string;
  category: string;
  emoji: string;
  color: string;
  value: number;
  date: string;
  budget?: string;
  recurrence?: "daily" | "weekly" | "monthly" | "yearly";
  budgetTotal?: number;
};
