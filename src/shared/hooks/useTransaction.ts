import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionService } from '../services/transactionService';
import { useAuth } from './useAuth';
import { Database } from '../types';

type TransactionInsert = Database['public']['Tables']['transactions']['Insert'];
type TransactionUpdate = Database['public']['Tables']['transactions']['Update'];

export const useTransactions = () => {
    const { currentWarehouse } = useAuth();

    return useQuery({
        queryKey: ['transactions', currentWarehouse?.id],
        queryFn: () => {
            if (!currentWarehouse?.id) return [];
            return transactionService.getTransactions(currentWarehouse.id);
        },
        enabled: !!currentWarehouse?.id,
        staleTime: 1 * 60 * 1000, // 1 minute
    });
};

export const useTransaction = (id: string) => {
    return useQuery({
        queryKey: ['transaction', id],
        queryFn: () => transactionService.getTransactionById(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
    });
};

export const useActiveInflowTransactions = () => {
    const { currentWarehouse } = useAuth();

    return useQuery({
        queryKey: ['transactions', 'inflow', 'active', currentWarehouse?.id],
        queryFn: () => {
            if (!currentWarehouse?.id) return [];
            return transactionService.getActiveInflowTransactions(currentWarehouse.id);
        },
        enabled: !!currentWarehouse?.id,
        staleTime: 1 * 60 * 1000,
    });
};

export const useCustomerTransactions = (customerId: string) => {
    const { currentWarehouse } = useAuth();

    return useQuery({
        queryKey: ['transactions', 'customer', currentWarehouse?.id, customerId],
        queryFn: () => {
            if (!currentWarehouse?.id || !customerId) return [];
            return transactionService.getTransactionsByCustomer(currentWarehouse.id, customerId);
        },
        enabled: !!currentWarehouse?.id && !!customerId,
        staleTime: 1 * 60 * 1000,
    });
};

export const useCreateInflowTransaction = () => {
    const queryClient = useQueryClient();
    const { currentWarehouse, user } = useAuth();

    return useMutation({
        mutationFn: (transaction: Omit<TransactionInsert, 'warehouse_id' | 'transaction_type' | 'receipt_number' | 'created_by'>) => {
            if (!currentWarehouse?.id) throw new Error('No warehouse selected');
            if (!user?.id) throw new Error('No user found');

            return transactionService.createInflowTransaction({
                ...transaction,
                warehouse_id: currentWarehouse.id,
                created_by: user.id,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            queryClient.invalidateQueries({ queryKey: ['storage_lots'] }); // Occupancy changes
            queryClient.invalidateQueries({ queryKey: ['products'] }); // Stock changes if tracked
        },
    });
};

export const useCreateOutflowTransaction = () => {
    const queryClient = useQueryClient();
    const { currentWarehouse, user } = useAuth();

    return useMutation({
        mutationFn: (transaction: Omit<TransactionInsert, 'warehouse_id' | 'transaction_type' | 'receipt_number' | 'created_by'>) => {
            if (!currentWarehouse?.id) throw new Error('No warehouse selected');
            if (!user?.id) throw new Error('No user found');

            return transactionService.createOutflowTransaction({
                ...transaction,
                warehouse_id: currentWarehouse.id,
                created_by: user.id,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            queryClient.invalidateQueries({ queryKey: ['storage_lots'] });
        },
    });
};
