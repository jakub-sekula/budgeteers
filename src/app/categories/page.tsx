import React from "react";
import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Categories from "./components/Categories";
import CategoryForm from "./components/CategoryForm";
import { budgetsQueryString } from "@/utils/supabase/api";
import CategoryTypeForm from "./components/CategoryTypeForm";

export default async function page() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }
  const queryClient = new QueryClient();
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["category_types"],
      queryFn: async () =>
        supabase.from("category_types").select("*").is("parent_id", null),
    }),
    queryClient.prefetchQuery({
      queryKey: ["budgets"],
      queryFn: async () => {
        return supabase.from("budgets").select(budgetsQueryString);
      },
    }),
  ]);

  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Categories
        </h1>
        <div className="grid gap-6 w-full">
          <Categories />
          <div className="flex gap-6">
            <CategoryForm />
            <CategoryTypeForm />
          </div>
        </div>
      </HydrationBoundary>
    </>
  );
}
