"use client";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import clsx from "clsx";
import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useGlobalContext } from "./Providers";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "./ui/use-toast";

export default function Nav() {
  const supabase = createClient();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { budgets, defaultBudget } = useGlobalContext();

  const { mutate } = useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("No user found!");

      const { data, error } = await supabase
        .from("users")
        .update({ default_budget_id: id })
        .eq("id", user.id)
        .select();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: async (data) => {
      toast({ title: "Successfully changed default budget" });
      await queryClient.invalidateQueries({
        queryKey: ["defaultBudget"],
      });
      return data;
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

  return (
    <header className="w-full p-4 flex justify-center bg-white">
      <div className="max-w-6xl w-full">
        <NavigationMenu className="w-full justify-between max-w-full gap-4">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link
                prefetch={true}
                href="/transactions"
                legacyBehavior
                passHref
              >
                <NavigationMenuLink
                  className={clsx(navigationMenuTriggerStyle())}
                >
                  Transactions
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link prefetch={true} href="/accounts" legacyBehavior passHref>
                <NavigationMenuLink
                  className={clsx(navigationMenuTriggerStyle())}
                >
                  Accounts
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link prefetch={true} href="/categories" legacyBehavior passHref>
                <NavigationMenuLink
                  className={clsx(navigationMenuTriggerStyle())}
                >
                  Categories
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link prefetch={true} href={`/budgets/${defaultBudget.id}`} legacyBehavior passHref>
                <NavigationMenuLink
                  className={clsx(navigationMenuTriggerStyle())}
                >
                  My budget
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link prefetch={true} href="/private" legacyBehavior passHref>
                <NavigationMenuLink
                  className={clsx(navigationMenuTriggerStyle())}
                >
                  Profile
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
          <div className="flex flex-col space-y-1.5 ml-auto w-48">
            <Select
              name="user"
              onValueChange={(value) => mutate(value)}
              value={defaultBudget.id}
            >
              <SelectTrigger id="user">
                <SelectValue placeholder="Select budget" />
              </SelectTrigger>
              <SelectContent position="popper">
                {budgets.map((budget) => (
                  <SelectItem key={budget.id} value={budget.id}>
                    {/* <div className="flex gap-2 items-center"> */}
                    {/* <div className="size-3 rounded-full bg-emerald-500" /> */}
                    {budget.name}
                    {/* </div> */}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={async () => {
              await supabase.auth.signOut();
              router.push("/login");
              router.refresh();
            }}
          >
            Sign out
          </Button>
        </NavigationMenu>
      </div>
    </header>
  );
}
