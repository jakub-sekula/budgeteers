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
      accounts: {
        Row: {
          created_at: string
          id: string
          name: string
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      attachments: {
        Row: {
          created_at: string
          id: string
          metadata: Json
          path: string
          transaction_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          metadata: Json
          path: string
          transaction_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          metadata?: Json
          path?: string
          transaction_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "attachments_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attachments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      budget_period_categories: {
        Row: {
          amount: number
          budget_period_id: string | null
          category_type_id: string | null
          id: string
          type: Database["public"]["Enums"]["transaction_types"] | null
        }
        Insert: {
          amount?: number
          budget_period_id?: string | null
          category_type_id?: string | null
          id?: string
          type?: Database["public"]["Enums"]["transaction_types"] | null
        }
        Update: {
          amount?: number
          budget_period_id?: string | null
          category_type_id?: string | null
          id?: string
          type?: Database["public"]["Enums"]["transaction_types"] | null
        }
        Relationships: [
          {
            foreignKeyName: "budget_categories_budget_entry_id_fkey"
            columns: ["budget_period_id"]
            isOneToOne: false
            referencedRelation: "budget_periods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "budget_period_categories_category_type_id_fkey"
            columns: ["category_type_id"]
            isOneToOne: false
            referencedRelation: "category_types"
            referencedColumns: ["id"]
          },
        ]
      }
      budget_periods: {
        Row: {
          budget_id: string
          description: string | null
          ends_on: string
          id: string
          is_current: boolean
          name: string
          starts_on: string
        }
        Insert: {
          budget_id: string
          description?: string | null
          ends_on: string
          id?: string
          is_current?: boolean
          name: string
          starts_on?: string
        }
        Update: {
          budget_id?: string
          description?: string | null
          ends_on?: string
          id?: string
          is_current?: boolean
          name?: string
          starts_on?: string
        }
        Relationships: [
          {
            foreignKeyName: "budget_entries_budget_id_fkey"
            columns: ["budget_id"]
            isOneToOne: false
            referencedRelation: "budgets"
            referencedColumns: ["id"]
          },
        ]
      }
      budgets: {
        Row: {
          color: string | null
          created_at: string
          created_by: string
          default_payday: number | null
          description: string | null
          frequency: string | null
          icon: string | null
          id: string
          name: string
          shared: boolean | null
        }
        Insert: {
          color?: string | null
          created_at?: string
          created_by?: string
          default_payday?: number | null
          description?: string | null
          frequency?: string | null
          icon?: string | null
          id?: string
          name: string
          shared?: boolean | null
        }
        Update: {
          color?: string | null
          created_at?: string
          created_by?: string
          default_payday?: number | null
          description?: string | null
          frequency?: string | null
          icon?: string | null
          id?: string
          name?: string
          shared?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "budgets_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      budgets_category_types: {
        Row: {
          budget_id: string
          category_type_id: string
        }
        Insert: {
          budget_id: string
          category_type_id: string
        }
        Update: {
          budget_id?: string
          category_type_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "budgets_category_types_budget_id_fkey"
            columns: ["budget_id"]
            isOneToOne: false
            referencedRelation: "budgets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "budgets_category_types_category_type_id_fkey"
            columns: ["category_type_id"]
            isOneToOne: false
            referencedRelation: "category_types"
            referencedColumns: ["id"]
          },
        ]
      }
      budgets_users: {
        Row: {
          budget_id: string
          user_id: string
        }
        Insert: {
          budget_id: string
          user_id: string
        }
        Update: {
          budget_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "budgets_users_budget_id_fkey"
            columns: ["budget_id"]
            isOneToOne: false
            referencedRelation: "budgets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "budgets_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          category_type_id: string | null
          color: string
          default: boolean | null
          hidden: boolean
          icon: string | null
          id: string
          name: string
          transaction_type:
            | Database["public"]["Enums"]["transaction_types"]
            | null
          user_id: string | null
        }
        Insert: {
          category_type_id?: string | null
          color?: string
          default?: boolean | null
          hidden?: boolean
          icon?: string | null
          id?: string
          name: string
          transaction_type?:
            | Database["public"]["Enums"]["transaction_types"]
            | null
          user_id?: string | null
        }
        Update: {
          category_type_id?: string | null
          color?: string
          default?: boolean | null
          hidden?: boolean
          icon?: string | null
          id?: string
          name?: string
          transaction_type?:
            | Database["public"]["Enums"]["transaction_types"]
            | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_category_type_id_fkey"
            columns: ["category_type_id"]
            isOneToOne: false
            referencedRelation: "category_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Categories_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      category_types: {
        Row: {
          color: string
          hidden: boolean
          icon: string | null
          id: string
          name: string
          user_id: string | null
        }
        Insert: {
          color?: string
          hidden?: boolean
          icon?: string | null
          id?: string
          name: string
          user_id?: string | null
        }
        Update: {
          color?: string
          hidden?: boolean
          icon?: string | null
          id?: string
          name?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "category_types_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          budget_category_id: string | null
          budget_id: string | null
          budget_period_id: string | null
          category_id: string | null
          created_at: string
          currency: string
          description: string | null
          exclude_from_totals: boolean
          from_account: string | null
          id: string
          to_account: string | null
          type: string | null
          user_id: string
        }
        Insert: {
          amount: number
          budget_category_id?: string | null
          budget_id?: string | null
          budget_period_id?: string | null
          category_id?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          exclude_from_totals?: boolean
          from_account?: string | null
          id?: string
          to_account?: string | null
          type?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          budget_category_id?: string | null
          budget_id?: string | null
          budget_period_id?: string | null
          category_id?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          exclude_from_totals?: boolean
          from_account?: string | null
          id?: string
          to_account?: string | null
          type?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_budget_category_id_fkey"
            columns: ["budget_category_id"]
            isOneToOne: false
            referencedRelation: "budget_period_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_budget_id_fkey"
            columns: ["budget_id"]
            isOneToOne: false
            referencedRelation: "budgets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_budget_period_id_fkey"
            columns: ["budget_period_id"]
            isOneToOne: false
            referencedRelation: "budget_periods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Transactions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Transactions_from_account_fkey"
            columns: ["from_account"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Transactions_to_account_fkey"
            columns: ["to_account"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar: string | null
          default_budget_id: string | null
          encrypted_master_key_b64: string | null
          first_name: string | null
          id: string
          is_premium: boolean
          iv_b64: string | null
          last_name: string | null
          salt_b64: string | null
          username: string | null
        }
        Insert: {
          avatar?: string | null
          default_budget_id?: string | null
          encrypted_master_key_b64?: string | null
          first_name?: string | null
          id?: string
          is_premium?: boolean
          iv_b64?: string | null
          last_name?: string | null
          salt_b64?: string | null
          username?: string | null
        }
        Update: {
          avatar?: string | null
          default_budget_id?: string | null
          encrypted_master_key_b64?: string | null
          first_name?: string | null
          id?: string
          is_premium?: boolean
          iv_b64?: string | null
          last_name?: string | null
          salt_b64?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_default_budget_id_fkey"
            columns: ["default_budget_id"]
            isOneToOne: false
            referencedRelation: "budgets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Users_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_budgets_for_user: {
        Args: {
          user_id: string
        }
        Returns: string[]
      }
      get_transaction_summary_by_category: {
        Args: {
          input_budget_id: string
          input_budget_period_id?: string
        }
        Returns: {
          category_name: string
          category_id: string
          income: number
          expense: number
          transfer: number
        }[]
      }
      update_current_budget_periods: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      transaction_types: "expense" | "income" | "transfer"
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
