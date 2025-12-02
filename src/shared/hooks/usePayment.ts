import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentService } from '../services/paymentService';
import { useAuth } from './useAuth';
import { Database } from '../types';

type PaymentInsert = Database['public']['Tables']['payments']['Insert'];
type PaymentUpdate = Database['public']['Tables']['payments']['Update'];

export const usePayments = () => {
    const { currentWarehouse } = useAuth();

    return useQuery({
        queryKey: ['payments', currentWarehouse?.id],
        queryFn: () => {
            if (!currentWarehouse?.id) return [];
            return paymentService.getPayments(currentWarehouse.id);
        },
        enabled: !!currentWarehouse?.id,
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
};

export const usePayment = (id: string) => {
    return useQuery({
        queryKey: ['payment', id],
        queryFn: () => paymentService.getPaymentById(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
    });
};

export const useOutstandingPayments = () => {
    const { currentWarehouse } = useAuth();

    return useQuery({
        queryKey: ['payments', 'outstanding', currentWarehouse?.id],
        queryFn: () => {
            if (!currentWarehouse?.id) return [];
            return paymentService.getOutstandingPayments(currentWarehouse.id);
        },
        enabled: !!currentWarehouse?.id,
        staleTime: 2 * 60 * 1000,
    });
};

export const useTodayPayments = () => {
    const { currentWarehouse } = useAuth();

    return useQuery({
        queryKey: ['payments', 'today', currentWarehouse?.id],
        queryFn: () => {
            if (!currentWarehouse?.id) return [];
            return paymentService.getTodayPayments(currentWarehouse.id);
        },
        enabled: !!currentWarehouse?.id,
        staleTime: 1 * 60 * 1000, // 1 minute
    });
};

export const useTotalOutstanding = () => {
    const { currentWarehouse } = useAuth();

    return useQuery({
        queryKey: ['payments', 'total-outstanding', currentWarehouse?.id],
        queryFn: () => {
            if (!currentWarehouse?.id) return 0;
            return paymentService.getTotalOutstanding(currentWarehouse.id);
        },
        enabled: !!currentWarehouse?.id,
        staleTime: 2 * 60 * 1000,
    });
};

export const usePaymentsByCustomer = (customerId: string) => {
    const { currentWarehouse } = useAuth();

    return useQuery({
        queryKey: ['payments', 'customer', currentWarehouse?.id, customerId],
        queryFn: () => {
            if (!currentWarehouse?.id || !customerId) return [];
            return paymentService.getPaymentsByCustomer(currentWarehouse.id, customerId);
        },
        enabled: !!currentWarehouse?.id && !!customerId,
        staleTime: 5 * 60 * 1000,
    });
};

export const useCreatePayment = () => {
    const queryClient = useQueryClient();
    const { currentWarehouse, user, profile } = useAuth();

    return useMutation({
        mutationFn: (payment: Omit<PaymentInsert, 'warehouse_id' | 'received_by' | 'transaction_id'> & { transaction_id?: string | null }) => {
            if (!currentWarehouse?.id) throw new Error('No warehouse selected');
            // Use user.id if available, otherwise fallback to profile.id or throw error
            const userId = user?.id || profile?.id;
            if (!userId) throw new Error('User not authenticated');

            return paymentService.createPayment({
                ...payment,
                warehouse_id: currentWarehouse.id,
                received_by: userId,
            } as any);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['payments'] });
            queryClient.invalidateQueries({ queryKey: ['customers'] });
        },
    });
};

export const useUpdatePayment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payment }: { id: string; payment: PaymentUpdate }) =>
            paymentService.updatePayment(id, payment),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ['payments'] });
            queryClient.invalidateQueries({ queryKey: ['payment', id] });
        },
    });
};
