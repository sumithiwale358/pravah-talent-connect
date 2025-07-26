export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      employer_profiles: {
        Row: {
          company_description: string | null
          company_name: string
          company_size: Database["public"]["Enums"]["company_size"] | null
          contact_person: string
          created_at: string | null
          designation: string | null
          id: string
          profile_id: string
          updated_at: string | null
          website: string | null
        }
        Insert: {
          company_description?: string | null
          company_name: string
          company_size?: Database["public"]["Enums"]["company_size"] | null
          contact_person: string
          created_at?: string | null
          designation?: string | null
          id?: string
          profile_id: string
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          company_description?: string | null
          company_name?: string
          company_size?: Database["public"]["Enums"]["company_size"] | null
          contact_person?: string
          created_at?: string | null
          designation?: string | null
          id?: string
          profile_id?: string
          updated_at?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employer_profiles_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      job_applications: {
        Row: {
          applied_at: string | null
          cover_letter: string | null
          id: string
          job_id: string
          job_seeker_profile_id: string
          status: string
          updated_at: string | null
        }
        Insert: {
          applied_at?: string | null
          cover_letter?: string | null
          id?: string
          job_id: string
          job_seeker_profile_id: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          applied_at?: string | null
          cover_letter?: string | null
          id?: string
          job_id?: string
          job_seeker_profile_id?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      job_seeker_profiles: {
        Row: {
          created_at: string | null
          designation: string | null
          education: string | null
          experience_level:
            | Database["public"]["Enums"]["experience_level"]
            | null
          first_name: string
          id: string
          last_name: string
          profile_id: string
          resume_url: string | null
          skills: string[] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          designation?: string | null
          education?: string | null
          experience_level?:
            | Database["public"]["Enums"]["experience_level"]
            | null
          first_name: string
          id?: string
          last_name: string
          profile_id: string
          resume_url?: string | null
          skills?: string[] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          designation?: string | null
          education?: string | null
          experience_level?:
            | Database["public"]["Enums"]["experience_level"]
            | null
          first_name?: string
          id?: string
          last_name?: string
          profile_id?: string
          resume_url?: string | null
          skills?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_seeker_profiles_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          applications_count: number | null
          country: string | null
          created_at: string | null
          description: string
          employer_profile_id: string
          expires_at: string | null
          gender: string | null
          hide_salary: boolean | null
          id: string
          max_experience: number | null
          max_salary: number | null
          min_experience: number | null
          min_salary: number | null
          openings: number | null
          status: string
          title: string
          updated_at: string | null
          views_count: number | null
        }
        Insert: {
          applications_count?: number | null
          country?: string | null
          created_at?: string | null
          description: string
          employer_profile_id: string
          expires_at?: string | null
          gender?: string | null
          hide_salary?: boolean | null
          id?: string
          max_experience?: number | null
          max_salary?: number | null
          min_experience?: number | null
          min_salary?: number | null
          openings?: number | null
          status?: string
          title: string
          updated_at?: string | null
          views_count?: number | null
        }
        Update: {
          applications_count?: number | null
          country?: string | null
          created_at?: string | null
          description?: string
          employer_profile_id?: string
          expires_at?: string | null
          gender?: string | null
          hide_salary?: boolean | null
          id?: string
          max_experience?: number | null
          max_salary?: number | null
          min_experience?: number | null
          min_salary?: number | null
          openings?: number | null
          status?: string
          title?: string
          updated_at?: string | null
          views_count?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          id: string
          location: string | null
          phone: string | null
          updated_at: string | null
          user_id: string
          user_type: Database["public"]["Enums"]["user_type"]
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          location?: string | null
          phone?: string | null
          updated_at?: string | null
          user_id: string
          user_type: Database["public"]["Enums"]["user_type"]
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          location?: string | null
          phone?: string | null
          updated_at?: string | null
          user_id?: string
          user_type?: Database["public"]["Enums"]["user_type"]
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      company_size: "startup" | "small" | "medium" | "large" | "enterprise"
      experience_level: "fresher" | "junior" | "mid" | "senior"
      user_type: "jobseeker" | "employer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      company_size: ["startup", "small", "medium", "large", "enterprise"],
      experience_level: ["fresher", "junior", "mid", "senior"],
      user_type: ["jobseeker", "employer"],
    },
  },
} as const
