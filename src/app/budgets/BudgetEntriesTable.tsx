"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";

import {
  BudgetEntriesWithCategories,
  fetchBudgetEntries,
} from "@/utils/supabase/api";
import { useBudgetContext } from "./BudgetContext";
import BudgetEntryForm from "./BudgetEntryForm";
import BudgetEntryCard from "./BudgetEntryCard";

export default function BudgetEntriesTable({budgetId}: {budgetId: string}) {
  const supabase = createClient();
  // const { selectedBudget } = useBudgetContext();

  const budgetEntriesQuery = useQuery({
    queryKey: ["budget_entries", budgetId],
    queryFn: async () => fetchBudgetEntries(supabase, budgetId),
  });

  const budgetEntries = budgetEntriesQuery.data?.data as
    | BudgetEntriesWithCategories
    | undefined;

  return (
    <>
      <BudgetEntryForm />
      <div className="col-span-8 flex gap-4 flex-col">
        {budgetEntries?.map((entry) => (
          <BudgetEntryCard key={entry.id} entry={entry} />
        ))}
      </div>
    </>
  );
}
