import React from "react";
import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { fetchBudgets } from "@/utils/supabase/api";
import BudgetsTable from "./BudgetsTable";

export default async function page() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["budgets"],
    queryFn: fetchBudgets,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <h1 className="col-span-full scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Budgets
      </h1>
      <BudgetsTable />
    </HydrationBoundary>
  );
}
