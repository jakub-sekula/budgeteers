import { redirect } from "next/navigation";
import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";

import { createClient } from "@/utils/supabase/server";
import { fetchTransactions } from "@/utils/supabase/api";
import TransactionsTable from "./TransactionsTable";

export default async function page() {
  const queryString = "*, categories(name)";
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["transactions"],
    queryFn: async () => await fetchTransactions(supabase),
  });

  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
          <TransactionsTable queryString={queryString} />
      </HydrationBoundary>
    </>
  );
}
