import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customerService } from '../services/customerService';
import { useAuth } from './useAuth';
import { Database } from '../types';

type CustomerInsert = Database['public']['Tables']['customers']['Insert'];
type CustomerUpdate = Database['public']['Tables']['customers']['Update'];

export const useCustomers = () => {
    const { currentWarehouse } = useAuth();

    return useQuery({
        queryKey: ['customers', currentWarehouse?.id],
        queryFn: () => {
            if (!currentWarehouse?.id) return [];
            return customerService.getCustomers(currentWarehouse.id);
        },
        enabled: !!currentWarehouse?.id,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useCustomer = (id: string) => {
    return useQuery({
        queryKey: ['customer', id],
        queryFn: () => customerService.getCustomerById(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
    });
};

export const useSearchCustomers = (query: string) => {
    const { currentWarehouse } = useAuth();

    return useQuery({
        queryKey: ['customers', 'search', currentWarehouse?.id, query],
        queryFn: () => {
            if (!currentWarehouse?.id || !query) return [];
            return customerService.searchCustomers(currentWarehouse.id, query);
        },
        enabled: !!currentWarehouse?.id && !!query,
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
};

export const useOutstandingCustomers = () => {
    const { currentWarehouse } = useAuth();

    return useQuery({
        queryKey: ['customers', 'outstanding', currentWarehouse?.id],
        queryFn: () => {
            if (!currentWarehouse?.id) return [];
            return customerService.getOutstandingCustomers(currentWarehouse.id);
        },
        enabled: !!currentWarehouse?.id,
        staleTime: 5 * 60 * 1000,
    });
};

export const useCreateCustomer = () => {
    const queryClient = useQueryClient();
    const { currentWarehouse, user } = useAuth();

    return useMutation({
        mutationFn: (customer: Omit<CustomerInsert, 'warehouse_id' | 'created_by'>) => {
            if (!currentWarehouse?.id) throw new Error('No warehouse selected');
            if (!user?.id) throw new Error('No user found');

            return customerService.createCustomer({
                ...customer,
                warehouse_id: currentWarehouse.id,
                created_by: user.id,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['customers'] });
        },
    });
};

export const useUpdateCustomer = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, customer }: { id: string; customer: CustomerUpdate }) =>
            customerService.updateCustomer(id, customer),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ['customers'] });
            queryClient.invalidateQueries({ queryKey: ['customer', id] });
        },
    });
};

export const useDeleteCustomer = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => customerService.deleteCustomer(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['customers'] });
        },
    });
};
