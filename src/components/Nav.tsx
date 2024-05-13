"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";

import { createClient } from "@/utils/supabase/client";
import { useGlobalContext } from "@/components/Providers";

import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  budgetsQueryString,
  fetchBudget,
  fetchBudgetPeriods,
  transactionsQueryString,
} from "@/utils/supabase/api";

export default function Nav() {
  const supabase = createClient();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { budgets, defaultBudget, setDefaultBudget } = useGlobalContext();

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
    onMutate: async (newDefault) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["defaultBudget"] });

      // Snapshot the previous value
      const previousDefault = queryClient.getQueryData(["defaultBudget"]);

      // Optimistically update to the new value
      queryClient.setQueryData(["defaultBudget"], { id: newDefault });

      // Set global context to trigger useEffect on budget page (will cause instant navigation)
      setDefaultBudget!(JSON.stringify({ id: newDefault }));

      // Return a context object with the snapshotted value
      return { previousDefault };
    },
    onSettled: async (data) => {
      toast({ title: "Successfully changed default budget" });
      await queryClient.invalidateQueries({
        queryKey: ["defaultBudget"],
      });
      return data;
    },
    onError: (error, newDefault, context) => {
      queryClient.setQueryData(["defaultBudget"], context?.previousDefault);
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
                href={`/budgets/${defaultBudget.id}`}
                legacyBehavior
                passHref
              >
                <NavigationMenuLink
                  className={clsx(navigationMenuTriggerStyle())}
                >
                  My budget
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem
              // Prefetch on hover
              onMouseEnter={() => {
                Promise.all([
                  queryClient.prefetchQuery({
                    queryKey: ["transactions"],
                    queryFn: async () => {
                      return supabase
                        .from("transactions")
                        .select(transactionsQueryString);
                    },
                  }),
                  queryClient.prefetchQuery({
                    queryKey: ["budgets"],
                    queryFn: async () => {
                      return supabase
                        .from("budgets")
                        .select(budgetsQueryString);
                    },
                  }),
                ]);
              }}
            >
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
            <NavigationMenuItem
              // Prefetch on hover
              onMouseEnter={() => {
                Promise.all([
                  queryClient.prefetchQuery({
                    queryKey: ["category_types"],
                    queryFn: async () =>
                      supabase
                        .from("category_types")
                        .select("*")
                        .is("parent_id", null),
                  }),
                  queryClient.prefetchQuery({
                    queryKey: ["budgets", defaultBudget.id],
                    queryFn: async () => fetchBudget(defaultBudget.id),
                  }),
                ]);
              }}
            >
              <Link prefetch={true} href="/categories" legacyBehavior passHref>
                <NavigationMenuLink
                  className={clsx(navigationMenuTriggerStyle())}
                >
                  Categories
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
                  <SelectItem
                    key={budget.id}
                    value={budget.id}
                    onMouseEnter={() =>
                      // Prefetch in background for faster navigation
                      Promise.all([
                        queryClient.prefetchQuery({
                          queryKey: ["budgets", budget.id],
                          queryFn: async () => fetchBudget(budget.id),
                        }),
                        queryClient.prefetchQuery({
                          queryKey: ["budget_periods", budget.id],
                          queryFn: async () => fetchBudgetPeriods(budget.id),
                        }),
                      ])
                    }
                  >
                    {budget.name}
                    {budget.shared ? " (shared)" : null}
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
