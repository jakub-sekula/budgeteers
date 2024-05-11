import React from "react";
import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Categories from "./Categories";
import CategoryForm from "./CategoryForm";
import { fetchCategoryTypes } from "@/utils/supabase/api";
import CategoryTypeForm from "./CategoryTypeForm";

export const dynamic = "force-dynamic";

export default async function page() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["category_types"],
    queryFn: async () => await fetchCategoryTypes(supabase),
  });
  return (
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
  );
}
