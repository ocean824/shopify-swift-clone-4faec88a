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
      admin_accounts: {
        Row: {
          created_at: string | null
          email: string
          id: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
        }
        Relationships: []
      }
      code_redemptions: {
        Row: {
          code_id: string | null
          id: string
          is_revoked: boolean | null
          purchase_verified: boolean | null
          redeemed_at: string | null
          revoked_at: string | null
          revoked_reason: string | null
          user_email: string
        }
        Insert: {
          code_id?: string | null
          id?: string
          is_revoked?: boolean | null
          purchase_verified?: boolean | null
          redeemed_at?: string | null
          revoked_at?: string | null
          revoked_reason?: string | null
          user_email: string
        }
        Update: {
          code_id?: string | null
          id?: string
          is_revoked?: boolean | null
          purchase_verified?: boolean | null
          redeemed_at?: string | null
          revoked_at?: string | null
          revoked_reason?: string | null
          user_email?: string
        }
        Relationships: [
          {
            foreignKeyName: "code_redemptions_code_id_fkey"
            columns: ["code_id"]
            isOneToOne: false
            referencedRelation: "discount_codes"
            referencedColumns: ["id"]
          },
        ]
      }
      discount_codes: {
        Row: {
          applies_to: string | null
          code: string
          created_at: string | null
          created_by: string | null
          current_uses: number | null
          description: string | null
          discount_type: string
          discount_value: number | null
          grants_pantheon_lifetime: boolean | null
          id: string
          is_active: boolean | null
          max_uses: number | null
          specific_products: string[] | null
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          applies_to?: string | null
          code: string
          created_at?: string | null
          created_by?: string | null
          current_uses?: number | null
          description?: string | null
          discount_type?: string
          discount_value?: number | null
          grants_pantheon_lifetime?: boolean | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          specific_products?: string[] | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          applies_to?: string | null
          code?: string
          created_at?: string | null
          created_by?: string | null
          current_uses?: number | null
          description?: string | null
          discount_type?: string
          discount_value?: number | null
          grants_pantheon_lifetime?: boolean | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          specific_products?: string[] | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: []
      }
      email_send_log: {
        Row: {
          clicked_at: string | null
          email_to: string
          email_type: string
          id: string
          opened_at: string | null
          resend_id: string | null
          sent_at: string
          sequence_name: string | null
          status: string | null
          subject: string
          subscriber_id: string | null
        }
        Insert: {
          clicked_at?: string | null
          email_to: string
          email_type: string
          id?: string
          opened_at?: string | null
          resend_id?: string | null
          sent_at?: string
          sequence_name?: string | null
          status?: string | null
          subject: string
          subscriber_id?: string | null
        }
        Update: {
          clicked_at?: string | null
          email_to?: string
          email_type?: string
          id?: string
          opened_at?: string | null
          resend_id?: string | null
          sent_at?: string
          sequence_name?: string | null
          status?: string | null
          subject?: string
          subscriber_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_send_log_subscriber_id_fkey"
            columns: ["subscriber_id"]
            isOneToOne: false
            referencedRelation: "email_subscribers"
            referencedColumns: ["id"]
          },
        ]
      }
      email_sequence_progress: {
        Row: {
          completed_at: string | null
          created_at: string
          current_step: number | null
          id: string
          is_active: boolean | null
          last_email_sent_at: string | null
          next_email_scheduled_at: string | null
          sequence_name: string
          started_at: string
          subscriber_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          current_step?: number | null
          id?: string
          is_active?: boolean | null
          last_email_sent_at?: string | null
          next_email_scheduled_at?: string | null
          sequence_name: string
          started_at?: string
          subscriber_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          current_step?: number | null
          id?: string
          is_active?: boolean | null
          last_email_sent_at?: string | null
          next_email_scheduled_at?: string | null
          sequence_name?: string
          started_at?: string
          subscriber_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_sequence_progress_subscriber_id_fkey"
            columns: ["subscriber_id"]
            isOneToOne: false
            referencedRelation: "email_subscribers"
            referencedColumns: ["id"]
          },
        ]
      }
      email_subscribers: {
        Row: {
          created_at: string
          email: string
          first_name: string | null
          id: string
          is_active: boolean | null
          last_name: string | null
          last_order_at: string | null
          segment: string
          shopify_customer_id: string | null
          subscribed_at: string
          tags: string[] | null
          total_orders: number | null
          total_spent: number | null
          unsubscribed_at: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          first_name?: string | null
          id?: string
          is_active?: boolean | null
          last_name?: string | null
          last_order_at?: string | null
          segment?: string
          shopify_customer_id?: string | null
          subscribed_at?: string
          tags?: string[] | null
          total_orders?: number | null
          total_spent?: number | null
          unsubscribed_at?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          is_active?: boolean | null
          last_name?: string | null
          last_order_at?: string | null
          segment?: string
          shopify_customer_id?: string | null
          subscribed_at?: string
          tags?: string[] | null
          total_orders?: number | null
          total_spent?: number | null
          unsubscribed_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      email_templates: {
        Row: {
          created_at: string
          delay_hours: number | null
          email_type: string
          html_content: string
          id: string
          is_active: boolean | null
          name: string
          sequence_name: string
          step_number: number
          subject: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          delay_hours?: number | null
          email_type: string
          html_content: string
          id?: string
          is_active?: boolean | null
          name: string
          sequence_name: string
          step_number: number
          subject: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          delay_hours?: number | null
          email_type?: string
          html_content?: string
          id?: string
          is_active?: boolean | null
          name?: string
          sequence_name?: string
          step_number?: number
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
      lifetime_access_codes: {
        Row: {
          code_used: string
          email: string
          granted_at: string | null
          granted_by: string | null
          id: string
          is_revoked: boolean | null
          notes: string | null
          purchase_verified: boolean | null
          revoked_at: string | null
          revoked_reason: string | null
        }
        Insert: {
          code_used: string
          email: string
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          is_revoked?: boolean | null
          notes?: string | null
          purchase_verified?: boolean | null
          revoked_at?: string | null
          revoked_reason?: string | null
        }
        Update: {
          code_used?: string
          email?: string
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          is_revoked?: boolean | null
          notes?: string | null
          purchase_verified?: boolean | null
          revoked_at?: string | null
          revoked_reason?: string | null
        }
        Relationships: []
      }
      pantheon_content: {
        Row: {
          created_at: string | null
          description: string | null
          external_url: string | null
          file_path: string
          id: string
          is_active: boolean | null
          title: string
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          external_url?: string | null
          file_path: string
          id?: string
          is_active?: boolean | null
          title: string
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          external_url?: string | null
          file_path?: string
          id?: string
          is_active?: boolean | null
          title?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      purchases: {
        Row: {
          amount: number
          created_at: string
          currency: string
          email: string
          id: string
          product_id: string | null
          product_name: string
          purchase_date: string
          stripe_session_id: string | null
          user_id: string | null
        }
        Insert: {
          amount?: number
          created_at?: string
          currency?: string
          email: string
          id?: string
          product_id?: string | null
          product_name: string
          purchase_date?: string
          stripe_session_id?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          email?: string
          id?: string
          product_id?: string | null
          product_name?: string
          purchase_date?: string
          stripe_session_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      shopify_webhook_log: {
        Row: {
          created_at: string
          event_type: string
          id: string
          payload: Json | null
          processed: boolean | null
          processed_at: string | null
          shopify_id: string | null
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          payload?: Json | null
          processed?: boolean | null
          processed_at?: string | null
          shopify_id?: string | null
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          payload?: Json | null
          processed?: boolean | null
          processed_at?: string | null
          shopify_id?: string | null
        }
        Relationships: []
      }
      vip_accounts: {
        Row: {
          created_at: string
          email: string
          has_all_products: boolean
          has_lifetime_pantheon: boolean
          id: string
          notes: string | null
        }
        Insert: {
          created_at?: string
          email: string
          has_all_products?: boolean
          has_lifetime_pantheon?: boolean
          id?: string
          notes?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          has_all_products?: boolean
          has_lifetime_pantheon?: boolean
          id?: string
          notes?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: { user_email: string }; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
