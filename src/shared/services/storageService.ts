import { getSupabase } from '../lib/supabase';
import { Database } from '../types';

type StorageLot = Database['public']['Tables']['storage_lots']['Row'];
type StorageLotInsert = Database['public']['Tables']['storage_lots']['Insert'];
type StorageLotUpdate = Database['public']['Tables']['storage_lots']['Update'];

export interface StorageService {
    getStorageLots: (warehouseId: string) => Promise<StorageLot[]>;
    getStorageLotById: (id: string) => Promise<StorageLot | null>;
    createStorageLot: (lot: StorageLotInsert) => Promise<StorageLot | null>;
    updateStorageLot: (id: string, lot: StorageLotUpdate) => Promise<StorageLot | null>;
    deleteStorageLot: (id: string) => Promise<boolean>;
    createStorageLots: (lots: StorageLotInsert[]) => Promise<StorageLot[] | null>;
    getAvailableLots: (warehouseId: string, requiredCapacity?: number) => Promise<StorageLot[]>;
    getLotUtilization: (warehouseId: string) => Promise<any[]>;
    updateLotOccupancy: (lotId: string, quantityChange: number) => Promise<boolean>;
}


export const storageService: StorageService = {
    async getStorageLots(warehouseId: string) {
        try {
            const supabase = getSupabase();
            const { data, error } = await supabase
                .from('storage_lots')
                .select('*')
                .eq('warehouse_id', warehouseId)
                .eq('is_active', true)
                .is('deleted_at', null)
                .order('lot_name');

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching storage lots:', error);
            throw error;
        }
    },

    async getStorageLotById(id: string) {
        try {
            const supabase = getSupabase();
            const { data, error } = await supabase
                .from('storage_lots')
                .select('*')
                .eq('id', id)
                .eq('is_active', true)
                .is('deleted_at', null)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching storage lot:', error);
            throw error;
        }
    },

    async createStorageLot(lot) {
        try {
            const supabase = getSupabase();
            const { data, error } = await supabase
                .from('storage_lots')
                // @ts-ignore
                .insert(lot)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error creating storage lot:', error);
            throw error;
        }
    },

    async updateStorageLot(id: string, lot) {
        try {
            const supabase = getSupabase();
            const { data, error } = await supabase
                .from('storage_lots')
                // @ts-ignore
                .update(lot)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error updating storage lot:', error);
            throw error;
        }
    },

    async deleteStorageLot(id: string) {
        try {
            const supabase = getSupabase();
            const { error } = await supabase
                .from('storage_lots')
                // @ts-ignore
                .update({
                    is_active: false,
                    deleted_at: new Date().toISOString()
                })
                .eq('id', id);

            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Error deleting storage lot:', error);
            throw error;
        }
    },

    async createStorageLots(lots: StorageLotInsert[]) {
        try {
            const supabase = getSupabase();
            const { data, error } = await supabase
                .from('storage_lots')
                // @ts-ignore
                .insert(lots)
                .select();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error creating storage lots:', error);
            throw error;
        }
    },

    async getAvailableLots(warehouseId: string, requiredCapacity = 0) {
        try {
            const supabase = getSupabase();
            const { data, error } = await supabase
                .from('storage_lots')
                .select('*')
                .eq('warehouse_id', warehouseId)
                .eq('is_active', true)
                .eq('lot_status', 'active')
                .is('deleted_at', null)
                .gte('capacity - current_occupancy - reserved_capacity', requiredCapacity)
                .order('current_occupancy', { ascending: true });

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching available lots:', error);
            throw error;
        }
    },

    async getLotUtilization(warehouseId: string) {
        try {
            const supabase = getSupabase();
            const { data, error } = await supabase
                .from('storage_lots')
                .select(`
                  *,
                  utilization_percentage: round((current_occupancy::decimal / capacity * 100), 2),
                  available_capacity: capacity - current_occupancy - reserved_capacity,
                  status: case
                    when lot_status = 'full' then 'full'
                    when (current_occupancy::decimal / capacity) >= 0.9 then 'near_full'
                    when next_maintenance_date <= current_date + interval '7 days' then 'maintenance_due'
                    else 'normal'
                  end
                `)
                .eq('warehouse_id', warehouseId)
                .eq('is_active', true)
                .is('deleted_at', null)
                .order('lot_name');

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching lot utilization:', error);
            throw error;
        }
    },

    async updateLotOccupancy(lotId: string, quantityChange: number) {
        try {
            const supabase = getSupabase();
            // @ts-ignore
            const { error } = await supabase.rpc('update_lot_occupancy', {
                p_lot_id: lotId,
                p_quantity_change: quantityChange,
            });

            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Error updating lot occupancy:', error);
            throw error;
        }
    },
};
