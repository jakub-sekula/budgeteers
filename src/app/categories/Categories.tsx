"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
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

import { Tables } from "@/types/supabase";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Categories() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const supabase = createClient();
      return await supabase.from("categories").select("*");
    },
  });


  const categories = query.data?.data as Tables<"categories">[] | undefined;

  const deleteCategory = async (id: string) => {
    const supabase = createClient();
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) return console.log(error);
    queryClient.invalidateQueries({ queryKey: ["categories"] });
    queryClient.refetchQueries({ queryKey: ["categories"] });
  };

  return (
    <>
    <Table className="bg-white rounded-md ">
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Icon</TableHead>
          <TableHead>Color</TableHead>
          <TableHead>Transaction type</TableHead>
          <TableHead>Default</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {categories &&
          categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell>{category.name}</TableCell>
              <TableCell>
                <Image
                  src={
                    category.icon ||
                    "https://kaekqwmvrbltrhjiklxb.supabase.co/storage/v1/object/public/avatars/avatar.png"
                  }
                  height={64}
                  width={64}
                  alt=""
                  className="size-8 rounded-full"
                />
              </TableCell>
              <TableCell>
                <div
                  className="size-8 rounded-full"
                  style={{ backgroundColor: category.color as string }}
                />
              </TableCell>
              <TableCell>{category.transaction_type}</TableCell>
              <TableCell>{String(category.default)}</TableCell>
              <TableCell>
                <Button
                  onClick={() => {
                    deleteCategory(category.id);
                  }}
                  disabled={category.default as boolean}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
    </>
  );
}
