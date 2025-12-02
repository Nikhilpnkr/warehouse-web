import { getSupabase } from '../lib/supabase';
import { Database } from '../types';

type Payment = Database['public']['Tables']['payments']['Row'] & {
    customers?: {
        customer_name: string;
        customer_phone: string;
    } | null;
};

type PaymentInsert = Database['public']['Tables']['payments']['Insert'];
type PaymentUpdate = Database['public']['Tables']['payments']['Update'];

export interface PaymentService {
    getPayments: (warehouseId: string) => Promise<Payment[]>;
    getPaymentById: (id: string) => Promise<Payment | null>;
    createPayment: (payment: Omit<PaymentInsert, 'transaction_id'> & { transaction_id?: string | null }) => Promise<Payment | null>;
    updatePayment: (id: string, payment: PaymentUpdate) => Promise<Payment | null>;
    getPaymentsByCustomer: (warehouseId: string, customerId: string) => Promise<Payment[]>;
    getOutstandingPayments: (warehouseId: string) => Promise<any[]>;
    getTodayPayments: (warehouseId: string) => Promise<Payment[]>;
    getTotalOutstanding: (warehouseId: string) => Promise<number>;
}

export const paymentService: PaymentService = {
    async getPayments(warehouseId: string) {
        const supabase = getSupabase();
        try {
            const { data, error } = await supabase
                .from('payments')
                .select('*, customers(customer_name, customer_phone)')
                .eq('warehouse_id', warehouseId)
                .order('payment_date', { ascending: false });

            if (error) throw error;
            return data as any || [];
        } catch (error) {
            console.error('Error fetching payments:', error);
            throw error;
        }
    },

    async getPaymentById(id: string) {
        const supabase = getSupabase();
        try {
            const { data, error } = await supabase
                .from('payments')
                .select('*, customers(customer_name, customer_phone)')
                .eq('id', id)
                .single();

            if (error) throw error;
            return data as any;
        } catch (error) {
            console.error('Error fetching payment:', error);
            throw error;
        }
    },

    async createPayment(payment: Omit<PaymentInsert, 'transaction_id'> & { transaction_id?: string | null }) {
        const supabase = getSupabase();
        console.log('Starting createPayment service...', payment);
        try {
            let transactionId = payment.transaction_id;

            // If no transaction_id is provided, create a generic payment transaction
            if (!transactionId) {
                console.log('No transaction_id provided. Creating dummy transaction...');
                const txnPayload = {
                    warehouse_id: payment.warehouse_id,
                    customer_id: payment.customer_id,
                    transaction_type: 'inflow', // Use 'inflow' to satisfy DB constraints (0 qty = no stock impact)
                    transaction_date: new Date().toISOString(),
                    item_quantity: 0,
                    base_amount: 0,
                    total_amount: 0, // Set to 0 to prevent increasing outstanding balance
                    status: 'completed',
                    payment_status: 'paid',
                    created_by: payment.received_by,
                    receipt_number: `PAY-${Date.now()}`,
                    storage_date: new Date().toISOString(), // Required field
                };
                console.log('Dummy transaction payload:', txnPayload);

                const { data: transactionData, error: transactionError } = await supabase
                    .from('transactions')
                    // @ts-ignore
                    .insert(txnPayload)
                    .select('id')
                    .single();

                if (transactionError) {
                    console.error('Error creating dummy transaction:', transactionError);
                    throw transactionError;
                }
                console.log('Dummy transaction created:', transactionData);
                transactionId = (transactionData as any).id;
            }

            console.log('Inserting payment record with transaction_id:', transactionId);

            const insertPromise = supabase
                .from('payments')
                // @ts-ignore
                .insert({
                    ...payment,
                    transaction_id: transactionId,
                    receipt_number: payment.receipt_number || `RCP-${Date.now()}`,
                    payment_date: new Date().toISOString(), // Explicitly set date
                })
                .select('id') // Select only ID to confirm success
                .single();

            // Add timeout to detect hangs
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Payment insertion timed out')), 10000)
            );

            const { data, error } = await Promise.race([insertPromise, timeoutPromise]) as any;

            if (error) {
                console.error('Error inserting payment:', error);
                throw error;
            }
            console.log('Payment created successfully:', data);
            return { ...payment, transaction_id: transactionId, id: data.id } as any;
        } catch (error) {
            console.error('Error in createPayment service:', error);
            throw error;
        }
    },

    async updatePayment(id: string, payment) {
        const supabase = getSupabase();
        try {
            const { data, error } = await supabase
                .from('payments')
                // @ts-ignore
                .update(payment)
                .eq('id', id)
                .select('*, customers(customer_name, customer_phone)')
                .single();

            if (error) throw error;
            return data as any;
        } catch (error) {
            console.error('Error updating payment:', error);
            throw error;
        }
    },

    async getPaymentsByCustomer(warehouseId: string, customerId: string) {
        const supabase = getSupabase();
        try {
            const { data, error } = await supabase
                .from('payments')
                .select('*')
                .eq('warehouse_id', warehouseId)
                .eq('customer_id', customerId)
                .order('payment_date', { ascending: false });

            if (error) throw error;
            return data as any || [];
        } catch (error) {
            console.error('Error fetching customer payments:', error);
            throw error;
        }
    },

    async getOutstandingPayments(warehouseId: string) {
        const supabase = getSupabase();
        try {
            const { data, error } = await supabase
                .from('customers')
                .select('*')
                .eq('warehouse_id', warehouseId)
                .gt('current_outstanding', 0)
                .eq('is_active', true)
                .order('current_outstanding', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching outstanding payments:', error);
            throw error;
        }
    },

    async getTodayPayments(warehouseId: string) {
        const supabase = getSupabase();
        const today = new Date().toISOString().split('T')[0];
        try {
            const { data, error } = await supabase
                .from('payments')
                .select('*')
                .eq('warehouse_id', warehouseId)
                .eq('payment_date_only', today)
                .eq('payment_status', 'completed')
                .order('payment_date', { ascending: false });

            if (error) throw error;
            return data as any || [];
        } catch (error) {
            console.error('Error fetching today payments:', error);
            throw error;
        }
    },

    async getTotalOutstanding(warehouseId: string) {
        const supabase = getSupabase();
        try {
            const { data, error } = await supabase
                .from('customers')
                .select('current_outstanding')
                .eq('warehouse_id', warehouseId)
                .eq('is_active', true);

            if (error) throw error;

            const customers = data as any[];
            const total = customers?.reduce((sum, customer) => sum + (customer.current_outstanding || 0), 0) || 0;
            return total;
        } catch (error) {
            console.error('Error calculating total outstanding:', error);
            throw error;
        }
    },
};
