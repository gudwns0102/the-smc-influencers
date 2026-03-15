export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      contents: {
        Row: {
          created_at: string
          id: number
          influencer_id: string
          is_ad: boolean
          published_at: string
          view_count: number
        }
        Insert: {
          created_at?: string
          id?: number
          influencer_id: string
          is_ad?: boolean
          published_at: string
          view_count: number
        }
        Update: {
          created_at?: string
          id?: number
          influencer_id?: string
          is_ad?: boolean
          published_at?: string
          view_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "contents_influencer_id_fkey"
            columns: ["influencer_id"]
            isOneToOne: false
            referencedRelation: "influencer_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contents_influencer_id_fkey"
            columns: ["influencer_id"]
            isOneToOne: false
            referencedRelation: "influencers"
            referencedColumns: ["id"]
          },
        ]
      }
      influencers: {
        Row: {
          age_1317_pct: number | null
          age_1824_pct: number | null
          age_2534_pct: number | null
          age_3544_pct: number | null
          category_tag_main: string | null
          category_tag_sub: string | null
          created_at: string
          created_by: string | null
          data: Json | null
          display_name: string | null
          featuring_error: string | null
          follower_count: number | null
          gender_female_pct: number | null
          gender_male_pct: number | null
          handle: string
          id: string
          language_kr_pct: number | null
          platform: Database["public"]["Enums"]["platform"]
          platform_error: string | null
          updated_at: string | null
        }
        Insert: {
          age_1317_pct?: number | null
          age_1824_pct?: number | null
          age_2534_pct?: number | null
          age_3544_pct?: number | null
          category_tag_main?: string | null
          category_tag_sub?: string | null
          created_at?: string
          created_by?: string | null
          data?: Json | null
          display_name?: string | null
          featuring_error?: string | null
          follower_count?: number | null
          gender_female_pct?: number | null
          gender_male_pct?: number | null
          handle: string
          id?: string
          language_kr_pct?: number | null
          platform: Database["public"]["Enums"]["platform"]
          platform_error?: string | null
          updated_at?: string | null
        }
        Update: {
          age_1317_pct?: number | null
          age_1824_pct?: number | null
          age_2534_pct?: number | null
          age_3544_pct?: number | null
          category_tag_main?: string | null
          category_tag_sub?: string | null
          created_at?: string
          created_by?: string | null
          data?: Json | null
          display_name?: string | null
          featuring_error?: string | null
          follower_count?: number | null
          gender_female_pct?: number | null
          gender_male_pct?: number | null
          handle?: string
          id?: string
          language_kr_pct?: number | null
          platform?: Database["public"]["Enums"]["platform"]
          platform_error?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      proposals: {
        Row: {
          created_at: string
          created_by: string
          id: string
          influencer_id: string
          request_code: string
          strength_tags: string[]
          why_this_influencer: string
        }
        Insert: {
          created_at?: string
          created_by?: string
          id?: string
          influencer_id?: string
          request_code: string
          strength_tags: string[]
          why_this_influencer: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          influencer_id?: string
          request_code?: string
          strength_tags?: string[]
          why_this_influencer?: string
        }
        Relationships: [
          {
            foreignKeyName: "proposals_influencer_id_fkey1"
            columns: ["influencer_id"]
            isOneToOne: false
            referencedRelation: "influencer_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proposals_influencer_id_fkey1"
            columns: ["influencer_id"]
            isOneToOne: false
            referencedRelation: "influencers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proposals_request_code_fkey1"
            columns: ["request_code"]
            isOneToOne: false
            referencedRelation: "request_codes"
            referencedColumns: ["id"]
          },
        ]
      }
      request_codes: {
        Row: {
          created_at: string
          id: string
        }
        Insert: {
          created_at?: string
          id: string
        }
        Update: {
          created_at?: string
          id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          app_role: Database["public"]["Enums"]["app_role"]
          created_at: string
          email: string | null
          id: string
          user_id: string
        }
        Insert: {
          app_role: Database["public"]["Enums"]["app_role"]
          created_at?: string
          email?: string | null
          id?: string
          user_id: string
        }
        Update: {
          app_role?: Database["public"]["Enums"]["app_role"]
          created_at?: string
          email?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      daily_count_view: {
        Row: {
          date: string | null
          error_count: number | null
          instagram_count: number | null
          total_count: number | null
          verified_미정산_count: number | null
          verified_정산_count: number | null
          youtube_count: number | null
        }
        Relationships: []
      }
      influencer_view: {
        Row: {
          age_1317_pct: number | null
          age_1824_pct: number | null
          age_2534_pct: number | null
          age_3544_pct: number | null
          can_settle: boolean | null
          category_tag_main: string | null
          category_tag_sub: string | null
          clean_url: string | null
          created_at: string | null
          created_by: string | null
          created_by_email: string | null
          display_name: string | null
          follower_count: string | null
          frr: number | null
          frr_ad: number | null
          gender_female_pct: number | null
          gender_male_pct: number | null
          handle: string | null
          id: string | null
          is_admin: boolean | null
          language_kr_pct: number | null
          platform: Database["public"]["Enums"]["platform"] | null
          recent_lift_ratio: number | null
          request_codes: string[] | null
          strength_tags: string[] | null
          tier: Database["public"]["Enums"]["tier"] | null
          views_ad_avg: string | null
          views_ad_avg_sample_size: number | null
          views_mid_15_avg: string | null
          views_mid_15_avg_sample_size: number | null
          views_short_6_avg: string | null
          views_short_6_avg_sample_size: number | null
          why_this_influencers: string[] | null
        }
        Relationships: []
      }
      statistics: {
        Row: {
          category_counts: Json | null
          celeb_count: number | null
          error_count: number | null
          ig_count: number | null
          in_progress_count: number | null
          macro_count: number | null
          mega_count: number | null
          micro_count: number | null
          nano_count: number | null
          new_count: number | null
          total_count: number | null
          verified_count: number | null
          yt_count: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      can_settle: {
        Args: { i: Database["public"]["Tables"]["influencers"]["Row"] }
        Returns: boolean
      }
      custom_access_token_hook: { Args: { event: Json }; Returns: Json }
      get_influencer_frr: {
        Args: {
          p_influencer: Database["public"]["Tables"]["influencers"]["Row"]
        }
        Returns: number
      }
      get_influencer_status: {
        Args: { i: Database["public"]["Tables"]["influencers"]["Row"] }
        Returns: Database["public"]["Enums"]["influencer_status"]
      }
      get_tier: {
        Args: { i: Database["public"]["Tables"]["influencers"]["Row"] }
        Returns: Database["public"]["Enums"]["tier"]
      }
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "arbeit"
      influencer_status: "new" | "in_progress" | "error" | "verified"
      platform: "youtube" | "instagram"
      tier: "Celeb" | "Mega" | "Macro" | "Micro" | "Mano" | "N/A"
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
      app_role: ["admin", "arbeit"],
      influencer_status: ["new", "in_progress", "error", "verified"],
      platform: ["youtube", "instagram"],
      tier: ["Celeb", "Mega", "Macro", "Micro", "Mano", "N/A"],
    },
  },
} as const
