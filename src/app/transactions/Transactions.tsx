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
import {
  TransactionsWithCategories,
  fetchTransactions,
} from "@/utils/supabase/api";

export default function Transactions({ queryString }: { queryString: string }) {
  const supabase = createClient();

  const query = useQuery({
    queryKey: ["transactions"],
    queryFn: async () => await fetchTransactions(supabase),
  });

  const transactions = query.data?.data as
    | TransactionsWithCategories
    | undefined;

  const total =
    transactions?.reduce((prev, cur) => {
      return prev + cur.amount;
    }, 0) || 0;

  return (
    <Table className="bg-white rounded-md ">
      <TableHeader>
        <TableRow>
          <TableHead className="w-[150px]">Date</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Currency</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions &&
          transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell className="font-medium">
                {new Date(transaction.created_at).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </TableCell>
              <TableCell>{transaction.description}</TableCell>
              <TableCell>{transaction.categories?.name}</TableCell>
              <TableCell>{transaction.currency}</TableCell>
              <TableCell className="text-right">
                £ {(transaction.amount / 100).toFixed(2)}
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={4}>Total</TableCell>
          <TableCell className="text-right">
            £ {(total / 100).toFixed(2)}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
