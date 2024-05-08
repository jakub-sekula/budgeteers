"use client";
import React, { useEffect } from "react";
import BudgetEntriesTable from "../BudgetEntriesTable";
import { useBudgetContext } from "../BudgetContext";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { fetchBudget } from "@/utils/supabase/api";
import { Skeleton } from "@/components/ui/skeleton";

export default function Page({ params }: { params: { budgetId: string } }) {
  const supabase = createClient();
  const budgetsQuery = useQuery({
    queryKey: ["budgets", params.budgetId],
    queryFn: async () => fetchBudget(supabase, params.budgetId),
  });

  const { setSelectedBudget } = useBudgetContext();
  const budget = budgetsQuery.data?.data;

  useEffect(() => {
    if (!budget) return;
    setSelectedBudget(budget);
    return () => {
      setSelectedBudget(null);
    };
  }, [budget]);

  return (
    <>
      {/* <HydrationBoundary state={dehydrate(queryClient)}> */}
      <h1 className="col-span-full scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        {budget?.name || <Skeleton className="w-48 h-12" />}
      </h1>
      <BudgetEntriesTable budgetId={params.budgetId} />;
      {/* </HydrationBoundary> */}
    </>
  );
}
