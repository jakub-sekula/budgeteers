"use client";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import React, { FormEvent } from "react";

export default function CategoryForm() {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const categoryName = formData.get("name") as string;
    const color = formData.get("color") as string;

    console.log(categoryName);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    console.log(user);

    if (!user) return;

    const { data, error } = await supabase
      .from("categories")
      .insert([{ name: categoryName, color: color, user_id: user.id }])
      .select();

    if (error) {
      console.log(error);
    }

    queryClient.invalidateQueries({ queryKey: ["categories"] });

    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="name">Name</label>
      <input type="text" name="name" required />
      <label htmlFor="color">Color</label>
      <input type="text" name="color" defaultValue="blue" />
      <Button>Submit</Button>
    </form>
  );
}
