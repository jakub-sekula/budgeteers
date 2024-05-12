"use client";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { Toaster } from "./ui/toaster";
import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { fetchBudget, fetchBudgets } from "@/utils/supabase/api";
import { Tables } from "@/types/supabase";
import { useLocalStorage } from "@mantine/hooks";

const GlobalContext = createContext<{
  budgets: Tables<"budgets">[];
  defaultBudget: Tables<"budgets"> | { id: string; name: string };
  activePeriod: Tables<"budget_periods"> | undefined;
}>({
  budgets: [],
  defaultBudget: { id: "", name: "" },
  activePeriod: undefined,
});

function GlobalProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const [defaultBudget, setDefaultBudget] = useLocalStorage<string>({
    key: "defaultBudget",
    defaultValue: '{"id":"","name":""}',
  });

  const { data, error } = useQuery({
    queryKey: ["defaultBudget"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("default_budget_id")
        .eq("id", user.id)
        .single();

      if (userError) {
        console.error("Error fetching user data:", userError);
        return null;
      }

      if (!userData || !userData.default_budget_id) {
        console.log("No default budget set for this user.");
        return null;
      }

      // Retrieve the budget name using the default budget ID
      const { data: budgetData, error: budgetError } = await fetchBudget(
        supabase,
        userData.default_budget_id
      );

      if (budgetError) {
        console.error("Error fetching budget data:", budgetError);
        return null;
      }

      if (budgetData) {
        setDefaultBudget(JSON.stringify(budgetData));
      }

      return budgetData;
    },
  });

  const [budgets, setBudgets] = useState<Tables<"budgets">[]>([]);

  const budgetsQuery = useQuery({
    queryKey: ["budgets"],
    queryFn: async () => fetchBudgets(supabase),
  });

  useEffect(() => {
    if (!budgetsQuery.data?.data) return;
    setBudgets(budgetsQuery.data.data);
  }, [budgetsQuery.data]);

  const activePeriod = data?.budget_periods.find(
    (period) => period.is_current
  ) as Tables<"budget_periods"> | undefined;

  console.log("active: ", activePeriod);

  return (
    <GlobalContext.Provider
      value={{
        defaultBudget: JSON.parse(defaultBudget),
        budgets,
        activePeriod,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobalContext() {
  return useContext(GlobalContext);
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchInterval: 60 * 1000,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <GlobalProvider>{children}</GlobalProvider>
      <ReactQueryDevtools initialIsOpen={false} />
      <Toaster />
    </QueryClientProvider>
  );
}
