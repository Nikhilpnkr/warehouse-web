import { getSupabase } from '../lib/supabase';
import { Database } from '../types';

type Transaction = Database['public']['Tables']['transactions']['Row'];
type TransactionInsert = Database['public']['Tables']['transactions']['Insert'];
type TransactionUpdate = Database['public']['Tables']['transactions']['Update'];

export interface TransactionService {
    getTransactions: (warehouseId: string) => Promise<Transaction[]>;
    getTransactionById: (id: string) => Promise<Transaction | null>;
    createInflowTransaction: (transaction: Omit<TransactionInsert, 'transaction_type' | 'receipt_number'>) => Promise<Transaction | null>;
    createOutflowTransaction: (transaction: Omit<TransactionInsert, 'transaction_type' | 'receipt_number'>) => Promise<Transaction | null>;
    updateTransaction: (id: string, transaction: TransactionUpdate) => Promise<Transaction | null>;
    getActiveInflowTransactions: (warehouseId: string) => Promise<Transaction[]>;
    getTransactionsByCustomer: (warehouseId: string, customerId: string) => Promise<Transaction[]>;
}

export const transactionService: TransactionService = {
    async getTransactions(warehouseId: string) {
        try {
            const supabase = getSupabase();
            const { data, error } = await supabase
                .from('transactions')
                .select('*, customers(customer_name), products(name)')
                .eq('warehouse_id', warehouseId)
                .eq('is_active', true)
                .is('deleted_at', null)
                .order('transaction_date', { ascending: false });

            if (error) throw error;
            return data as any; // Cast to any to avoid type mismatch with generated types

        } catch (error) {
            console.error('Error fetching transactions:', error);
            throw error;
        }
    },

    async getTransactionById(id: string) {
        try {
            const supabase = getSupabase();
            const { data, error } = await supabase
                .from('transactions')
                .select('*, customers(*), products(*), storage_lots(*)')
                .eq('id', id)
                .eq('is_active', true)
                .is('deleted_at', null)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching transaction:', error);
            throw error;
        }
    },

    async createInflowTransaction(transaction) {
        try {
            const supabase = getSupabase();
            // @ts-ignore
            const { laborPaidAmount, paymentMode, ...txnData } = transaction;

            // @ts-ignore
            const { data, error } = await supabase.rpc('create_inflow_transaction', {
                p_warehouse_id: txnData.warehouse_id,
                p_customer_id: txnData.customer_id,
                p_product_id: txnData.product_id ?? null,
                p_storage_lot_id: txnData.storage_lot_id ?? null,
                p_transaction_date: txnData.transaction_date,
                p_item_quantity: txnData.item_quantity,
                p_item_unit: txnData.item_unit,
                p_item_weight: txnData.item_weight ?? null,
                p_storage_date: txnData.storage_date,
                p_storage_rate: txnData.storage_rate ?? null,
                p_base_amount: txnData.base_amount,
                p_handling_charges: txnData.handling_charges ?? null,
                p_labor_charge_per_bag: txnData.labor_charge_per_bag ?? null,
                p_total_labor_charges: txnData.total_labor_charges ?? null,
                p_total_amount: txnData.total_amount,
                p_notes: txnData.notes ?? null,
                p_created_by: txnData.created_by,
                p_labor_paid_amount: laborPaidAmount || 0,
                p_payment_mode: paymentMode || 'cash'
            });

            if (error) throw error;
            return data as any;
        } catch (error) {
            console.error('Error creating inflow transaction (RPC):', error);
            throw error;
        }
    },

    async createOutflowTransaction(transaction) {
        try {
            const supabase = getSupabase();
            // @ts-ignore
            const { amountPaid, paymentMode, ...txnData } = transaction;

            // @ts-ignore
            const { data, error } = await supabase.rpc('create_outflow_transaction', {
                p_warehouse_id: txnData.warehouse_id,
                p_customer_id: txnData.customer_id,
                p_parent_transaction_id: txnData.parent_transaction_id ?? null,
                p_transaction_date: txnData.transaction_date,
                p_item_quantity: txnData.item_quantity,
                p_item_unit: txnData.item_unit,
                p_item_weight: txnData.item_weight ?? null,
                p_base_amount: txnData.base_amount,
                p_tax_amount: txnData.tax_amount ?? null,
                p_discount_amount: txnData.discount_amount ?? null,
                p_total_amount: txnData.total_amount,
                p_notes: txnData.notes ?? null,
                p_created_by: txnData.created_by,
                p_amount_paid: amountPaid || 0,
                p_payment_mode: paymentMode || 'cash'
            });

            if (error) throw error;
            return data as any;
        } catch (error) {
            console.error('Error creating outflow transaction (RPC):', error);
            throw error;
        }
    },

    async updateTransaction(id: string, transaction) {
        try {
            const supabase = getSupabase();
            const { data, error } = await supabase
                .from('transactions')
                // @ts-ignore
                .update(transaction)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error updating transaction:', error);
            throw error;
        }
    },

    async getActiveInflowTransactions(warehouseId: string) {
        try {
            const supabase = getSupabase();
            const { data, error } = await supabase
                .from('transactions')
                // Fetch inflows and their related outflows (where parent_transaction_id points to this inflow)
                // Also fetch storage_lots to get the lot name
                .select('*, outflows:transactions!parent_transaction_id(*), storage_lots(lot_name)')
                .eq('warehouse_id', warehouseId)
                .eq('transaction_type', 'inflow')
                .eq('status', 'active')
                .eq('is_active', true)
                .is('deleted_at', null)
                .order('transaction_date', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching active inflow transactions:', error);
            throw error;
        }
    },

    async getTransactionsByCustomer(warehouseId: string, customerId: string) {
        try {
            const supabase = getSupabase();
            const { data, error } = await supabase
                .from('transactions')
                .select('*')
                .eq('warehouse_id', warehouseId)
                .eq('customer_id', customerId)
                .eq('is_active', true)
                .is('deleted_at', null)
                .order('transaction_date', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching customer transactions:', error);
            throw error;
        }
    },
};
