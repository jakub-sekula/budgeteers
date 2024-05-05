import { redirect } from "next/navigation";
import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";

import { createClient } from "@/utils/supabase/server";
import { fetchTransactions } from "@/utils/supabase/api";
import Transactions from "./Transactions";

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
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Transactions
        </h1>
        <Transactions queryString={queryString} />
      </HydrationBoundary>
    </>
  );
}
