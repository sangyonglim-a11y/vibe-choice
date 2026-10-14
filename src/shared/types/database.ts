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
      profiles: {
        Row: {
          id: string;
          nickname: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          nickname?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nickname?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      games: {
        Row: {
          id: string;
          author_id: string;
          title: string;
          description: string | null;
          option_a_text: string;
          option_b_text: string;
          option_a_image_url: string | null;
          option_b_image_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          author_id: string;
          title: string;
          description?: string | null;
          option_a_text: string;
          option_b_text: string;
          option_a_image_url?: string | null;
          option_b_image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          author_id?: string;
          title?: string;
          description?: string | null;
          option_a_text?: string;
          option_b_text?: string;
          option_a_image_url?: string | null;
          option_b_image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      votes: {
        Row: {
          id: string;
          game_id: string;
          user_id: string | null;
          voter_key: string;
          choice: "A" | "B";
          created_at: string;
        };
        Insert: {
          id?: string;
          game_id: string;
          user_id?: string | null;
          voter_key: string;
          choice: "A" | "B";
          created_at?: string;
        };
        Update: {
          id?: string;
          game_id?: string;
          user_id?: string | null;
          voter_key?: string;
          choice?: "A" | "B";
          created_at?: string;
        };
        Relationships: [];
      };
      comments: {
        Row: {
          id: string;
          game_id: string;
          author_id: string;
          content: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          game_id: string;
          author_id: string;
          content: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          game_id?: string;
          author_id?: string;
          content?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
