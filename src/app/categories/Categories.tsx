"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";

export const fetchCategories = async () => {
  const supabase = createClient();
  let transactions = await supabase.from("categories").select("*");

  return transactions;
};

export default function Categories() {
  const query = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  return <pre>{JSON.stringify(query, null, 2)}</pre>;
}
