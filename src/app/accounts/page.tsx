import React from "react";
import Accounts from "./Accounts";
import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { fetchAccounts } from "@/utils/supabase/api";
import AccountForm from "./AccountForm";

export default async function page() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["accounts"],
    queryFn: async () => await fetchAccounts(supabase),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Accounts
      </h1>
      <AccountForm />
      <Accounts />
    </HydrationBoundary>
  );
}
