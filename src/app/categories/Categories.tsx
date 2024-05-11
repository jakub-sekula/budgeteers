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
    // if (!defaultBudget.id) return;
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

      <Table className="bg-white rounded-md ">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Icon</TableHead>
            <TableHead>Color</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories &&
            categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.name}</TableCell>
                <TableCell>
                  {/* <Image
                    src={
                      category.icon ||
                      "https://kaekqwmvrbltrhjiklxb.supabase.co/storage/v1/object/public/avatars/avatar.png"
                    }
                    height={64}
                    width={64}
                    alt=""
                    className="size-8 rounded-full"
                  /> */}
                </TableCell>
                <TableCell>
                  <div
                    className="size-8 rounded-full"
                    style={{ backgroundColor: category.color as string }}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() => {
                      console.log("deleting");
                      deleteCategory(category.id);
                    }}
                    // disabled={category.user_id === null}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </>
  );
}
