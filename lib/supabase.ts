import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      providers: {
        Row: {
          id: string
          first_name: string | null
          last_name: string | null
          dui: string | null
          whatsapp: string | null
          has_fixed_job: boolean | null
          is_approved: boolean
          registration_step: number | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          first_name?: string | null
          last_name?: string | null
          dui?: string | null
          whatsapp?: string | null
          has_fixed_job?: boolean | null
          is_approved?: boolean
          registration_step?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          first_name?: string | null
          last_name?: string | null
          dui?: string | null
          whatsapp?: string | null
          has_fixed_job?: boolean | null
          is_approved?: boolean
          registration_step?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      admins: {
        Row: {
          id: string
          email: string
          created_at: string | null
        }
        Insert: {
          id: string
          email: string
          created_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          created_at?: string | null
        }
      }
    }
    Views: {
      providers_admin_view: {
        Row: {
          id: string
          first_name: string | null
          last_name: string | null
          dui: string | null
          whatsapp: string | null
          has_fixed_job: boolean | null
          registration_step: number | null
          is_approved: boolean
          email: string | null
          areas: string[]
          years_experience: number
          description: string
          dui_front_url: string | null
          dui_back_url: string | null
          police_record_url: string | null
        }
      }
    }
  }
}
