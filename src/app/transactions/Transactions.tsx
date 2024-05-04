"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { PostgrestSingleResponse } from "@supabase/supabase-js";

export const fetchTransactions = async () => {
  const supabase = createClient();
  let transactions = await supabase.from("transactions").select("*");

  return transactions;
};

export default function Transactions() {
  const query = useQuery({
    queryKey: ["transactions"],
    queryFn: fetchTransactions,
  });

  return <pre>{JSON.stringify(query, null, 2)}</pre>;
}
