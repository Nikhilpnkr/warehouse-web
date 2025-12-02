import { create } from 'zustand';
import { Session, User } from '@supabase/supabase-js';
import { authService } from '../services/authService';
import { warehouseService } from '../services/warehouseService';
import { getSupabase } from '../lib/supabase';
import { Database } from '../types';

type Profile = Database['public']['Tables']['profiles']['Row'];
type Warehouse = Database['public']['Tables']['warehouses']['Row'];

interface AuthState {
    session: Session | null;
    user: User | null;
    profile: Profile | null;
    currentWarehouse: Warehouse | null;
    isLoading: boolean;
    initialized: boolean;
    initialize: () => Promise<void>;
    signIn: typeof authService.signIn;
    signUp: typeof authService.signUp;
    signOut: () => Promise<void>;
    resetPassword: (email: string, redirectTo?: string) => Promise<{ data: any; error: any }>;
    setCurrentWarehouse: (warehouse: Warehouse) => Promise<void>;
    updatePassword: (password: string) => Promise<{ data: any; error: any }>;
}

export const useAuth = create<AuthState>((set, get) => ({
    session: null,
    user: null,
    profile: null,
    currentWarehouse: null,
    isLoading: true,
    initialized: false,
    initialize: async () => {
        if (get().initialized) return;

        try {
            console.log("Initializing auth...");
            const { data } = await authService.getSession();
            console.log("Session data:", data);
            set({ session: data.session, user: data.session?.user ?? null });

            if (data.session?.user) {
                const { data: profileData } = await authService.fetchProfile(data.session.user.id);
                const profile = profileData as Profile | null;
                set({ profile });

                if (profile?.warehouse_id) {
                    const warehouse = await warehouseService.getWarehouseById(profile.warehouse_id);
                    set({ currentWarehouse: warehouse });
                }
            }

            const supabase = getSupabase();
            supabase.auth.onAuthStateChange(async (_event, session) => {
                console.log("Auth state changed:", _event, session?.user?.email);
                set({ session, user: session?.user ?? null });
                if (session?.user) {
                    const { data: profileData } = await authService.fetchProfile(session.user.id);
                    const profile = profileData as Profile | null;
                    set({ profile });

                    if (profile?.warehouse_id) {
                        const warehouse = await warehouseService.getWarehouseById(profile.warehouse_id);
                        set({ currentWarehouse: warehouse });
                    } else {
                        set({ currentWarehouse: null });
                    }
                } else {
                    set({ profile: null, currentWarehouse: null });
                }
                set({ isLoading: false });
            });
        } catch (e) {
            console.error("Failed to initialize auth", e);
        } finally {
            console.log("Auth initialization complete");
            set({ isLoading: false, initialized: true });
        }
    },
    signIn: authService.signIn,
    signUp: authService.signUp,
    signOut: async () => {
        await authService.signOut();
        set({ session: null, user: null, profile: null, currentWarehouse: null });
    },
    resetPassword: async (email: string, redirectTo = '') => {
        return authService.resetPassword(email, redirectTo);
    },
    setCurrentWarehouse: async (warehouse: Warehouse) => {
        set({ currentWarehouse: warehouse });
    },
    updatePassword: async (password: string) => {
        return authService.updatePassword(password);
    }
}));
