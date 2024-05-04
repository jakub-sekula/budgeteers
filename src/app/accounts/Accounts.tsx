"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { PostgrestSingleResponse } from "@supabase/supabase-js";

export const fetchAccounts = async () => {
  const supabase = createClient();
  let transactions = await supabase.from("accounts").select("*");

  return transactions;
};

export default function Accounts() {
  const query = useQuery({
    queryKey: ["accounts"],
    queryFn: fetchAccounts,
  });

  return <pre>{JSON.stringify(query, null, 2)}</pre>;
}
