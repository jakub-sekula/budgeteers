"use client";
import { createClient } from "@/utils/supabase/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { FormEvent, useEffect, useRef } from "react";
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
import { fetchAccounts, fetchCategories } from "@/utils/supabase/api";
import { Tables } from "@/types/supabase";
import { useGlobalContext } from "@/components/Providers";

export default function TransactionForm() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const supabase = createClient();
  const ref = useRef<HTMLFormElement>(null);
  const { defaultBudget, activePeriod } = useGlobalContext();

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: async () => fetchCategories(supabase),
  });

  const accountsQuery = useQuery({
    queryKey: ["accounts"],
    queryFn: async () => fetchAccounts(supabase),
  });

  const { data: accounts } = accountsQuery?.data ?? {};
  const { data: categories } = categoriesQuery?.data ?? {};

  const { mutate } = useMutation({
    mutationFn: async (formData: FormData) => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("No user found!");

      const transaction: Omit<
        Tables<"transactions">,
        | "created_at"
        | "currency"
        | "exclude_from_totals"
        | "id"
        | "budget_category_id"
      > = {
        user_id: user.id,
        category_id: formData.get("categoryId") as string,
        from_account: (formData.get("fromAccount") as string) || null,
        to_account: (formData.get("toAccount") as string) || null,
        type: formData.get("type") as string,
        description: formData.get("description") as string,
        amount: Math.trunc(parseFloat(formData.get("amount") as string) * 100),
        budget_id: defaultBudget.id,
        budget_period_id: activePeriod?.id || null,
      };

      const { data, error } = await supabase
        .from("transactions")
        .insert([transaction])
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: async (data) => {
      console.log(data);
      toast({ title: "Successfully created new transaction" });
      await queryClient.invalidateQueries({
        queryKey: ["transactions"],
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
    await mutate(new FormData(e.currentTarget));
  };

  return (
    <>
      <Card className="w-[350px] shrink-0">
        <CardHeader>
          <CardTitle>Add new transaction</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} id="categoryForm" ref={ref}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  name="description"
                  placeholder="Transaction description"
                  required
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
                <Label htmlFor="type">Transaction type</Label>
                <Select name="type" defaultValue="expense" required>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="expense">Expense</SelectItem>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="transfer">Transfer</SelectItem>
                  </SelectContent>
                </Select>
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
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="fromAccount">From account</Label>
                <Select name="fromAccount">
                  <SelectTrigger id="fromAccount">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {accounts?.map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="toAccount">To account</Label>
                <Select name="toAccount">
                  <SelectTrigger id="toAccount">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {accounts?.map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.name}
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
          <Button type="submit" form="categoryForm">
            Add
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
