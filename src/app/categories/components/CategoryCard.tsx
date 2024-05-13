// import Icon from "@/components/Icon";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tables } from "@/types/supabase";
import clsx from "clsx";
// import dynamicIconImports from "lucide-react/dynamicIconImports";
import { twMerge } from "tailwind-merge";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { createClient } from "@/utils/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Ban, Lock } from "lucide-react";
import { useGlobalContext } from "@/components/Providers";
import {
  CategoryTypesWithChildren,
  CategoryTypeWithChildren,
  fetchCategoryTypeWithChildren,
} from "@/utils/supabase/api";
import CategoryEditForm from "./CategoryEditForm";

const iconColors = {
  red: { bg: "border-red-200 bg-red-100", icon: "text-red-600" },
  orange: { bg: "border-orange-200 bg-orange-100", icon: "text-orange-600" },
  amber: { bg: "border-amber-200 bg-amber-100", icon: "text-amber-600" },
  yellow: { bg: "border-yellow-200 bg-yellow-100", icon: "text-yellow-600" },
  lime: { bg: "border-lime-200 bg-lime-100", icon: "text-lime-600" },
  green: { bg: "border-green-200 bg-green-100", icon: "text-green-600" },
  emerald: {
    bg: "border-emerald-200 bg-emerald-100",
    icon: "text-emerald-600",
  },
  teal: { bg: "border-teal-200 bg-teal-100", icon: "text-teal-600" },
  cyan: { bg: "border-cyan-200 bg-cyan-100", icon: "text-cyan-600" },
  sky: { bg: "border-sky-200 bg-sky-100", icon: "text-sky-600" },
  blue: { bg: "border-blue-200 bg-blue-100", icon: "text-blue-600" },
  indigo: { bg: "border-indigo-200 bg-indigo-100", icon: "text-indigo-600" },
  violet: { bg: "border-violet-200 bg-violet-100", icon: "text-violet-600" },
  purple: { bg: "border-purple-200 bg-purple-100", icon: "text-purple-600" },
  fuchsia: {
    bg: "border-fuchsia-200 bg-fuchsia-100",
    icon: "text-fuchsia-600",
  },
  pink: { bg: "border-pink-200 bg-pink-100", icon: "text-pink-600" },
  rose: { bg: "border-rose-200 bg-rose-100", icon: "text-rose-600" },
  slate: { bg: "border-slate-200 bg-slate-100", icon: "text-slate-600" },
  zinc: { bg: "border-zinc-200 bg-zinc-100", icon: "text-zinc-600" },
  neutral: {
    bg: "border-neutral-200 bg-neutral-100",
    icon: "text-neutral-600",
  },
};

// Define type for valid color keys
type IconColorKey = keyof typeof iconColors;

export default function CategoryCard({
  category,
  className,
}: {
  category: CategoryTypeWithChildren;
  className?: string;
}) {
  const queryClient = useQueryClient();
  const { defaultBudget } = useGlobalContext();

  const deleteCategory = async (id: string) => {
    const supabase = createClient();
    const { error } = await supabase
      .from("budgets_category_types")
      .delete()
      .eq("category_type_id", id)
      .eq("budget_id", defaultBudget.id);
    if (error) return console.log(error);
    queryClient.invalidateQueries({ queryKey: ["budgets", defaultBudget.id] });
  };
  return (
    <Dialog>
      <ContextMenu>
        <ContextMenuTrigger
          className={twMerge("", className)}
          onMouseEnter={() => {
            queryClient.prefetchQuery({
              queryKey: ["category_types", category.id],
              queryFn: async () => fetchCategoryTypeWithChildren(category.id),
            });
          }}
        >
          <Card>
            <CardHeader className="flex-row gap-4 p-4 space-y-0">
              <div
                className={clsx(
                  "size-10 rounded-md flex items-center justify-center border-2",
                  iconColors[category.color as IconColorKey]?.bg ||
                    "bg-neutral-100"
                )}
              >
                <Ban
                  className={clsx(
                    iconColors[category.color as IconColorKey]?.icon ||
                      "text-neutral-600"
                  )}
                />
              </div>
              <div className="flex flex-col m-0">
                <CardTitle className="text-base flex gap-2 items-center">
                  {category.name}
                  {!category?.user_id ? (
                    <Lock size={16} className="text-neutral-500" />
                  ) : null}
                </CardTitle>
                <CardDescription className="capitalize leading-none">
                  {category.category_types ? (
                    <ul>
                      {category.category_types.map((child) => (
                        <li key={child.id}>{child.name}</li>
                      ))}
                    </ul>
                  ) : null}
                </CardDescription>
              </div>
            </CardHeader>
          </Card>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <DialogTrigger asChild>
            <ContextMenuItem>Edit</ContextMenuItem>
          </DialogTrigger>
          <ContextMenuItem onClick={() => deleteCategory(category.id)}>
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit category</DialogTitle>
        </DialogHeader>
        <CategoryEditForm categoryId={category.id} />
      </DialogContent>
    </Dialog>
  );
}
