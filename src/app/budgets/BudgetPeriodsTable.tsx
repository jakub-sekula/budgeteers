"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";

import {
  BudgetPeriodsWithCategories,
  fetchBudgetPeriods,
} from "@/utils/supabase/api";
import BudgetPeriodCard from "./BudgetPeriodCard";

export default function BudgetPeriodsTable({ budgetId }: { budgetId: string }) {
  const supabase = createClient();
  // const { selectedBudget } = useBudgetContext();

  const budgetPeriodsQuery = useQuery({
    queryKey: ["budget_periods", budgetId],
    queryFn: async () => fetchBudgetPeriods(supabase, budgetId),
  });

  const budgetPeriods = budgetPeriodsQuery.data?.data as
    | BudgetPeriodsWithCategories
    | undefined;

  return (
    <>
      <div className="col-span-full flex gap-4 flex-col">
        {budgetPeriods?.map((period) => (
          <BudgetPeriodCard key={period.id} period={period} />
        ))}
      </div>
    </>
  );
}
