import React from "react";
import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Categories from "./Categories";

export const dynamic = 'force-dynamic' 

const fetchCategories = async () => {
  const supabase = createClient();
  return await supabase.from("categories").select("*");
};

export default async function page() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Categories
      </h1>
      <Categories />
    </HydrationBoundary>
  );
}
