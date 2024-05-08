"use client";
import { Tables } from "@/types/supabase";
import {
  BudgetsWithEntries,
  fetchBudgetEntries,
  fetchBudgets,
} from "@/utils/supabase/api";
import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const BudgetContext = createContext<any>({});

export default function BudgetProvider({ children }: { children: ReactNode }) {
  const [selectedEntryCategoryId, setSelectedEntryCategoryId] = useState<
    string | null
  >(null);

  const [selectedBudget, setSelectedBudget] =
    useState<Tables<"budgets"> | null>(null);

  const [selectedBudgetEntry, setSelectedBudgetEntry] =
    useState<Tables<"budget_entries"> | null>(null);

  return (
    <BudgetContext.Provider
      value={{
        selectedEntryCategoryId,
        setSelectedEntryCategoryId,
        selectedBudget,
        setSelectedBudget,
        selectedBudgetEntry,
        setSelectedBudgetEntry,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
}

export const useBudgetContext = () => useContext(BudgetContext);
