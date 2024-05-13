import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fetchCategoryTypeWithChildren } from "@/utils/supabase/api";
import { useQuery } from "@tanstack/react-query";
import React, { FormEvent } from "react";

export default function CategoryEditForm({
  categoryId,
}: {
  categoryId: string;
}) {
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
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
          <input type="color" id="color" name="color" defaultValue="#ff00ff" />
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
