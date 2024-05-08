"use client";
import React, { useEffect } from "react";
import BudgetEntryCard from "../../BudgetEntryCard";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { useBudgetContext } from "../../BudgetContext";
import {
  BudgetEntriesWithCategories,
  BudgetEntryWithCategories,
  fetchBudget,
  fetchBudgetEntries,
} from "@/utils/supabase/api";
import BudgetEntryCategoryForm from "../../BudgetEntryCategoryForm";

export default function Page({
  params,
}: {
  params: { budgetId: string; entryId: string };
}) {
  const supabase = createClient();
  const { setSelectedBudget, setSelectedBudgetEntry } = useBudgetContext();

  const budgetEntriesQuery = useQuery({
    queryKey: ["budget_entries", params.budgetId],
    queryFn: async () => fetchBudgetEntries(supabase, params.budgetId),
  });

  const budgetEntries = budgetEntriesQuery.data?.data as
    | BudgetEntriesWithCategories
    | undefined;

  const entry = budgetEntries?.find?.((entry) => entry.id === params.entryId);

  const budgetQuery = useQuery({
    queryKey: ["budgets", params.budgetId],
    queryFn: async () => fetchBudget(supabase, params.budgetId),
  });

  const budget = budgetQuery.data?.data;

  useEffect(() => {
    if (!budget) return;
    setSelectedBudget(budget);
    return () => {
      setSelectedBudget(null);
    };
  }, [budget]);

  useEffect(() => {
    if (!entry) return;
    setSelectedBudgetEntry(entry);
    return () => {
      setSelectedBudgetEntry(null);
    };
  }, [entry]);

  return (
    <>
      <h1 className="col-span-full scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        {entry?.name}
      </h1>
      <BudgetEntryCategoryForm />

      <BudgetEntryCard entry={entry as BudgetEntryWithCategories} />
    </>
  );
}
