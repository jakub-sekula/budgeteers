"use client";
import { createClient } from "@/utils/supabase/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { FormEvent, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { useGlobalContext } from "@/components/Providers";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Plus } from "lucide-react";

export default function BudgetPeriodForm({ budgetId }: { budgetId: string }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const ref = useRef<HTMLFormElement>(null);

  const { budgets } = useGlobalContext();

  const { mutate } = useMutation({
    mutationFn: async (
      budgetEntry: Omit<Tables<"budget_periods">, "created_at" | "id" | "is_current">
    ) => {
      const supabase = createClient();
      console.log(budgetEntry);

      const { data, error } = await supabase
        .from("budget_periods")
        .insert([budgetEntry])
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: async (data: Tables<"budget_periods">) => {
      console.log(data);
      toast({ title: "Successfully created new budget entry" });
      queryClient.invalidateQueries({
        queryKey: ["budget_periods", budgetId],
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

    const budgetEntry: Omit<Tables<"budget_periods">, "created_at" | "id" | "is_current"> = {
      budget_id: budgetId,
      // user_id: user.id,
      description: formData.get("description") as string,
      name: formData.get("name") as string,
      starts_on: formData.get("starts_on") as string,
      ends_on: formData.get("ends_on") as string,
    };

    await mutate(budgetEntry);
  };

  const name = budgets.find((budget) => budget.id === budgetId)?.name;

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="flex gap-2">
            Add period <Plus size={16} />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add period for {name}</DialogTitle>
            <DialogDescription>For example May 2024</DialogDescription>
          </DialogHeader>
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
          <DialogFooter>
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
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
