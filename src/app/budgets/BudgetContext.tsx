"use client";
import { Tables } from "@/types/supabase";
import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import {
  ReactNode,
  createContext,
  useContext,
  useState,
} from "react";

const BudgetContext = createContext<{}>({});

export default function BudgetProvider({ children }: { children: ReactNode }) {
  const [selectedEntryCategoryId, setSelectedEntryCategoryId] = useState<
    string | null
  >(null);

  const [selectedBudget, setSelectedBudget] =
    useState<Tables<"budgets"> | null>(null);

  const [selectedBudgetEntry, setSelectedBudgetEntry] =
    useState<Tables<"budget_entries"> | null>(null);

  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase.from("users").select();

      if (error) {
        throw new Error(error?.message);
      }

      return data;
    },
  });

  const users = usersQuery?.data

  return (
    <BudgetContext.Provider
      value={{
        selectedEntryCategoryId,
        setSelectedEntryCategoryId,
        selectedBudget,
        setSelectedBudget,
        selectedBudgetEntry,
        setSelectedBudgetEntry,
        users
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
}

export const useBudgetContext = () => useContext(BudgetContext);
