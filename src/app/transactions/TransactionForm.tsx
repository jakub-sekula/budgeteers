"use client";
import { createClient } from "@/utils/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
import { fetchAccounts, fetchCategories } from "@/utils/supabase/api";

export default function TransactionForm() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const supabase = createClient();

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

  //   const {
  //     data: { data: categories },
  //   } = categoriesQuery;

  console.log(accounts, categories);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    const supabase = createClient();
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const type = formData.get("type") as string;
    const description = formData.get("description") as string;
    const fromAccount = formData.get("fromAccount") as string;
    const toAccount = formData.get("toAccount") as string;
    const categoryId = formData.get("categoryId") as string;
    const amountString = formData.get("amount") as string;

	const amount = parseFloat(amountString) * 100

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("transactions")
      .insert([
        {
          description: description,
          category_id: categoryId,
          type: type,
          amount: amount,
          user_id: user.id,
          from_account: fromAccount || undefined,
          to_account: toAccount || undefined,
        },
      ])
      .select();

    if (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message,
      });
      return;
    }

    toast({ title: "Successfully created new transaction" });

    const [newTransaction] = data;

    console.log(newTransaction);

    queryClient.invalidateQueries({ queryKey: ["transactions"] });
  };

  return (
    <>
      <Card className="w-[350px]">
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
                <Select name="type" defaultValue="expense">
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
                <Select name="categoryId">
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
