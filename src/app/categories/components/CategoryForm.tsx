"use client";
import { createClient } from "@/utils/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { FormEvent, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Tables } from "@/types/supabase";
import { createCategoryType } from "@/utils/supabase/api";

export default function CategoryForm() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutate } = useMutation({
    mutationFn: async (category_type: Tables<"category_types">) =>
      await createCategoryType(category_type),
    onSuccess: async (data: Tables<"category_types">) => {
      toast({ title: `Successfully created new category type ${data.name}`});
      queryClient.invalidateQueries({ queryKey: ["category_types"] });
    },
    onError: (error) => {
      console.log(error);
      queryClient.invalidateQueries({ queryKey: ["category_types"] });
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message,
      });
    },
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const categoryName = formData.get("name") as string;
    const color = formData.get("color") as string;
    
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const category = {
      name: categoryName,
      color: color,
      user_id: user.id,
    };

    mutate(category as Tables<"category_types">);
  };

  return (
    <>
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Add new category type</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} id="categoryForm">
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Category name"
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="type">Transaction type</Label>
                <Select name="type" defaultValue="expense">
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="expense">Expense</SelectItem>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="transfer">Transfer</SelectItem>
                    <SelectItem value="all">All</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="color">Color label</Label>
                <input
                  type="color"
                  id="color"
                  name="color"
                  defaultValue="#ff00ff"
                />
              </div>
              <div className="flex flex-col space-y-1.5 overflow-hidden">
                <Label htmlFor="icon">Icon</Label>
                <input type="file" id="icon" name="icon" />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="submit" form="categoryForm">
            Add
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
