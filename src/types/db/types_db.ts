/*
  Appellation: database <types>
  Contrib: @FL03
*/
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
          categories: string[] | null;
          created_at: string;
          created_by: string;
          description: string | null;
          id: string;
          image: string | null;
          ingredients: string[] | null;
          name: string;
          price: number;
          tags: string[] | null;
          updated_at: string;
          updated_by: string;
        };
        Insert: {
          categories?: string[] | null;
          created_at?: string;
          created_by: string;
          description?: string | null;
          id?: string;
          image?: string | null;
          ingredients?: string[] | null;
          name?: string;
          price?: number;
          tags?: string[] | null;
          updated_at?: string;
          updated_by: string;
        };
        Update: {
          categories?: string[] | null;
          created_at?: string;
          created_by?: string;
          description?: string | null;
          id?: string;
          image?: string | null;
          ingredients?: string[] | null;
          name?: string;
          price?: number;
          tags?: string[] | null;
          updated_at?: string;
          updated_by?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          avatar: string | null;
          bio: string | null;
          created_at: string;
          department: string | null;
          display_name: string | null;
          email: string | null;
          first_name: string;
          id: string;
          last_name: string | null;
          metadata: Json | null;
          middle_name: string | null;
          name_prefix: string | null;
          name_suffix: string | null;
          phone: string | null;
          role: string;
          socials: Json | null;
          titles: string[] | null;
          uid: string;
          updated_at: string;
          username: string;
        };
        Insert: {
          avatar?: string | null;
          bio?: string | null;
          created_at?: string;
          department?: string | null;
          display_name?: string | null;
          email?: string | null;
          first_name: string;
          id?: string;
          last_name?: string | null;
          metadata?: Json | null;
          middle_name?: string | null;
          name_prefix?: string | null;
          name_suffix?: string | null;
          phone?: string | null;
          role?: string;
          socials?: Json | null;
          titles?: string[] | null;
          uid?: string;
          updated_at?: string;
          username: string;
        };
        Update: {
          avatar?: string | null;
          bio?: string | null;
          created_at?: string;
          department?: string | null;
          display_name?: string | null;
          email?: string | null;
          first_name?: string;
          id?: string;
          last_name?: string | null;
          metadata?: Json | null;
          middle_name?: string | null;
          name_prefix?: string | null;
          name_suffix?: string | null;
          phone?: string | null;
          role?: string;
          socials?: Json | null;
          titles?: string[] | null;
          uid?: string;
          updated_at?: string;
          username?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
        PublicSchema['Views'])
    ? (PublicSchema['Tables'] &
        PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema['CompositeTypes']
    ? PublicSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;