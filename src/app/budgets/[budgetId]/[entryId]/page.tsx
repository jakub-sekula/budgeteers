"use client";
import React, { useEffect } from "react";
import BudgetPeriodCard from "../../BudgetPeriodCard";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import {
  BudgetPeriodsWithCategories,
  BudgetPeriodWithCategories,
  fetchBudget,
  fetchBudgetPeriods,
} from "@/utils/supabase/api";

export default function Page({
  params,
}: {
  params: { budgetId: string; periodId: string };
}) {
  const supabase = createClient();

  const budgetPeriodsQuery = useQuery({
    queryKey: ["budget_periods", params.budgetId],
    queryFn: async () => fetchBudgetPeriods(supabase, params.budgetId),
  });

  const budgetPeriods = budgetPeriodsQuery.data?.data as
    | BudgetPeriodsWithCategories
    | undefined;

  const period = budgetPeriods?.find?.((period) => period.id === params.periodId);

  const budgetQuery = useQuery({
    queryKey: ["budgets", params.budgetId],
    queryFn: async () => fetchBudget(supabase, params.budgetId),
  });

  const budget = budgetQuery.data?.data;

  return (
    <>
      <h1 className="col-span-full scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        {period?.name}
      </h1>
      <BudgetPeriodCard period={period as BudgetPeriodWithCategories} />
    </>
  );
}
