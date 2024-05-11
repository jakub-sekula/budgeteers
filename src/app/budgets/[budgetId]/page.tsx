"use client";
import BudgetPeriodsTable from "../BudgetPeriodsTable";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { fetchBudget } from "@/utils/supabase/api";
import { Skeleton } from "@/components/ui/skeleton";
import BudgetPeriodForm from "../BudgetPeriodForm";
import BudgetPeriodCategoryForm from "../BudgetPeriodCategoryForm";

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
      <div className="flex col-span-full gap-6 items-center">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          {budget?.name || <Skeleton className="w-48 h-12" />}
        </h1>
        <BudgetPeriodForm budgetId={params.budgetId} />
        <BudgetPeriodCategoryForm />
      </div>
      <BudgetPeriodsTable budgetId={params.budgetId} />
      {/* </HydrationBoundary> */}
    </>
  );
}
