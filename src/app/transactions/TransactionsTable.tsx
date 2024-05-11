"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
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
import {
  TransactionsWithCategories,
  fetchTransactions,
} from "@/utils/supabase/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useGlobalContext } from "@/components/Providers";

export default function TransactionsTable({
  queryString,
}: {
  queryString: string;
}) {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["transactions"],
    queryFn: async () => await fetchTransactions(supabase),
  });

  const { budgets } = useGlobalContext();

  const transactions = query.data?.data as
    | TransactionsWithCategories
    | undefined;

  const total =
    transactions?.reduce((prev, cur) => {
      return prev + cur.amount;
    }, 0) || 0;

  const deleteTransaction = async (id: string) => {
    const supabase = createClient();
    const { error } = await supabase.from("transactions").delete().eq("id", id);
    if (error) return console.log(error);
    queryClient.invalidateQueries({ queryKey: ["transactions"] });
  };

  return (
    <Card className="w-4/5">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Currency</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-right">Budget</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions &&
            transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">
                  {new Date(transaction.created_at).toLocaleDateString(
                    "en-GB",
                    {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }
                  )}
                </TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell>{transaction.categories?.name}</TableCell>
                <TableCell>{transaction.currency}</TableCell>
                <TableCell className="text-right">
                  £ {(transaction.amount / 100).toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  {
                    budgets?.find(
                      (budget) => budget.id === transaction.budget_id
                    )?.name
                  }
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    onClick={() => {
                      deleteTransaction(transaction.id);
                    }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4}>Total</TableCell>
            <TableCell colSpan={2}>£ {(total / 100).toFixed(2)}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </Card>
  );
}
