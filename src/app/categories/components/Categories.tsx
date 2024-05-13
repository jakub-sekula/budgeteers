"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";

import { Tables } from "@/types/supabase";
import { CategoryTypesWithChildren, fetchBudget } from "@/utils/supabase/api";
import CategoryCard from "./CategoryCard";
import { useGlobalContext } from "@/components/Providers";

export default function Categories() {
  const supabase = createClient();
  const { defaultBudget } = useGlobalContext();

  const query = useQuery({
    queryKey: ["budgets", defaultBudget.id],
    queryFn: async () => fetchBudget(defaultBudget.id),
  });

  const categories = query.data?.data?.category_types as
    | CategoryTypesWithChildren
    | undefined;

  return (
    <>
      <div className="grid grid-cols-6 gap-4">
        <h2 className="col-span-full">Budget: {defaultBudget.name}</h2>
        {categories?.map((category) => (
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
