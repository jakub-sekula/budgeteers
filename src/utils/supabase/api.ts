import { createClient } from '@/utils/supabase/server'

export const fetchTransactions = async () => {
	const supabase = createClient()
	let transactions = await supabase
		.from('transactions')
		.select('*')

	return transactions
}