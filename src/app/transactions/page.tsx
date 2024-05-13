import { redirect } from "next/navigation";
import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";

import { createClient } from "@/utils/supabase/server";
import {
  budgetsQueryString,
  transactionsQueryString,
} from "@/utils/supabase/api";
import TransactionsTable from "./TransactionsTable";

export default async function page() {
  const queryString = "*, categories(name)";
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["transactions"],
      queryFn: async () => {
        return supabase.from("transactions").select(transactionsQueryString);
      },
    }),
    queryClient.prefetchQuery({
      queryKey: ["budgets"],
      queryFn: async () => {
        return supabase.from("budgets").select(budgetsQueryString);
      },
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TransactionsTable queryString={queryString} />
    </HydrationBoundary>
  );
}
