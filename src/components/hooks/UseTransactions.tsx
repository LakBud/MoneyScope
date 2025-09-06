import { createContext, useContext, useState, type ReactNode } from "react";
import type { TransactionProps } from "../types/types";

type TransactionsContextType = {
  transactions: TransactionProps[];
  setTransactions: React.Dispatch<React.SetStateAction<TransactionProps[]>>;
};

const TransactionsContext = createContext<TransactionsContextType | undefined>(undefined);

export const TransactionsProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] = useState<TransactionProps[]>([]);
  return <TransactionsContext.Provider value={{ transactions, setTransactions }}>{children}</TransactionsContext.Provider>;
};

export const useTransactions = () => {
  const context = useContext(TransactionsContext);
  if (!context) throw new Error("useTransactions must be used within TransactionsProvider");
  return context;
};
