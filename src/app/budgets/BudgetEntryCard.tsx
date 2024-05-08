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
import { BudgetEntryWithCategories } from "@/utils/supabase/api";
import { usePathname, useRouter } from "next/navigation";
import slugify from "slugify";
import { slugifyWithId } from "@/lib/utils";

export default function BudgetEntryCard({
  entry,
}: {
  entry: BudgetEntryWithCategories;
}) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();
  const {
    setSelectedBudgetEntry,
    selectedBudgetEntry,
    selectedEntryCategoryId,
    setSelectedEntryCategoryId,
	selectedBudget
  } = useBudgetContext();

  const deleteEntry = async (id: string) => {
    const supabase = createClient();
    const { error } = await supabase
      .from("budget_entries")
      .delete()
      .eq("id", id);
    if (error) return console.log(error);
    queryClient.invalidateQueries({
      queryKey: ["budget_entries", selectedBudget?.id],
    });
    queryClient.invalidateQueries({
      queryKey: ["budgets"],
    });
  };

  const deleteCategory = async (id: string) => {
    const supabase = createClient();
    const { error } = await supabase
      .from("budget_categories")
      .delete()
      .eq("id", id);
    if (error) return console.log(error);
    queryClient.invalidateQueries({
      queryKey: ["budget_entries", selectedBudget?.id],
    });
    queryClient.invalidateQueries({
      queryKey: ["budgets"],
    });
  };

  if (!entry) return null;

  return (
    <Card
      key={entry.id}
      onClick={() => {
        setSelectedBudgetEntry(entry);
        router.push(`${pathname}/${entry.id}`);
      }}
      className={clsx(selectedBudgetEntry?.id === entry.id ? "bg-sky-100" : null, 'col-span-8')}
    >
      <CardHeader>
        <CardTitle className="scroll-m-20 text-2xl font-bold tracking-tight lg:text-3xl">
          {entry.name}
          <Button
            onClick={(e) => {
              e.stopPropagation();
              deleteEntry(entry.id);
            }}
          >
            Delete
          </Button>
        </CardTitle>
        <CardDescription className="flex gap-4">
          <span>
            Starts on:{" "}
            {new Date(entry.starts_on).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
          <span>
            Ends on:{" "}
            {new Date(entry.ends_on).toLocaleDateString("en-GB", {
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
          {entry.budget_categories.map((category) => (
            <TableRow
              key={category.id}
              onClick={(e) => {
				e.stopPropagation()
                setSelectedEntryCategoryId(category.id);
              }}
              className={clsx(
                selectedEntryCategoryId === category.id ? "bg-orange-200" : null
              )}
            >
              <TableCell>{category.name}</TableCell>
              <TableCell>{category.description}</TableCell>
              <TableCell>
                <ul>
                  {category?.transactions.map((transaction) => (
                    <li key={entry.id}>
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
