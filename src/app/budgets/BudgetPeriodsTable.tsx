"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";

import {
  BudgetPeriodsWithCategories,
  fetchBudgetPeriods,
} from "@/utils/supabase/api";
import BudgetPeriodCard from "./BudgetPeriodCard";
import { useMemo } from "react";

export default function BudgetPeriodsTable({ budgetId }: { budgetId: string }) {
  const supabase = createClient();
  // const { selectedBudget } = useBudgetContext();

  const budgetPeriodsQuery = useQuery({
    queryKey: ["budget_periods", budgetId],
    queryFn: async () => fetchBudgetPeriods( budgetId),
  });

  const budgetPeriods = budgetPeriodsQuery.data?.data as
    | BudgetPeriodsWithCategories
    | undefined;

  const sortedPeriods = useMemo(() => {
    return budgetPeriods?.sort(
      (a, b) =>
        new Date(b.starts_on).getTime() - new Date(a.starts_on).getTime()
    );
  }, [budgetPeriods]);

  return (
    <>
      <div className="col-span-full flex gap-4 flex-col">
        {sortedPeriods?.map((period) => (
          <BudgetPeriodCard key={period.id} period={period} />
        ))}
      </div>
    </>
  );
}
