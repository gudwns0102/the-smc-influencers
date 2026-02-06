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
          proposal_data: Json | null
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
          proposal_data?: Json | null
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
          proposal_data?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      influencer_view: {
        Row: {
          account_id: string | null
          age_1317_pct: number | null
          age_1824_pct: number | null
          age_2534_pct: number | null
          age_3544_pct: number | null
          category_tag_main: string | null
          category_tag_sub: string | null
          clean_url: string | null
          content_download_at: string | null
          created_at: string | null
          created_by: string | null
          display_name: string | null
          follower_count: number | null
          frr_ad: number | null
          frr_mid: number | null
          frr_short: number | null
          gender_female_pct: number | null
          gender_male_pct: number | null
          handle: string | null
          id: string | null
          language_kr_pct: number | null
          platform: Database["public"]["Enums"]["platform"] | null
          platform_error: string | null
          views_ad_avg: number | null
          views_ad_avg_sample_size: number | null
          views_mid_15_avg: number | null
          views_mid_15_avg_sample_size: number | null
          views_short_6_avg: number | null
          views_short_6_avg_sample_size: number | null
        }
        Insert: {
          account_id?: never
          age_1317_pct?: number | null
          age_1824_pct?: number | null
          age_2534_pct?: number | null
          age_3544_pct?: number | null
          category_tag_main?: string | null
          category_tag_sub?: string | null
          clean_url?: never
          content_download_at?: never
          created_at?: string | null
          created_by?: string | null
          display_name?: string | null
          follower_count?: number | null
          frr_ad?: never
          frr_mid?: never
          frr_short?: never
          gender_female_pct?: number | null
          gender_male_pct?: number | null
          handle?: string | null
          id?: string | null
          language_kr_pct?: number | null
          platform?: Database["public"]["Enums"]["platform"] | null
          platform_error?: string | null
          views_ad_avg?: never
          views_ad_avg_sample_size?: never
          views_mid_15_avg?: never
          views_mid_15_avg_sample_size?: never
          views_short_6_avg?: never
          views_short_6_avg_sample_size?: never
        }
        Update: {
          account_id?: never
          age_1317_pct?: number | null
          age_1824_pct?: number | null
          age_2534_pct?: number | null
          age_3544_pct?: number | null
          category_tag_main?: string | null
          category_tag_sub?: string | null
          clean_url?: never
          content_download_at?: never
          created_at?: string | null
          created_by?: string | null
          display_name?: string | null
          follower_count?: number | null
          frr_ad?: never
          frr_mid?: never
          frr_short?: never
          gender_female_pct?: number | null
          gender_male_pct?: number | null
          handle?: string | null
          id?: string | null
          language_kr_pct?: number | null
          platform?: Database["public"]["Enums"]["platform"] | null
          platform_error?: string | null
          views_ad_avg?: never
          views_ad_avg_sample_size?: never
          views_mid_15_avg?: never
          views_mid_15_avg_sample_size?: never
          views_short_6_avg?: never
          views_short_6_avg_sample_size?: never
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      platform: "youtube" | "instagram"
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
      platform: ["youtube", "instagram"],
    },
  },
} as const
