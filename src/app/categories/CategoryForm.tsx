"use client";
import { createClient } from "@/utils/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
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
import { splitExt } from "@/lib/utils";
import { Tables } from "@/types/supabase";

export default function CategoryForm() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    const supabase = createClient();
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const categoryName = formData.get("name") as string;
    const type = formData.get("type") as string;
    const color = formData.get("color") as string;
    const icon = formData.get("icon") as File;

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!icon || !user) return;

    const [filename, extension] = splitExt(icon.name);

    const { data, error } = await supabase
      .from("categories")
      .insert([
        {
          name: categoryName,
          transaction_type: type,
          color: color,
          user_id: user.id,
        },
      ])
      .select();

    if (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message,
      });
      return;
    }

    toast({ title: "Successfully created new category" });


    const [newCategory] = data;

    if (!icon.name) {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      return;
    }

    try {
      const { data: uploadRes, error } = await supabase.storage
        .from("avatars")
        .upload(`${user.id}/${filename}-${Date.now()}.${extension}`, icon);

      if (error) {
        console.error("Error uploading file:", error.message);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: error.message,
        });
      } else {
        console.log("File uploaded successfully:", uploadRes);

        const { data: uploadData } = supabase.storage
          .from("avatars")
          .getPublicUrl(uploadRes.path);

        const res = await supabase
          .from("categories")
          .update({ icon: uploadData?.publicUrl })
          .eq("id", newCategory.id);

        console.log(res);
      }
    } catch (error: any) {
      console.error("Error uploading file:", error.message);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message,
      });
    }

    queryClient.invalidateQueries({ queryKey: ["categories"] });
  };

  return (
    <>
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Add new category</CardTitle>
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
                <Label htmlFor="color">Icon</Label>
                <input type="file" id="icon" name="icon" />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
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
        </CardFooter>
      </Card>
    </>
  );
}
