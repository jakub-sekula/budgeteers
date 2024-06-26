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
import {
  createTransaction,
  fetchAccounts,
  fetchCategoryTypesForBudget,
} from "@/utils/supabase/api";
import { Tables } from "@/types/supabase";
import { useGlobalContext } from "@/components/Providers";

export default function TransactionForm({
  budgetPeriodId,
}: {
  budgetPeriodId?: string;
}) {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { defaultBudget, activePeriod } = useGlobalContext();

  const categoriesQuery = useQuery({
    queryKey: ["category_types", defaultBudget?.id],
    queryFn: async () => fetchCategoryTypesForBudget(defaultBudget.id),
    enabled: !!defaultBudget.id,
  });

  const accountsQuery = useQuery({
    queryKey: ["accounts"],
    queryFn: fetchAccounts,
  });

  const { data: accounts } = accountsQuery?.data ?? {};
  const { data: categories } = categoriesQuery?.data ?? {};

  const { mutate } = useMutation({
    mutationFn: async (transaction: Tables<"transactions">) =>
      createTransaction(transaction),
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

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("No user found!");

    const formData = new FormData(e.target as HTMLFormElement);

    const transaction: Partial<Tables<"transactions">> = {
      user_id: user.id,
      category_type_id: formData.get("categoryId") as string,
      from_account: (formData.get("fromAccount") as string) || null,
      to_account: (formData.get("toAccount") as string) || null,
      type: formData.get("type") as string,
      description: (formData.get("description") as string) || null,
      amount: Math.trunc(parseFloat(formData.get("amount") as string) * 100),
      budget_id: defaultBudget.id,
      budget_period_id: budgetPeriodId || activePeriod?.id || null,
    };

    await mutate(transaction as Tables<"transactions">);
  };

  return (
    <>
      <Card className="w-[350px] shrink-0">
        <CardHeader>
          <CardTitle>Add new transaction</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} id="categoryForm">
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
