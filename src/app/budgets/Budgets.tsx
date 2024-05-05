"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { BudgetsWithEntries, fetchBudgets } from "@/utils/supabase/api";

export default function Budgets() {
  const supabase = createClient();
  const query = useQuery({
    queryKey: ["budgets"],
    queryFn: async () => fetchBudgets(supabase),
  });

  const budgets = query.data?.data as BudgetsWithEntries | undefined;

  return (
    <Table className="bg-white rounded-md ">
      <TableHeader>
        <TableRow>
          <TableHead>Starts on</TableHead>
          <TableHead>Ends on</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Budget</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {budgets &&
          budgets.map((budget) => (
            <TableRow key={budget.id}>
              <TableCell>
                {new Date(budget.starts_on).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </TableCell>
              <TableCell>
                {new Date(budget.ends_on).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </TableCell>
              <TableCell>{budget.name}</TableCell>
              <TableCell>
                {budget.budget_entries.map((entry) => (
                  <div key={entry.id}>
                    {`£ ${(entry.budget_amount / 100).toFixed(2)}`} -{" "}
                    {entry.categories?.name} - {entry.description}
                  </div>
                ))}
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
