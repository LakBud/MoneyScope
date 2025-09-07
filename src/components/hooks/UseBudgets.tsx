import { createContext, useContext, useState, type ReactNode, useEffect } from "react";

export interface Budget {
  id: string;
  category: string;
  limit: number;
}

interface BudgetsContextType {
  budgets: Budget[];
  addBudget: (category: string, limit: number) => void;
  updateBudget: (id: string, category: string, limit: number) => void;
}

const BudgetsContext = createContext<BudgetsContextType | undefined>(undefined);

export const BudgetsProvider = ({ children }: { children: ReactNode }) => {
  const [budgets, setBudgets] = useState<Budget[]>(() => {
    const saved = localStorage.getItem("budgets");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("budgets", JSON.stringify(budgets));
  }, [budgets]);

  const addBudget = (category: string, limit: number) => {
    setBudgets((prev) => [...prev, { id: crypto.randomUUID(), category, limit }]);
  };

  const updateBudget = (id: string, category: string, limit: number) => {
    setBudgets((prev) => prev.map((b) => (b.id === id ? { ...b, category, limit } : b)));
  };

  return <BudgetsContext.Provider value={{ budgets, addBudget, updateBudget }}>{children}</BudgetsContext.Provider>;
};

export const useBudgets = () => {
  const context = useContext(BudgetsContext);
  if (!context) throw new Error("useBudgets must be used within a BudgetsProvider");
  return context;
};
