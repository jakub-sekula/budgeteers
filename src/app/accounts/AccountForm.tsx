"use client";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import React, { FormEvent } from "react";

export default function AccountForm() {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const accountName = formData.get("name") as string;
    const accountType = formData.get("type") as string;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("accounts")
      .insert([{ name: accountName, type: accountType, user_id: user.id }])
      .select();

    if (error) {
      console.log(error);
    }

    queryClient.invalidateQueries({ queryKey: ["accounts"] });

  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="name">Name</label>
      <input type="text" name="name" required />
      <label htmlFor="type">Type</label>
      <input type="text" name="type" defaultValue="type" />
      <Button>Submit</Button>
    </form>
  );
}
