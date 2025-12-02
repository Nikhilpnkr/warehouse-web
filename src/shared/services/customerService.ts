import { getSupabase } from '../lib/supabase';
import { Database } from '../types';

type Customer = Database['public']['Tables']['customers']['Row'];
type CustomerInsert = Database['public']['Tables']['customers']['Insert'];
type CustomerUpdate = Database['public']['Tables']['customers']['Update'];

export interface CustomerService {
    getCustomers: (warehouseId: string) => Promise<Customer[]>;
    getCustomerById: (id: string) => Promise<Customer | null>;
    createCustomer: (customer: CustomerInsert) => Promise<Customer | null>;
    updateCustomer: (id: string, customer: CustomerUpdate) => Promise<Customer | null>;
    deleteCustomer: (id: string) => Promise<boolean>;
    searchCustomers: (warehouseId: string, query: string) => Promise<Customer[]>;
    getCustomersByStatus: (warehouseId: string, status: string) => Promise<Customer[]>;
    getOutstandingCustomers: (warehouseId: string) => Promise<Customer[]>;
}

export const customerService: CustomerService = {
    async getCustomers(warehouseId: string) {
        try {
            const supabase = getSupabase();
            const { data, error } = await supabase
                .from('customers')
                .select('*')
                .eq('warehouse_id', warehouseId)
                .eq('is_active', true)
                .is('deleted_at', null)
                .order('customer_name');

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching customers:', error);
            throw error;
        }
    },

    async getCustomerById(id: string) {
        try {
            const supabase = getSupabase();
            const { data, error } = await supabase
                .from('customers')
                .select('*')
                .eq('id', id)
                .eq('is_active', true)
                .is('deleted_at', null)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching customer:', error);
            throw error;
        }
    },

    async createCustomer(customer) {
        try {
            const supabase = getSupabase();
            const { data, error } = await supabase
                .from('customers')
                // @ts-ignore
                .insert(customer)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error creating customer:', error);
            throw error;
        }
    },

    async updateCustomer(id: string, customer) {
        try {
            const supabase = getSupabase();
            const { data, error } = await supabase
                .from('customers')
                // @ts-ignore
                .update(customer)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error updating customer:', error);
            throw error;
        }
    },

    async deleteCustomer(id: string) {
        try {
            const supabase = getSupabase();
            const { error } = await supabase
                .from('customers')
                // @ts-ignore
                .update({
                    is_active: false,
                    deleted_at: new Date().toISOString()
                })
                .eq('id', id);

            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Error deleting customer:', error);
            throw error;
        }
    },

    async searchCustomers(warehouseId: string, query: string) {
        try {
            const supabase = getSupabase();
            const { data, error } = await supabase
                .from('customers')
                .select('*')
                .eq('warehouse_id', warehouseId)
                .eq('is_active', true)
                .is('deleted_at', null)
                .or(`customer_name.ilike.%${query}%,customer_phone.ilike.%${query}%,business_name.ilike.%${query}%`)
                .order('customer_name');

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error searching customers:', error);
            throw error;
        }
    },

    async getCustomersByStatus(warehouseId: string, status: string) {
        try {
            const supabase = getSupabase();
            const { data, error } = await supabase
                .from('customers')
                .select('*')
                .eq('warehouse_id', warehouseId)
                .eq('customer_status', status)
                .eq('is_active', true)
                .is('deleted_at', null)
                .order('customer_name');

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching customers by status:', error);
            throw error;
        }
    },

    async getOutstandingCustomers(warehouseId: string) {
        try {
            const supabase = getSupabase();
            const { data, error } = await supabase
                .from('customers')
                .select('*')
                .eq('warehouse_id', warehouseId)
                .gt('current_outstanding', 0)
                .eq('is_active', true)
                .is('deleted_at', null)
                .order('current_outstanding', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching outstanding customers:', error);
            throw error;
        }
    },
};
