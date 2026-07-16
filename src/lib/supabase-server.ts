import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export const createServerSupabaseClient = async () => {
  const cookieStore = cookies()
  return createRouteHandlerClient(
    { cookies: () => cookieStore }
  )
}
