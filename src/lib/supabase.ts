import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side client with service role key for admin operations
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Database types
export interface User {
  id: string
  clerk_user_id: string
  email: string
  stripe_customer_id?: string
  plan: 'free' | 'monthly' | 'yearly'
  is_active: boolean
  billing_end_date?: string
  token_savings: number
  context_requests: number
  created_at: string
  updated_at: string
} 