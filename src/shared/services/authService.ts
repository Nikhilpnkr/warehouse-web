import { getSupabase } from '../lib/supabase';
import { Database } from '../types';

type Warehouse = Database['public']['Tables']['warehouses']['Row'];

export const authService = {
    signIn: async (email: string, password: string) => {
        const supabase = getSupabase();
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        return { data, error };
    },

    signUp: async (email: string, password: string, metadata?: { [key: string]: any }) => {
        const supabase = getSupabase();
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: metadata,
            },
        });
        return { data, error };
    },

    signOut: async () => {
        const supabase = getSupabase();
        const { error } = await supabase.auth.signOut();
        return { error };
    },

    updatePassword: async (password: string) => {
        const supabase = getSupabase();
        const { data, error } = await supabase.auth.updateUser({
            password,
        });
        return { data, error };
    },

    resetPassword: async (email: string, redirectTo: string) => {
        const supabase = getSupabase();
        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo,
        });
        return { data, error };
    },

    getSession: async () => {
        const supabase = getSupabase();
        const { data, error } = await supabase.auth.getSession();
        return { data, error };
    },

    fetchProfile: async (userId: string) => {
        const supabase = getSupabase();
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();
        return { data, error };
    },

    updateProfile: async (userId: string, updates: any) => {
        const supabase = getSupabase();
        const { data, error } = await supabase
            .from('profiles')
            // @ts-ignore
            .update(updates)
            .eq('id', userId)
            .select()
            .single();
        return { data, error };
    },
};
