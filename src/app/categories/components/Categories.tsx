"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  CategoryTypesWithChildren,
  fetchBudget,
  fetchCategoryTypes,
  fetchCategoryTypesWithChildren,
} from "@/utils/supabase/api";
import CategoryCard from "./CategoryCard";
import { useGlobalContext } from "@/components/Providers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import CategoryForm from "./CategoryForm";
import CategoryTypeForm from "./CategoryTypeForm";

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

  const typesQuery = useQuery({
    queryKey: ["category_types"],
    queryFn: fetchCategoryTypesWithChildren,
  });

  const categoryTypes = typesQuery.data?.data;

  return (
    <>
      <Tabs defaultValue="types" className="">
        <TabsList>
          <TabsTrigger value="types">Category types</TabsTrigger>
          <TabsTrigger value="budget">This budget</TabsTrigger>
        </TabsList>
        <TabsContent value="types" className="grid grid-cols-6 gap-4">
          {categoryTypes?.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              type="default"
              className="col-span-2"
            />
          ))}
          <Dialog>
            <DialogTrigger className="col-span-2">
              <Card>
                <CardHeader className="flex-row gap-4 p-4 space-y-0">
                  <div className="size-10 rounded-md flex items-center justify-center border-2 border-green-200 bg-green-100">
                    <Plus className="text-green-600" />
                  </div>
                  <div className="flex flex-col m-0">
                    <CardTitle className="text-base flex gap-2 items-center">
                      Add new
                    </CardTitle>
                  </div>
                </CardHeader>
              </Card>
            </DialogTrigger>
            <DialogContent>
              <CategoryForm />
            </DialogContent>
          </Dialog>
        </TabsContent>
        <TabsContent value="budget" className="grid grid-cols-6 gap-4">
          {categories?.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              className="col-span-2"
            />
          ))}
            <CategoryTypeForm />

        </TabsContent>
      </Tabs>
    </>
  );
}
