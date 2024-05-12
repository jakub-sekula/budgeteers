import { QueryData, SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "./client";
import { Database, Tables } from "@/types/supabase";
const supabase = createClient();

const transactionsQueryString = "*, categories(name), category_types(name)";
let transactionsQuery = supabase.from("transactions").select(
  transactionsQueryString,
);
export type TransactionsWithCategories = QueryData<typeof transactionsQuery>;

export const fetchTransactions = async (client: SupabaseClient<Database>) => {
  let transactions = await client
    .from("transactions")
    .select(transactionsQueryString);

  return transactions;
};

const budgetsQueryString =
  "*, category_types (*, category_types(*)), budget_periods (name, description, id, is_current)";
let budgetsQuery = supabase.from("budgets").select(budgetsQueryString).single();
export type BudgetWithEntries = QueryData<typeof budgetsQuery>;
export type BudgetsWithEntries = BudgetWithEntries[];

export const fetchBudgets = async (client: SupabaseClient<Database>) => {
  let budgets = await client
    .from("budgets")
    .select(budgetsQueryString);

  return budgets;
};

export const fetchBudget = async (
  client: SupabaseClient<Database>,
  id: string,
) => {
  let budget = await client
    .from("budgets")
    .select(budgetsQueryString)
    .eq("id", id)
    .single();

  return budget;
};

const budgetPeriodsQueryString =
  "*, budget_period_categories (*, category_types(*), transactions(*))";
let budgetPeriodsQuery = supabase.from("budget_periods").select(
  budgetPeriodsQueryString,
).single();
export type BudgetPeriodWithCategories = QueryData<typeof budgetPeriodsQuery>;
export type BudgetPeriodsWithCategories = BudgetPeriodWithCategories[];

export const fetchBudgetPeriods = async (
  client: SupabaseClient<Database>,
  budgetId: string,
) => {
  let budgets = await client
    .from("budget_periods")
    .select(budgetPeriodsQueryString)
    .eq("budget_id", budgetId);

  return budgets;
};

export const fetchBudgetPeriod = async (
  client: SupabaseClient<Database>,
  entryId: string,
) => {
  let budgets = await client
    .from("budget_periods")
    .select(budgetPeriodsQueryString)
    .eq("id", entryId)
    .single();

  return budgets;
};

export const fetchAccounts = async (client: SupabaseClient<Database>) => {
  return await client.from("accounts").select("*");
};

export const fetchCategories = async (client: SupabaseClient<Database>) => {
  return await client.from("category_types").select("*");
};

export const fetchCategoryTypes = async (client: SupabaseClient<Database>) => {
  return await client.from("category_types").select("*");
};

let categoryTypesForBudgetQuery = supabase
  .from("category_types")
  .select("budgets_category_types!inner(budget_id)")
  .eq("budgets_category_types.budget_id", "budgetId");

export type CategoryTypesForBudget = QueryData<
  typeof categoryTypesForBudgetQuery
>;

export const fetchCategoryTypesForBudget = async (
  client: SupabaseClient<Database>,
  budgetId: string,
) => {
  return await client.from("category_types")
    .select("*, budgets_category_types!inner(budget_id), category_types(*)")
    .eq("budgets_category_types.budget_id", budgetId);
};

let categoryWithChildrenQuery = supabase
  .from("category_types")
  .select("*, category_types!parent_id(*)")
  .single();

export type CategoryWithChildren = QueryData<
  typeof categoryWithChildrenQuery
>;

export type CategoriesWithChildren = CategoryWithChildren[];

export async function uploadKeys(payload: Partial<Tables<"users">>) {
  const supabase = await createClient();

  return await supabase.from("users").insert([payload]);
}
