import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          username: string | null;
          display_name: string | null;
          avatar_url: string | null;
          bio: string | null;
          total_posters: number;
          total_realms_explored: number;
          total_playtime_minutes: number;
          achievement_points: number;
          is_public: boolean;
          allow_remixes: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          total_posters?: number;
          total_realms_explored?: number;
          total_playtime_minutes?: number;
          achievement_points?: number;
          is_public?: boolean;
          allow_remixes?: boolean;
        };
        Update: Partial<Database['public']['Tables']['user_profiles']['Insert']>;
      };
      generated_posters: {
        Row: {
          id: string;
          user_id: string;
          image_url: string;
          track_name: string;
          realm_type: string;
          dna_seed: string;
          neon_color: string;
          realm_mode: number;
          particle_count: number;
          custom_config: any;
          view_count: number;
          remix_count: number;
          is_favorite: boolean;
          tags: string[] | null;
          created_at: string;
        };
      };
      gallery_posts: {
        Row: {
          id: string;
          user_id: string;
          poster_id: string;
          title: string;
          description: string | null;
          like_count: number;
          comment_count: number;
          view_count: number;
          remix_count: number;
          is_featured: boolean;
          created_at: string;
        };
      };
      post_likes: {
        Row: {
          id: string;
          post_id: string;
          user_id: string;
          created_at: string;
        };
      };
      post_comments: {
        Row: {
          id: string;
          post_id: string;
          user_id: string;
          content: string;
          parent_comment_id: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      custom_realms: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          geometry_config: any;
          color_scheme: any;
          animation_params: any;
          is_public: boolean;
          use_count: number;
          created_at: string;
          updated_at: string;
        };
      };
      live_sessions: {
        Row: {
          id: string;
          host_id: string;
          session_name: string;
          current_track: string | null;
          current_realm_config: any;
          playback_position: number;
          is_public: boolean;
          max_participants: number;
          participant_count: number;
          is_active: boolean;
          created_at: string;
          ended_at: string | null;
        };
      };
      favorite_tracks: {
        Row: {
          id: string;
          user_id: string;
          track_name: string;
          track_file: string;
          play_count: number;
          last_played_at: string | null;
          added_at: string;
        };
      };
      user_achievements: {
        Row: {
          id: string;
          user_id: string;
          achievement_type: string;
          achievement_name: string;
          achievement_description: string | null;
          progress: number;
          target: number;
          is_unlocked: boolean;
          unlocked_at: string | null;
          created_at: string;
        };
      };
      user_preferences: {
        Row: {
          user_id: string;
          default_particle_count: number;
          enable_bloom: boolean;
          enable_motion_blur: boolean;
          auto_play_next: boolean;
          crossfade_duration: number;
          theme: string;
          show_fps: boolean;
          show_audio_visualizer: boolean;
          auto_share_posters: boolean;
          allow_session_invites: boolean;
          updated_at: string;
        };
      };
    };
  };
};
