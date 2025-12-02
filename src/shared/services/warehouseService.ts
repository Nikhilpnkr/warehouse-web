import { getSupabase } from '../lib/supabase';
import { Database } from '../types';

type Warehouse = Database['public']['Tables']['warehouses']['Row'];
type WarehouseInsert = Database['public']['Tables']['warehouses']['Insert'];
type WarehouseUpdate = Database['public']['Tables']['warehouses']['Update'];

export interface WarehouseService {
    getWarehouses: () => Promise<Warehouse[]>;
    getWarehouseById: (id: string) => Promise<Warehouse | null>;
    createWarehouse: (warehouse: WarehouseInsert) => Promise<Warehouse | null>;
    updateWarehouse: (id: string, warehouse: WarehouseUpdate) => Promise<Warehouse | null>;
    deleteWarehouse: (id: string) => Promise<boolean>;
    getDefaultWarehouse: () => Promise<Warehouse | null>;
}

export const warehouseService: WarehouseService = {
    async getWarehouses() {
        try {
            const supabase = getSupabase();
            const { data, error } = await supabase
                .from('warehouses')
                .select('*')
                .eq('is_active', true)
                .is('deleted_at', null)
                .order('warehouse_name');

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching warehouses:', error);
            throw error;
        }
    },

    async getWarehouseById(id: string) {
        try {
            const supabase = getSupabase();
            const { data, error } = await supabase
                .from('warehouses')
                .select('*')
                .eq('id', id)
                .eq('is_active', true)
                .is('deleted_at', null)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching warehouse:', error);
            throw error;
        }
    },

    async createWarehouse(warehouse) {
        try {
            const supabase = getSupabase();
            const { data, error } = await supabase
                .from('warehouses')
                // @ts-ignore
                .insert(warehouse)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error creating warehouse:', error);
            throw error;
        }
    },

    async updateWarehouse(id: string, warehouse) {
        try {
            const supabase = getSupabase();
            const { data, error } = await supabase
                .from('warehouses')
                // @ts-ignore
                .update(warehouse)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error updating warehouse:', error);
            throw error;
        }
    },

    async deleteWarehouse(id: string) {
        try {
            const supabase = getSupabase();
            const { error } = await supabase
                .from('warehouses')
                // @ts-ignore
                .update({
                    is_active: false,
                    deleted_at: new Date().toISOString()
                })
                .eq('id', id);

            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Error deleting warehouse:', error);
            throw error;
        }
    },

    async getDefaultWarehouse() {
        try {
            const supabase = getSupabase();
            const { data, error } = await supabase
                .from('warehouses')
                .select('*')
                .eq('warehouse_code', 'DEFAULT')
                .eq('is_active', true)
                .is('deleted_at', null)
                .single();

            if (error && error.code !== 'PGRST116') { // Not found error
                throw error;
            }
            return data;
        } catch (error) {
            console.error('Error fetching default warehouse:', error);
            throw error;
        }
    },
};
