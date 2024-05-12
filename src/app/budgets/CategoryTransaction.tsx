import { Tables } from "@/types/supabase";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createClient } from "@/utils/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useGlobalContext } from "@/components/Providers";

export default function CategoryTransaction({
  transaction,
}: {
  transaction: Tables<"transactions">;
}) {
  const queryClient = useQueryClient();
  const { defaultBudget } = useGlobalContext();
  const deleteTransaction = async () => {
    const supabase = createClient();
    const { error } = await supabase
      .from("transactions")
      .delete()
      .eq("id", transaction.id);
    if (error) return console.log(error);
    queryClient.invalidateQueries({
      queryKey: ["budget_periods", defaultBudget?.id],
    });
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex gap-2 hover:bg-red-200">
          {transaction.description} - £ {(transaction.amount / 100).toFixed(2)}
        </div>
      </DialogTrigger>
      <DialogContent>
        sranie
        <Button
          onClick={() => {
            deleteTransaction();
          }}
        >
          Delete
        </Button>
      </DialogContent>
    </Dialog>
  );
}
