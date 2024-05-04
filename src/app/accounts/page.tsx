import React from "react";
import Accounts from "./Accounts";
import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export const fetchAccounts = async () => {
  const supabase = createClient();
  return await supabase.from("accounts").select("*");
};

export default async function page() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["accounts"],
    queryFn: fetchAccounts,
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Accounts />
    </HydrationBoundary>
  );
}
