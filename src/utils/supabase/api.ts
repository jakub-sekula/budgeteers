import { QueryData, SupabaseClient } from '@supabase/supabase-js'
import { createClient } from './client';
import { Database, Tables } from '@/types/supabase';
const supabase = createClient()

const transactionsQueryString = "*, categories(name)"
let transactionsQuery = supabase.from("transactions").select(transactionsQueryString);
export type TransactionsWithCategories = QueryData<typeof transactionsQuery>;

export const fetchTransactions = async (client: SupabaseClient<Database>) => {
	let transactions = await client
		.from('transactions')
		.select(transactionsQueryString)
		.is('budget_category_id', null)

	return transactions
}

const budgetsQueryString = "*, budget_entries (name, description, id)"
let budgetsQuery = supabase.from("budgets").select(budgetsQueryString).single();
export type BudgetWithEntries = QueryData<typeof budgetsQuery>;
export type BudgetsWithEntries = BudgetWithEntries[];

export const fetchBudgets = async (client: SupabaseClient<Database>) => {
	let budgets = await client
		.from('budgets')
		.select(budgetsQueryString)

	return budgets
}

export const fetchBudget = async (client: SupabaseClient<Database>, id: string) => {
	let budget = await client
		.from('budgets')
		.select(budgetsQueryString)
		.eq('id', id)
		.single()

	return budget
}

const budgetEntriesQueryString = "*, budget_categories (*, transactions (type,amount,description,id))"
let budgetEntriesQuery = supabase.from("budget_entries").select(budgetEntriesQueryString).single();
export type BudgetEntryWithCategories = QueryData<typeof budgetEntriesQuery>;
export type BudgetEntriesWithCategories = BudgetEntryWithCategories[];

export const fetchBudgetEntries = async (client: SupabaseClient<Database>, budgetId: string) => {
	let budgets = await client
		.from('budget_entries')
		.select(budgetEntriesQueryString)
		.eq('budget_id', budgetId)

	return budgets
}

export const fetchBudgetEntry = async (client: SupabaseClient<Database>, entryId: string) => {
	let budgets = await client
		.from('budget_entries')
		.select(budgetEntriesQueryString)
		.eq('id', entryId)
		.single()

	return budgets
}



export const fetchAccounts = async (client: SupabaseClient<Database>) => {
	return await client.from("accounts").select("*");
};

export const fetchCategories = async (client: SupabaseClient<Database>) => {
	return await client.from("categories").select("*");
};


export async function uploadKeys(payload: Partial<Tables<"users">>) {
	const supabase = await createClient();

	return await supabase.from("users").insert([payload]);
}