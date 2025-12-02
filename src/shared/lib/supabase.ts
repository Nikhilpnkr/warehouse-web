import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types';

let supabase: SupabaseClient<Database> | null = null;

export const initSupabase = (url: string, key: string, options?: any) => {
    if (supabase) {
        console.warn('Supabase client already initialized.');
        return supabase;
    }
    supabase = createClient<Database>(url, key, options);
    return supabase;
};

export const getSupabase = () => {
    if (!supabase) {
        throw new Error('Supabase client not initialized. Call initSupabase first.');
    }
    return supabase;
};
