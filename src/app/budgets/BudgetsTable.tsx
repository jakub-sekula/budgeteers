"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import slugify from "slugify";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { BudgetsWithEntries, fetchBudgets } from "@/utils/supabase/api";
import { Card } from "@/components/ui/card";
import { useBudgetContext } from "./BudgetContext";
import clsx from "clsx";
import NewBudgetForm from "./NewBudgetForm";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useGlobalContext } from "@/components/Providers";

export default function BudgetsTable() {
  const router = useRouter();
  const budgetsQuery = useQuery({
    queryKey: ["budgets"],
    queryFn: fetchBudgets,
  });

  const queryClient = useQueryClient();

  const {defaultBudget} = useGlobalContext()

  const budgets = budgetsQuery.data?.data as BudgetsWithEntries | undefined;

  const deleteBudget = async (id: string) => {
    const supabase = createClient();
    const { error } = await supabase.from("budgets").delete().eq("id", id);
    if (error) return console.log(error);
    queryClient.invalidateQueries({
      queryKey: ["budgets"],
    });
  };

  return (
    <>
      <NewBudgetForm />
      <Card className="col-span-8">
        <Table className="bg-white rounded-md ">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Entries</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!!budgets &&
              budgets.map((budget) => (
                <TableRow
                  key={budget.id}
                  onClick={() => {
                    router.push(`/budgets/${budget.id}`);
                  }}
                  className={clsx(
                    defaultBudget?.id === budget.id ? "bg-emerald-200" : null
                  )}
                >
                  <TableCell>{budget.name}</TableCell>
                  <TableCell>{budget.description}</TableCell>
                  <TableCell>
                    <ul>
                      {budget.budget_periods.map((entry) => (
                        <li key={entry.id}>
                          {entry.name} - {entry.description}
                        </li>
                      ))}
                    </ul>
                  </TableCell>
                  <TableCell className="text-right"></TableCell>
                  <TableCell className="text-right">

                  <Button
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteBudget(budget.id);
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
    </>
  );
}
