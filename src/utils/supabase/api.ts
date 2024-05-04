import { createClient } from '@/utils/supabase/client'

export const fetchTransactions = async () => {
	const supabase = createClient()
	let transactions = await supabase
		.from('transactions')
		.select('*')

	return transactions
}