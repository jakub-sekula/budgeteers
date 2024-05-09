"use client";
import { createClient } from "@/utils/supabase/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { FormEvent, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";

import {
  Card,
  CardContent,
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

export default function NewBudgetForm() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const supabase = createClient();
  const ref = useRef<HTMLFormElement>(null);

  const { mutate } = useMutation({
    mutationFn: async (
      budget: Omit<Tables<"budgets">, "created_at" | "color" | "icon" | "id">
    ) => {
      const supabase = createClient();
      console.log(budget);

      const { data, error } = await supabase
        .from("budgets")
        .insert([budget])
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: async (data: Tables<"budgets">) => {
      console.log(data);
      toast({ title: "Successfully created new budget" });
      await queryClient.invalidateQueries({
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

    const budget = {
      user_id: user.id,
      description: formData.get("description") as string,
      name: formData.get("name") as string,
      default: Boolean(formData.get("isDefault")),
    };

    await mutate(budget);
  };

  return (
    <>
      <Card className="col-span-4 shrink-0">
        <CardHeader>
          <CardTitle>Add new budget</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} id="budgetForm" ref={ref}>
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
                <Label htmlFor="isDefault">Default?</Label>
                <Checkbox id="isDefault" name="isDefault"/>
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
          <Button type="submit" form="budgetForm">
            Add
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
