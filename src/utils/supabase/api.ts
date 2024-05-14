import { QueryData, SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "./client";
import { Database, Tables } from "@/types/supabase";
const supabase = createClient();

// Transactions functions

export const transactionsQueryString = "*, category_types(name)";
let transactionsQuery = supabase.from("transactions").select(
  transactionsQueryString,
).single();
export type TransactionWithCategories = QueryData<typeof transactionsQuery>;
export type TransactionsWithCategories = TransactionWithCategories[];

export const fetchTransactions = async () => {
  const supabase = createClient();
  return supabase
    .from("transactions")
    .select(transactionsQueryString);
};

export const fetchTransaction = async (
  transactionId: string,
) => {
  const supabase = createClient();
  return supabase
    .from("transactions")
    .select(transactionsQueryString)
    .eq("id", transactionId)
    .single();
};

export const createTransaction = async (
  transaction: Tables<"transactions">,
) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("transactions")
    .insert([transaction])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

// Budgets functions

export const budgetsQueryString =
  "*, category_types (*, category_types(*)), budget_periods (name, description, id, is_current)";
let budgetsQuery = supabase.from("budgets").select(budgetsQueryString).single();

export type BudgetWithEntries = QueryData<typeof budgetsQuery>;
export type BudgetsWithEntries = BudgetWithEntries[];

export const fetchBudgets = async () => {
  const supabase = createClient();
  return supabase
    .from("budgets")
    .select(budgetsQueryString);
};

export const fetchBudget = async (
  id: string,
) => {
  const supabase = createClient();
  return supabase
    .from("budgets")
    .select(budgetsQueryString)
    .eq("id", id)
    .single();
};

// Budget period functions

const budgetPeriodsQueryString =
  "*, budget_period_categories (*, category_types(*), transactions(*))";
let budgetPeriodsQuery = supabase.from("budget_periods").select(
  budgetPeriodsQueryString,
).single();
export type BudgetPeriodWithCategories = QueryData<typeof budgetPeriodsQuery>;
export type BudgetPeriodsWithCategories = BudgetPeriodWithCategories[];

export const fetchBudgetPeriods = async (
  budgetId: string,
) => {
  const supabase = createClient();
  return supabase
    .from("budget_periods")
    .select(budgetPeriodsQueryString)
    .eq("budget_id", budgetId);
};

export const fetchBudgetPeriod = async (
  periodId: string,
) => {
  const supabase = createClient();
  return supabase
    .from("budget_periods")
    .select(budgetPeriodsQueryString)
    .eq("id", periodId)
    .single();
};

// Accounts functions

export const fetchAccounts = async () => {
  const supabase = createClient();
  return supabase.from("accounts").select("*");
};

export const fetchAccount = async (accountId: string) => {
  const supabase = createClient();
  return supabase.from("accounts").select("*").eq("id", accountId);
};

// Category types functions

export type CategoryType = Tables<"category_types">;
export type CategoryTypes = CategoryType[];

export const fetchCategoryTypes = async () => {
  const supabase = createClient();
  return supabase.from("category_types").select("*");
};

export const createCategoryType = async (
  categoryType: Partial<Tables<"category_types">>,
) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("category_types")
    .insert([categoryType as Tables<"category_types">])
    .select()
    .single()

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const updateCategoryType = async (
  categoryType: Partial<Tables<"category_types">>,
) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("category_types")
    .upsert([categoryType as Tables<"category_types">])
    .select()
    .single()

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

let categoryTypesForBudgetQuery = supabase
  .from("category_types")
  .select("budgets_category_types!inner(budget_id)")
  .eq("budgets_category_types.budget_id", "budgetId");

export type CategoryTypesForBudget = QueryData<
  typeof categoryTypesForBudgetQuery
>;

export const fetchCategoryTypesForBudget = async (
  budgetId: string,
) => {
  const supabase = createClient();
  return supabase.from("category_types")
    .select("*, budgets_category_types!inner(budget_id), category_types(*)")
    .eq("budgets_category_types.budget_id", budgetId);
};

let categoryWithChildrenQuery = supabase
  .from("category_types")
  .select("*, category_types!parent_id(*)")
  .single();

export type CategoryTypeWithChildren = QueryData<
  typeof categoryWithChildrenQuery
>;
export type CategoryTypesWithChildren = CategoryTypeWithChildren[];

export const fetchCategoryTypeWithChildren = async (
  categoryId: string,
) => {
  const supabase = createClient();
  return supabase.from("category_types")
    .select("*, category_types!parent_id(*)")
    .eq("id", categoryId)
    .single();
};

export const fetchCategoryTypesWithChildren = async (
) => {
  const supabase = createClient();
  return supabase.from("category_types")
    .select("*, category_types!parent_id(*)")
};

// Crypto key functions

export async function uploadKeys(payload: Partial<Tables<"users">>) {
  const supabase = createClient();
  return supabase.from("users").insert([payload]);
}
