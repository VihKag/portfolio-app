import { createClient } from "@supabase/supabase-js"

const supabaseUrl = import.meta.env.VITE_PUBLIC_VIKASUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_PUBLIC_VIKASUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables")
  console.error("VITE_PUBLIC_VIKASUPABASE_URL:", supabaseUrl)
  console.error("VITE_PUBLIC_VIKASUPABASE_ANON_KEY:", supabaseAnonKey)
  throw new Error("Missing Supabase environment variables")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)