"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Tables } from "@/types/supabase";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  fetchBudget,
  fetchCategories,
  fetchCategoryTypes,
} from "@/utils/supabase/api";
import CategoryCard from "./CategoryCard";
import { useGlobalContext } from "@/components/Providers";

export default function Categories() {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const { defaultBudget } = useGlobalContext();

  const query = useQuery({
    queryKey: ["budgets", defaultBudget.id],
    queryFn: async () => fetchBudget(supabase, defaultBudget.id),
  });

  const categories = query.data?.data?.category_types as
    | Tables<"category_types">[]
    | undefined;


  const deleteCategory = async (id: string) => {
    const supabase = createClient();
    const { error } = await supabase
      .from("budgets_category_types")
      .delete()
      .eq("category_type_id", id)
      .eq("budget_id", defaultBudget.id);
    if (error) return console.log(error);
    queryClient.invalidateQueries({ queryKey: ["budgets", defaultBudget.id] });
  };

  return (
    <>
      <div className="grid grid-cols-6 gap-4">
        <h2 className="col-span-full">Budget: {defaultBudget.name }</h2>
        {categories
          // ?.filter(
          //   (category) =>
          //     category.budget_id === null ||
          //     category.budget_id === defaultBudget.id
          // )
          ?.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              className="col-span-2"
            />
          ))}
      </div>

    </>
  );
}
