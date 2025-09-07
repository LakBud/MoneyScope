import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

// Full Transaction type including optional properties
export interface Transaction {
  id: string;
  title: string;
  value: number;
  category: string;
  date: string;
  emoji?: string;
  color?: string;
  limit?: number;
  spent: number;
  budget?: string;
  recurrence?: "daily" | "weekly" | "monthly" | "yearly";
}

// Context type
export interface TransactionsContextType {
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
}

// Create context
const TransactionsContext = createContext<TransactionsContextType | undefined>(undefined);

// Provider
export const TransactionsProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem("transactions");
    if (!saved) return [];
    try {
      const parsed: Transaction[] = JSON.parse(saved).map((t: Partial<Transaction>) => ({
        id: t.id || crypto.randomUUID(),
        title: t.title || "Untitled",
        value: t.value ?? 0,
        category: t.category || "General",
        date: t.date || new Date().toISOString(),
        emoji: t.emoji || "💰",
        color: t.color || "#6366f1",
        limit: t.limit ?? 0,
        spent: t.spent ?? 0,
        budget: t.budget,
        recurrence: t.recurrence,
      }));
      return parsed;
    } catch {
      return [];
    }
  });

  // Persist to localStorage whenever transactions change
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  return <TransactionsContext.Provider value={{ transactions, setTransactions }}>{children}</TransactionsContext.Provider>;
};

// Custom hook
export const useTransactions = (): TransactionsContextType => {
  const context = useContext(TransactionsContext);
  if (!context) throw new Error("useTransactions must be used within a TransactionsProvider");
  return context;
};
