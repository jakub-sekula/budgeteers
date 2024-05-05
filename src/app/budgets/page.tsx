import React from "react";
import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Budgets from "./Budgets";
import { fetchBudgets } from "@/utils/supabase/api";

export default async function page() {
  const queryString = "*, budget_entries (*, categories(name,color,icon))";
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["budgets"],
    queryFn: async () => fetchBudgets(supabase),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Budgets
      </h1>
      <Budgets />
    </HydrationBoundary>
  );
}
