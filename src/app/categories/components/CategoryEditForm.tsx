import { useGlobalContext } from "@/components/Providers";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Tables } from "@/types/supabase";
import {
  fetchCategoryTypeWithChildren,
  updateCategoryType,
} from "@/utils/supabase/api";
import { createClient } from "@/utils/supabase/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { FormEvent } from "react";

export default function CategoryEditForm({
  categoryId,
}: {
  categoryId: string;
}) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: async (category_type: Tables<"category_types">) =>
      updateCategoryType(category_type),
    onSuccess: async (data: Tables<"category_types">) => {
      toast({ title: `Successfully updated category type ${data.name}` });
      queryClient.invalidateQueries({
        queryKey: ["category_types"],
      });
      queryClient.invalidateQueries({
        queryKey: ["budgets"],
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
    const formData = new FormData(e.target as HTMLFormElement);
    const categoryName = formData.get("name") as string;
    const color = formData.get("color") as string;

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const category = {
      id: categoryId,
      name: categoryName,
      color: color,
      user_id: user.id,
    };

    mutate(category as Tables<"category_types">);
  };

  const query = useQuery({
    queryKey: ["category_types", categoryId],
    queryFn: async () => fetchCategoryTypeWithChildren(categoryId),
  });

  return (
    <>
      <pre>{JSON.stringify(query.data?.data, null, 2)}</pre>
      <form onSubmit={handleSubmit} id="categoryForm">
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" placeholder="Category name" required />
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
    </>
  );
}
