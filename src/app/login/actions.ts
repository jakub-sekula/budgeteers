'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
	const supabase = createClient()

	// type-casting here for convenience
	// in practice, you should validate your inputs
	const data = {
		email: formData.get('email') as string,
		password: formData.get('password') as string,
	}

	const { error } = await supabase.auth.signInWithPassword(data)

	if (error) {
		console.log(error)
		redirect('/error')
	}

	revalidatePath('/', 'layout')
	redirect('/private')
}

export async function loginWithMagicLink(formData: FormData) {
	const supabase = createClient()

	// type-casting here for convenience
	// in practice, you should validate your inputs
	const data = {
		email: formData.get('email') as string,
		options: {
			// set this to false if you do not want the user to be automatically signed up
			shouldCreateUser: true,
			// emailRedirectTo: 'http://localhost:3000/private',
		  },
	}

	console.log(data)

	const { error } = await supabase.auth.signInWithOtp(data)

	if (error) {
		console.log(error)
		redirect('/error')
	}

	revalidatePath('/', 'layout')
	redirect('/login/check-email')
}