"use client";
import React, { useEffect } from "react";
import BudgetPeriodCard from "../../BudgetPeriodCard";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import {
  BudgetPeriodsWithCategories,
  BudgetPeriodWithCategories,
  fetchBudgetPeriods,
} from "@/utils/supabase/api";
import TransactionsTable from "./TransactionsTable";
import TransactionForm from "@/app/transactions/TransactionForm";

export default function Page({
  params,
}: {
  params: { budgetId: string; periodId: string };
}) {
  const supabase = createClient();

  const budgetPeriodsQuery = useQuery({
    queryKey: ["budget_periods", params.budgetId],
    queryFn: async () => fetchBudgetPeriods(params.budgetId),
  });

  const budgetPeriods = budgetPeriodsQuery.data?.data as
    | BudgetPeriodsWithCategories
    | undefined;

  const period = budgetPeriods?.find?.(
    (period) => period.id === params.periodId
  );

  console.log(period);

  const summaryQuery = useQuery({
    queryKey: ["budget_summary", params.periodId],
    queryFn: async () => {
      let { data, error } = await supabase.rpc(
        "get_transaction_summary_by_category",
        {
          input_budget_id: params?.budgetId,
          input_budget_period_id: params?.periodId,
        }
      );
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });

  return (
    <>
      <h1 className="col-span-full scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        {period?.name}
      </h1>
      <BudgetPeriodCard period={period as BudgetPeriodWithCategories} />
      <div className="flex col-span-full">
        <TransactionForm budgetPeriodId={params.periodId} />
        <TransactionsTable periodId={params.periodId} />
      </div>
    </>
  );
}
