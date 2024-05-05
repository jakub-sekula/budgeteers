import { createClient } from "@/utils/supabase/server";
import { type ClassValue, clsx } from "clsx"
import { redirect } from "next/navigation";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function splitExt(filename: string) {
  const fileSplit = filename.split('.')
  const fileExt = fileSplit.pop()
  const fileName = String(fileSplit)
  return [fileName, fileExt]
}