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

export default function Nav() {
  const supabase = createClient();
  const router = useRouter();

  return (
    <header className="w-full p-4 flex justify-center bg-white">
      <div className="max-w-6xl w-full">
        <NavigationMenu className="w-full justify-between max-w-full">
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
              <Link prefetch={true} href="/budgets" legacyBehavior passHref>
                <NavigationMenuLink
                  className={clsx(navigationMenuTriggerStyle())}
                >
                  Budgets
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
