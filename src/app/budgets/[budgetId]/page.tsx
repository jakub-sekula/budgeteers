"use client";
import React, { useEffect } from "react";
import BudgetEntriesTable from "../BudgetEntriesTable";
import { useBudgetContext } from "../BudgetContext";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { fetchBudget } from "@/utils/supabase/api";
import { Skeleton } from "@/components/ui/skeleton";
import { useGlobalContext } from "@/components/Providers";

export default function Page({ params }: { params: { budgetId: string } }) {
  const supabase = createClient();
  const budgetsQuery = useQuery({
    queryKey: ["budgets", params.budgetId],
    queryFn: async () => fetchBudget(supabase, params.budgetId),
  });

  const budget = budgetsQuery.data?.data;

  const summaryQuery = useQuery({
    queryKey: ["budget_summary", params.budgetId],
    queryFn: async () => {
      let { data, error } = await supabase.rpc(
        "get_transaction_summary_by_category",
        {
          input_budget_id: params.budgetId,
        }
      );
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });

  console.log(summaryQuery?.data);

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
