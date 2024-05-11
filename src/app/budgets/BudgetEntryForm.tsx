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

export default function BudgetEntryForm() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const supabase = createClient();
  const ref = useRef<HTMLFormElement>(null);

  const { selectedBudget } = useBudgetContext();

  const { mutate } = useMutation({
    mutationFn: async (
      budgetEntry: Omit<Tables<"budget_entries">, "created_at" | "id">
    ) => {
      const supabase = createClient();
      console.log(budgetEntry);

      const { data, error } = await supabase
        .from("budget_entries")
        .insert([budgetEntry])
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: async (data: Tables<"budget_entries">) => {
      console.log(data);
      toast({ title: "Successfully created new budget entry" });
      queryClient.invalidateQueries({
        queryKey: ["budget_entries", selectedBudget?.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["budgets"],
      });
    },
    onError: (error) => {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message,
      });
    },
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("You must be logged in!");

    const budgetEntry: Omit<Tables<"budget_entries">, "created_at" | "id"> = {
      budget_id: selectedBudget?.id,
      // user_id: user.id,
      description: formData.get("description") as string,
      name: formData.get("name") as string,
      starts_on: formData.get("starts_on") as string,
      ends_on: formData.get("ends_on") as string,
    };

    await mutate(budgetEntry);
  };

  return (
    <>
      <Card className="col-span-4 shrink-0">
        <CardHeader>
          <CardTitle>Add entry for {selectedBudget?.name}</CardTitle>
          <CardDescription>For example May 2024</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} id="budgetEntryForm" ref={ref}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="description">Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Budget name"
                  required
                />
              </div>
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
                <Label htmlFor="starts_on">Description</Label>
                <Input
                  type="date"
                  id="starts_on"
                  name="starts_on"
                  placeholder="Starts on"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="ends_on">Description</Label>
                <Input
                  type="date"
                  id="ends_on"
                  name="ends_on"
                  placeholder="Ends on"
                />
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
          <Button type="submit" form="budgetEntryForm">
            Add
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
