import React from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";

import clsx from "clsx";
import { createClient } from "@/utils/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { BudgetPeriodWithCategories } from "@/utils/supabase/api";
import { useRouter } from "next/navigation";
import { useGlobalContext } from "@/components/Providers";
import CategoryTransactionForm from "@/app/budgets/CategoryTransactionForm";
import CategoryTransaction from "./CategoryTransaction";

export default function BudgetPeriodCard({
  period,
}: {
  period: BudgetPeriodWithCategories;
}) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { defaultBudget } = useGlobalContext();

  const deleteEntry = async (id: string) => {
    const supabase = createClient();
    const { error } = await supabase
      .from("budget_periods")
      .delete()
      .eq("id", id);
    if (error) return console.log(error);
    queryClient.invalidateQueries({
      queryKey: ["budget_periods", defaultBudget?.id],
    });
    queryClient.invalidateQueries({
      queryKey: ["budgets"],
    });
  };

  const deleteCategory = async (id: string) => {
    const supabase = createClient();
    const { error } = await supabase
      .from("budget_period_categories")
      .delete()
      .eq("id", id);
    if (error) return console.log(error);
    queryClient.invalidateQueries({
      queryKey: ["budget_periods", defaultBudget?.id],
    });
    queryClient.invalidateQueries({
      queryKey: ["budgets"],
    });
  };

  if (!period) return null;

  return (
    <Card
      key={period.id}
      className={clsx(
        defaultBudget?.id === period.id ? "bg-sky-100" : null,
        "col-span-full"
      )}
    >
      <CardHeader>
        <CardTitle className="scroll-m-20 text-2xl font-bold tracking-tight lg:text-3xl">
          {period.name}
          {period.is_current ? " - (active)" : null}
          <Button
            onClick={(e) => {
              e.stopPropagation();
              deleteEntry(period.id);
            }}
          >
            Delete
          </Button>
          <Button
            onClick={() => {
              router.push(`/budgets/${defaultBudget.id}/${period.id}`);
            }}
          >
            Deets
          </Button>
        </CardTitle>
        <CardDescription className="flex gap-4">
          <span>
            Starts on:{" "}
            {new Date(period.starts_on).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
          <span>
            Ends on:{" "}
            {new Date(period.ends_on).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
        </CardDescription>
      </CardHeader>

      <Table className="bg-white rounded-md ">
        <TableHeader>
          <TableRow>
            <TableHead>Category</TableHead>
            <TableHead>Children</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {period.budget_period_categories
            .slice() // Create a shallow copy of the array to avoid mutating the original array
            .sort((a, b) => {
              if (!a.category_types?.name || !b.category_types?.name) return;
              return a.category_types.name.localeCompare(b.category_types.name);
            })
            .map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category?.category_types?.name}</TableCell>
                <TableCell>
                  <ul>
                    {category?.transactions?.map((transaction) => (
                      <CategoryTransaction
                        key={transaction.id}
                        transaction={transaction}
                      />
                    ))}
                  </ul>
                </TableCell>
                <TableCell>£ {(category.amount / 100).toFixed(2)}</TableCell>
                <TableCell>{category.type}</TableCell>
                <TableCell>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteCategory(category.id);
                    }}
                  >
                    Delete
                  </Button>
                  <CategoryTransactionForm categoryId={category.id}  />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </Card>
  );
}
