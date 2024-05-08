"use client";

import { useQuery } from "@tanstack/react-query";
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

export default function BudgetsTable() {
  const router = useRouter();
  const supabase = createClient();
  const budgetsQuery = useQuery({
    queryKey: ["budgets"],
    queryFn: async () => fetchBudgets(supabase),
  });

  const { selectedBudget } = useBudgetContext();

  const budgets = budgetsQuery.data?.data as BudgetsWithEntries | undefined;

  console.log(budgets);

  return (
    <>
      <NewBudgetForm />
      <Card className="col-span-8">
        <Table className="bg-white rounded-md ">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Is default</TableHead>
              <TableHead>Entries</TableHead>
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
                    selectedBudget?.id === budget.id ? "bg-emerald-200" : null
                  )}
                >
                  <TableCell>{budget.name}</TableCell>
                  <TableCell>{budget.description}</TableCell>
                  <TableCell>{String(budget.default)}</TableCell>
                  <TableCell>
                    <ul>
                      {budget.budget_entries.map((entry) => (
                        <li key={entry.id}>
                          {entry.name} - {entry.description}
                        </li>
                      ))}
                    </ul>
                  </TableCell>
                  <TableCell className="text-right"></TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Card>
    </>
  );
}
