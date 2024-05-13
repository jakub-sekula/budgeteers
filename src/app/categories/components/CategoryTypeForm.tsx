"use client";
import { createClient } from "@/utils/supabase/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { FormEvent, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";

import {
  Card,
  CardContent,
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
import { splitExt } from "@/lib/utils";
import { Database, Tables } from "@/types/supabase";
import { useGlobalContext } from "@/components/Providers";

export default function CategoryTypeForm() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const supabase = createClient();
  const { defaultBudget } = useGlobalContext();

  const categoryTypesQuery = useQuery({
    queryKey: ["category_types"],
    queryFn: async () => await supabase.from("category_types").select("*").is('parent_id', null),
  });

  const categoryTypes = categoryTypesQuery.data?.data as
    | Tables<"category_types">[]
    | undefined;

  console.log(categoryTypes);

  const { mutate } = useMutation({
    mutationFn: async (category_type_id:string) => {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
  
      const { data, error } = await supabase
        .from("budgets_category_types")
        .upsert({ budget_id: defaultBudget.id, category_type_id: category_type_id });
  
    },
    onSuccess: async (data) => {
      console.log(data);
      toast({ title: "Successfully added" });
      await queryClient.invalidateQueries({
        queryKey: ["budgets", defaultBudget.id],
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
   e.preventDefault()
   const formData = new FormData(e.currentTarget);
   const type = formData.get("type") as string;

   mutate(type)
  };

  return (
    <>
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Add from default types</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} id="categoryTypeForm">
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="type">Transaction type</Label>
                <Select name="type" defaultValue="expense">
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {categoryTypes?.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="submit" form="categoryTypeForm">
            Add
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
