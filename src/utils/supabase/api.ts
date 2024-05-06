import { QueryData, SupabaseClient } from '@supabase/supabase-js'
import { createClient } from './client';
import { Database } from '@/types/supabase';
const supabase = createClient()

const transactionsQueryString = "*, categories(name)"
let transactionsQuery = supabase.from("transactions").select(transactionsQueryString);
export type TransactionsWithCategories = QueryData<typeof transactionsQuery>;

export const fetchTransactions = async (client: SupabaseClient<Database>) => {
	let transactions = await client
		.from('transactions')
		.select(transactionsQueryString)

	return transactions
}

const budgetsQueryString = "*, budget_entries (*, categories(name,color,icon))"
let budgetsQuery = supabase.from("budgets").select(budgetsQueryString);
export type BudgetsWithEntries = QueryData<typeof budgetsQuery>;

export const fetchBudgets = async (client: SupabaseClient<Database>) => {
	let budgets = await client
		.from('budgets')
		.select(budgetsQueryString)

	return budgets
}


export const fetchAccounts = async (client: SupabaseClient<Database>) => {
	return await client.from("accounts").select("*");
};

export const fetchCategories = async (client: SupabaseClient<Database>) => {
	return await client.from("categories").select("*");
};

