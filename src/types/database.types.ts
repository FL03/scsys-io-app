export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      organizations: {
        Row: {
          description: string | null
          id: string
          logo: string | null
          members: string[] | null
          metadata: Json | null
          name: string
          owners: string[] | null
          tags: string[] | null
          website: string | null
        }
        Insert: {
          description?: string | null
          id?: string
          logo?: string | null
          members?: string[] | null
          metadata?: Json | null
          name: string
          owners?: string[] | null
          tags?: string[] | null
          website?: string | null
        }
        Update: {
          description?: string | null
          id?: string
          logo?: string | null
          members?: string[] | null
          metadata?: Json | null
          name?: string
          owners?: string[] | null
          tags?: string[] | null
          website?: string | null
        }
        Relationships: []
      }
      pay_periods: {
        Row: {
          ends_at: string | null
          id: string
          metadata: Json | null
          organization_id: string | null
          start_at: string | null
          status: string
          title: string | null
        }
        Insert: {
          ends_at?: string | null
          id?: string
          metadata?: Json | null
          organization_id?: string | null
          start_at?: string | null
          status?: string
          title?: string | null
        }
        Update: {
          ends_at?: string | null
          id?: string
          metadata?: Json | null
          organization_id?: string | null
          start_at?: string | null
          status?: string
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pay_periods_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      pricing: {
        Row: {
          currency: string
          description: string | null
          id: string
          interval: string | null
          metadata: Json | null
          price: number | null
          title: string
          trial_period: number | null
        }
        Insert: {
          currency?: string
          description?: string | null
          id?: string
          interval?: string | null
          metadata?: Json | null
          price?: number | null
          title: string
          trial_period?: number | null
        }
        Update: {
          currency?: string
          description?: string | null
          id?: string
          interval?: string | null
          metadata?: Json | null
          price?: number | null
          title?: string
          trial_period?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          customer_id: string | null
          department: string | null
          display_name: string | null
          email: string[] | null
          first_name: string | null
          id: string
          last_name: string | null
          metadata: Json | null
          middle_name: string | null
          name_prefix: string | null
          name_suffix: string | null
          phone: string[] | null
          role: string | null
          socials: string[] | null
          status: string | null
          titles: string[] | null
          updated_at: string | null
          username: string
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          customer_id?: string | null
          department?: string | null
          display_name?: string | null
          email?: string[] | null
          first_name?: string | null
          id: string
          last_name?: string | null
          metadata?: Json | null
          middle_name?: string | null
          name_prefix?: string | null
          name_suffix?: string | null
          phone?: string[] | null
          role?: string | null
          socials?: string[] | null
          status?: string | null
          titles?: string[] | null
          updated_at?: string | null
          username: string
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          customer_id?: string | null
          department?: string | null
          display_name?: string | null
          email?: string[] | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          metadata?: Json | null
          middle_name?: string | null
          name_prefix?: string | null
          name_suffix?: string | null
          phone?: string[] | null
          role?: string | null
          socials?: string[] | null
          status?: string | null
          titles?: string[] | null
          updated_at?: string | null
          username?: string
          website?: string | null
        }
        Relationships: []
      }
      shifts: {
        Row: {
          assignee: string | null
          attachments: string[] | null
          clocked_in: string | null
          clocked_out: string | null
          created_at: string | null
          created_by: string | null
          date: string
          ends_at: string | null
          id: string
          metadata: Json | null
          organization_id: string | null
          pay_period: string | null
          start_at: string | null
          status: string
          tags: string[] | null
          tips_cash: number
          tips_credit: number
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          assignee?: string | null
          attachments?: string[] | null
          clocked_in?: string | null
          clocked_out?: string | null
          created_at?: string | null
          created_by?: string | null
          date: string
          ends_at?: string | null
          id?: string
          metadata?: Json | null
          organization_id?: string | null
          pay_period?: string | null
          start_at?: string | null
          status?: string
          tags?: string[] | null
          tips_cash?: number
          tips_credit?: number
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          assignee?: string | null
          attachments?: string[] | null
          clocked_in?: string | null
          clocked_out?: string | null
          created_at?: string | null
          created_by?: string | null
          date?: string
          ends_at?: string | null
          id?: string
          metadata?: Json | null
          organization_id?: string | null
          pay_period?: string | null
          start_at?: string | null
          status?: string
          tags?: string[] | null
          tips_cash?: number
          tips_credit?: number
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shifts_assignee_fkey"
            columns: ["assignee"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shifts_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shifts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shifts_pay_period_fkey"
            columns: ["pay_period"]
            isOneToOne: false
            referencedRelation: "pay_periods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shifts_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          assignees: string[] | null
          attachments: string[] | null
          completed: boolean
          created_at: string | null
          created_by: string | null
          date: string | null
          description: string | null
          due_date: string | null
          id: string
          metadata: Json | null
          name: string
          priority: number
          status: string
          subtasks: string[] | null
          tags: string[] | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          assignees?: string[] | null
          attachments?: string[] | null
          completed?: boolean
          created_at?: string | null
          created_by?: string | null
          date?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          metadata?: Json | null
          name?: string
          priority?: number
          status?: string
          subtasks?: string[] | null
          tags?: string[] | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          assignees?: string[] | null
          attachments?: string[] | null
          completed?: boolean
          created_at?: string | null
          created_by?: string | null
          date?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          metadata?: Json | null
          name?: string
          priority?: number
          status?: string
          subtasks?: string[] | null
          tags?: string[] | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
