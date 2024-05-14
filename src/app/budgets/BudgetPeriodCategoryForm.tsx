"use client";
import { createClient } from "@/utils/supabase/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { FormEvent, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";
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
import {
  BudgetPeriodWithCategories,
  fetchCategoryTypes,
} from "@/utils/supabase/api";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useGlobalContext } from "@/components/Providers";

export default function BudgetPeriodCategoryForm({
  period,
}: {
  period: BudgetPeriodWithCategories;
}) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const supabase = createClient();
  const ref = useRef<HTMLFormElement>(null);

  // const { selectedBudget, selectedBudgetPeriod } = useBudgetContext();
  const { defaultBudget, activePeriod } = useGlobalContext();
  const categoriesQuery = useQuery({
    queryKey: ["category_types"],
    queryFn: fetchCategoryTypes,
  });

  const { data: categories } = categoriesQuery?.data ?? {};

  console.log(period?.budget_period_categories);

  const { mutate } = useMutation({
    mutationFn: async (
      budgetCategory: Partial<Tables<"budget_period_categories">>
    ) => {
      const supabase = createClient();
      console.log(budgetCategory);

      const { data, error } = await supabase
        .from("budget_period_categories")
        .insert([budgetCategory])
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: async (data: Tables<"budget_period_categories">) => {
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
        queryKey: ["budget_periods", defaultBudget?.id],
      }),
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("You must be logged in!");

    const budgetEntry: Partial<Tables<"budget_period_categories">> = {
      budget_period_id: activePeriod?.id || null,
      category_type_id: formData.get("categoryId") as string,
      amount: parseFloat(formData.get("amount") as string) * 100,
    };

    mutate(budgetEntry as Tables<"budget_period_categories">);
  };

  const availableCategories = categories?.filter(
    (category) =>
      !period?.budget_period_categories
        ?.map((bpc) => bpc.category_types?.name)
        .includes(category.name)
  );

  const allCategoriesAssigned = availableCategories?.length === 0;

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="flex gap-2"
            disabled={allCategoriesAssigned}
          >
            {allCategoriesAssigned ? (
              "All categories assigned"
            ) : (
              <>
                Add category <Plus size={16} />
              </>
            )}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add category for {activePeriod?.name}</DialogTitle>
            <DialogDescription>For example May 2024</DialogDescription>
          </DialogHeader>
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
                    <SelectValue
                      placeholder={
                        availableCategories?.length
                          ? "Select"
                          : "All categories assigned"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {availableCategories?.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </form>
          <DialogFooter className="flex justify-between">
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
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
