import React from "react";
import { useBudgetContext } from "./BudgetContext";
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
import { usePathname, useRouter } from "next/navigation";
import slugify from "slugify";
import { slugifyWithId } from "@/lib/utils";
import { useGlobalContext } from "@/components/Providers";

export default function BudgetPeriodCard({
  period,
}: {
  period: BudgetPeriodWithCategories;
}) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();

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
      onClick={() => {
        // setdefaultBudgetPeriod(period);
        router.push(`/budgets/${defaultBudget.id}/${period.id}`);
      }}
      className={clsx(
        defaultBudget?.id === period.id ? "bg-sky-100" : null,
        "col-span-8"
      )}
    >
      <CardHeader>
        <CardTitle className="scroll-m-20 text-2xl font-bold tracking-tight lg:text-3xl">
          {period.name}
          <Button
            onClick={(e) => {
              e.stopPropagation();
              deleteEntry(period.id);
            }}
          >
            Delete
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
            <TableHead>Description</TableHead>
            <TableHead>Children</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {period.budget_period_categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell>{category?.categories?.name}</TableCell>
              {/* <TableCell>{category.description}</TableCell> */}
              <TableCell>
                <ul>
                  {category?.transactions?.map((transaction) => (
                    <li key={period.id}>
                      {transaction.description} - £{" "}
                      {(transaction.amount / 100).toFixed(2)}
                    </li>
                  ))}
                </ul>
              </TableCell>
              <TableCell>£ {(category.amount / 100).toFixed(2)}</TableCell>
              <TableCell>
                <Button
                  onClick={() => {
                    deleteCategory(category.id);
                  }}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
