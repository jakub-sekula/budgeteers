"use client";
import { Tables } from "@/types/supabase";
import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { ReactNode, createContext, useContext, useState } from "react";

const BudgetContext = createContext<{
  users?: any;
  activePeriod?: any;
  setActivePeriod?: any;
}>({});

export default function BudgetProvider({ children }: { children: ReactNode }) {
  const [activePeriod, setActivePeriod] =
    useState<Tables<"budget_periods"> | null>(null);

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

  const users = usersQuery?.data;

  return (
    <BudgetContext.Provider
      value={{
        activePeriod,
        setActivePeriod,
        users,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
}

export const useBudgetContext = () => useContext(BudgetContext);
