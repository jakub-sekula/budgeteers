"use client";
import { createClient } from "@/utils/supabase/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { FormEvent, useEffect, useRef, useState } from "react";
import { useToast } from "@/components/ui/use-toast";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { useGlobalContext } from "@/components/Providers";
import { DialogTrigger } from "@radix-ui/react-dialog";

export default function CategoryTransactionForm({
  categoryId,
}: {
  categoryId: string;
}) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const ref = useRef<HTMLFormElement>(null);
  const [open, setOpen] = useState(false);

  const { mutate } = useMutation({
    mutationFn: async (formData: FormData) => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("No user found!");

      const transaction = {
        user_id: user.id,
        amount: Math.trunc(parseFloat(formData.get("amount") as string) * 100),
        budget_category_id: categoryId,
        description: formData.get("description") as string,
      };

      const { data, error } = await supabase
        .from("transactions")
        .insert([transaction])
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: async (data) => {
      console.log(data);
      toast({ title: "Successfully created new transaction" });
      setOpen(false);
      await queryClient.invalidateQueries({
        queryKey: ["budget_periods"],
      });
    },
    onError: (error) => {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message,
      });
    },
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await mutate(new FormData(e.currentTarget));
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            Add transaction
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add new transaction</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} id="categoryForm" ref={ref}>
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
            </div>
          </form>
          <DialogFooter className="flex justify-between">
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
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
