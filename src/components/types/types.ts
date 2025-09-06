export type TransactionProps = {
  id: string;
  title: string;
  category: string;
  emoji: string;
  color: string;
  value: number;
  date: string;
  recurrence?: "daily" | "weekly" | "monthly" | "yearly";
};
