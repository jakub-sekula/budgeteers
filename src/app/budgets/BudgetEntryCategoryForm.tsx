"use client";
import { createClient } from "@/utils/supabase/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { FormEvent, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tables } from "@/types/supabase";
import { Checkbox } from "@/components/ui/checkbox";
import { useBudgetContext } from "./BudgetContext";
import { fetchCategories } from "@/utils/supabase/api";

export default function BudgetEntryCategoryForm() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const supabase = createClient();
  const ref = useRef<HTMLFormElement>(null);

  const { selectedBudget, selectedBudgetEntry } = useBudgetContext();

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: async () => fetchCategories(supabase),
  });

  const { data: categories } = categoriesQuery?.data ?? {};

  

  const { mutate } = useMutation({
    mutationFn: async (
      budgetCategory: Omit<
        Tables<"budget_categories">,
        "created_at" | "id" | "icon"
      >
    ) => {
      const supabase = createClient();
      console.log(budgetCategory);

      const { data, error } = await supabase
        .from("budget_categories")
        .insert([budgetCategory])
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: async (data: Tables<"budget_categories">) => {
      console.log(data);
      toast({ title: "Successfully created new budget" });
    },
    onError: (error) => {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message,
      });
    },
    onSettled: async () =>
      await queryClient.invalidateQueries({
        queryKey: ["budget_entries", selectedBudget?.id],
      }),
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("You must be logged in!");

    const budgetEntry: Omit<
      Tables<"budget_categories">,
      "created_at" | "id" | "icon"
    > = {
      budget_entry_id: selectedBudgetEntry.id,
      user_id: user.id,
      category_id: formData.get("categoryId") as string,
      description: formData.get("description") as string,
      name: categories?.find(category => category.id === formData.get("categoryId"))?.name as string,
      hidden: formData.get("hidden") ? true : false,
      amount: parseFloat(formData.get("amount") as string) * 100,
    };

    await mutate(budgetEntry);
  };

  return (
    <>
      <Card className="col-span-4 shrink-0">
        <CardHeader>
          <CardTitle>Add category for {selectedBudgetEntry?.name}</CardTitle>
          <CardDescription>For example May 2024</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} id="budgetEntryCategoryForm" ref={ref}>
            <div className="grid w-full items-center gap-4">
              {/* <div className="flex flex-col space-y-1.5">
                <Label htmlFor="description">Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Budget name"
                  required
                />
              </div> */}

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="description">Description</Label>
                <Input
                  type="text"
                  id="description"
                  name="description"
                  placeholder="Description"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  type="number"
                  step=".01"
                  id="amount"
                  name="amount"
                  placeholder="Transaction amount"
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="hidden">Hidden?</Label>
                <Checkbox id="hidden" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="categoryId">Category</Label>
                <Select name="categoryId" required>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {categories?.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              toast({ title: "gowno" });
            }}
          >
            Cancel
          </Button>
          <Button type="submit" form="budgetEntryCategoryForm">
            Add
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}