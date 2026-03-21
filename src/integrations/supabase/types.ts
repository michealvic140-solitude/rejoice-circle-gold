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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      announcements: {
        Row: {
          admin_name: string | null
          body: string
          created_at: string | null
          id: string
          image_url: string | null
          target_group_id: string | null
          title: string
          type: string | null
        }
        Insert: {
          admin_name?: string | null
          body: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          target_group_id?: string | null
          title: string
          type?: string | null
        }
        Update: {
          admin_name?: string | null
          body?: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          target_group_id?: string | null
          title?: string
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "announcements_target_group_id_fkey"
            columns: ["target_group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          id: string
          performed_by: string | null
          performed_by_username: string | null
          target_user_id: string | null
          target_username: string | null
          type: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          performed_by?: string | null
          performed_by_username?: string | null
          target_user_id?: string | null
          target_username?: string | null
          type?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          performed_by?: string | null
          performed_by_username?: string | null
          target_user_id?: string | null
          target_username?: string | null
          type?: string | null
        }
        Relationships: []
      }
      contact_info: {
        Row: {
          call_number: string | null
          email: string | null
          facebook: string | null
          id: number
          sms_number: string | null
          updated_at: string | null
          whatsapp: string | null
        }
        Insert: {
          call_number?: string | null
          email?: string | null
          facebook?: string | null
          id?: number
          sms_number?: string | null
          updated_at?: string | null
          whatsapp?: string | null
        }
        Update: {
          call_number?: string | null
          email?: string | null
          facebook?: string | null
          id?: number
          sms_number?: string | null
          updated_at?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      exit_requests: {
        Row: {
          created_at: string | null
          group_id: string
          group_name: string | null
          id: string
          reason: string | null
          status: string | null
          user_id: string
          username: string | null
        }
        Insert: {
          created_at?: string | null
          group_id: string
          group_name?: string | null
          id?: string
          reason?: string | null
          status?: string | null
          user_id: string
          username?: string | null
        }
        Update: {
          created_at?: string | null
          group_id?: string
          group_name?: string | null
          id?: string
          reason?: string | null
          status?: string | null
          user_id?: string
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exit_requests_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      forgot_password_requests: {
        Row: {
          admin_note: string | null
          created_at: string | null
          id: string
          identifier: string
          status: string | null
        }
        Insert: {
          admin_note?: string | null
          created_at?: string | null
          id?: string
          identifier: string
          status?: string | null
        }
        Update: {
          admin_note?: string | null
          created_at?: string | null
          id?: string
          identifier?: string
          status?: string | null
        }
        Relationships: []
      }
      group_messages: {
        Row: {
          created_at: string | null
          group_id: string
          id: string
          is_system: boolean | null
          message: string
          user_id: string
          username: string
        }
        Insert: {
          created_at?: string | null
          group_id: string
          id?: string
          is_system?: boolean | null
          message: string
          user_id: string
          username: string
        }
        Update: {
          created_at?: string | null
          group_id?: string
          id?: string
          is_system?: boolean | null
          message?: string
          user_id?: string
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_messages_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      groups: {
        Row: {
          account_name: string | null
          account_number: string | null
          bank_name: string | null
          chat_locked: boolean | null
          contribution_amount: number
          created_at: string | null
          created_by: string | null
          cycle_type: string
          description: string | null
          filled_slots: number | null
          id: string
          is_live: boolean | null
          is_locked: boolean | null
          name: string
          terms_text: string | null
          total_slots: number | null
        }
        Insert: {
          account_name?: string | null
          account_number?: string | null
          bank_name?: string | null
          chat_locked?: boolean | null
          contribution_amount: number
          created_at?: string | null
          created_by?: string | null
          cycle_type: string
          description?: string | null
          filled_slots?: number | null
          id?: string
          is_live?: boolean | null
          is_locked?: boolean | null
          name: string
          terms_text?: string | null
          total_slots?: number | null
        }
        Update: {
          account_name?: string | null
          account_number?: string | null
          bank_name?: string | null
          chat_locked?: boolean | null
          contribution_amount?: number
          created_at?: string | null
          created_by?: string | null
          cycle_type?: string
          description?: string | null
          filled_slots?: number | null
          id?: string
          is_live?: boolean | null
          is_locked?: boolean | null
          name?: string
          terms_text?: string | null
          total_slots?: number | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string
          read: boolean | null
          type: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          read?: boolean | null
          type?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          read?: boolean | null
          type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      payout_queue: {
        Row: {
          amount: number
          created_at: string | null
          disbursed_at: string | null
          group_id: string
          id: string
          seat_number: number
          status: string | null
          user_id: string
          username: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          disbursed_at?: string | null
          group_id: string
          id?: string
          seat_number: number
          status?: string | null
          user_id: string
          username?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          disbursed_at?: string | null
          group_id?: string
          id?: string
          seat_number?: number
          status?: string | null
          user_id?: string
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payout_queue_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_settings: {
        Row: {
          id: number
          maintenance_message: string | null
          maintenance_mode: boolean | null
          updated_at: string | null
        }
        Insert: {
          id?: number
          maintenance_message?: string | null
          maintenance_mode?: boolean | null
          updated_at?: string | null
        }
        Update: {
          id?: number
          maintenance_message?: string | null
          maintenance_mode?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age: number | null
          bank_acc_name: string | null
          bank_acc_number: string | null
          bank_name: string | null
          bvn_nin: string | null
          created_at: string | null
          current_address: string | null
          current_state: string | null
          dob: string | null
          email: string | null
          first_name: string
          home_address: string | null
          id: string
          is_banned: boolean | null
          is_defaulter: boolean | null
          is_frozen: boolean | null
          is_restricted: boolean | null
          is_vip: boolean | null
          last_name: string
          lga: string | null
          middle_name: string | null
          nickname: string | null
          phone: string | null
          profile_picture: string | null
          state_of_origin: string | null
          total_paid: number | null
          trust_score: number | null
          updated_at: string | null
          username: string
        }
        Insert: {
          age?: number | null
          bank_acc_name?: string | null
          bank_acc_number?: string | null
          bank_name?: string | null
          bvn_nin?: string | null
          created_at?: string | null
          current_address?: string | null
          current_state?: string | null
          dob?: string | null
          email?: string | null
          first_name?: string
          home_address?: string | null
          id: string
          is_banned?: boolean | null
          is_defaulter?: boolean | null
          is_frozen?: boolean | null
          is_restricted?: boolean | null
          is_vip?: boolean | null
          last_name?: string
          lga?: string | null
          middle_name?: string | null
          nickname?: string | null
          phone?: string | null
          profile_picture?: string | null
          state_of_origin?: string | null
          total_paid?: number | null
          trust_score?: number | null
          updated_at?: string | null
          username: string
        }
        Update: {
          age?: number | null
          bank_acc_name?: string | null
          bank_acc_number?: string | null
          bank_name?: string | null
          bvn_nin?: string | null
          created_at?: string | null
          current_address?: string | null
          current_state?: string | null
          dob?: string | null
          email?: string | null
          first_name?: string
          home_address?: string | null
          id?: string
          is_banned?: boolean | null
          is_defaulter?: boolean | null
          is_frozen?: boolean | null
          is_restricted?: boolean | null
          is_vip?: boolean | null
          last_name?: string
          lga?: string | null
          middle_name?: string | null
          nickname?: string | null
          phone?: string | null
          profile_picture?: string | null
          state_of_origin?: string | null
          total_paid?: number | null
          trust_score?: number | null
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
      seat_change_requests: {
        Row: {
          created_at: string | null
          from_seat: number
          group_id: string
          group_name: string | null
          id: string
          reason: string | null
          status: string | null
          to_seat: number
          user_id: string
          username: string | null
        }
        Insert: {
          created_at?: string | null
          from_seat: number
          group_id: string
          group_name?: string | null
          id?: string
          reason?: string | null
          status?: string | null
          to_seat: number
          user_id: string
          username?: string | null
        }
        Update: {
          created_at?: string | null
          from_seat?: number
          group_id?: string
          group_name?: string | null
          id?: string
          reason?: string | null
          status?: string | null
          to_seat?: number
          user_id?: string
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "seat_change_requests_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      slots: {
        Row: {
          disbursed_at: string | null
          full_name: string | null
          group_id: string
          id: string
          is_disbursed: boolean | null
          locked_until: string | null
          payment_status: string | null
          payment_time: string | null
          seat_number: number
          status: string
          user_id: string | null
          username: string | null
        }
        Insert: {
          disbursed_at?: string | null
          full_name?: string | null
          group_id: string
          id?: string
          is_disbursed?: boolean | null
          locked_until?: string | null
          payment_status?: string | null
          payment_time?: string | null
          seat_number: number
          status?: string
          user_id?: string | null
          username?: string | null
        }
        Update: {
          disbursed_at?: string | null
          full_name?: string | null
          group_id?: string
          id?: string
          is_disbursed?: boolean | null
          locked_until?: string | null
          payment_status?: string | null
          payment_time?: string | null
          seat_number?: number
          status?: string
          user_id?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "slots_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          admin_reply: string | null
          attachment_url: string | null
          created_at: string | null
          id: string
          message: string
          replied_at: string | null
          status: string | null
          subject: string
          user_id: string
          username: string | null
        }
        Insert: {
          admin_reply?: string | null
          attachment_url?: string | null
          created_at?: string | null
          id?: string
          message: string
          replied_at?: string | null
          status?: string | null
          subject: string
          user_id: string
          username?: string | null
        }
        Update: {
          admin_reply?: string | null
          attachment_url?: string | null
          created_at?: string | null
          id?: string
          message?: string
          replied_at?: string | null
          status?: string | null
          subject?: string
          user_id?: string
          username?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          admin_note: string | null
          amount: number
          code: string
          created_at: string | null
          group_id: string | null
          group_name: string | null
          id: string
          screenshot_url: string | null
          seat_number: number | null
          status: string | null
          updated_at: string | null
          user_id: string
          username: string | null
        }
        Insert: {
          admin_note?: string | null
          amount: number
          code: string
          created_at?: string | null
          group_id?: string | null
          group_name?: string | null
          id?: string
          screenshot_url?: string | null
          seat_number?: number | null
          status?: string | null
          updated_at?: string | null
          user_id: string
          username?: string | null
        }
        Update: {
          admin_note?: string | null
          amount?: number
          code?: string
          created_at?: string | null
          group_id?: string | null
          group_name?: string | null
          id?: string
          screenshot_url?: string | null
          seat_number?: number | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: { Args: { _user_id: string }; Returns: string }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
