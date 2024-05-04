import React from "react";
import Transactions from "./Transactions";
import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export const fetchTransactions = async () => {
  const supabase = createClient();
  return await supabase.from("transactions").select("*");
};

export default async function page() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["transactions"],
    queryFn: fetchTransactions,
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Transactions />
    </HydrationBoundary>
  );
}
