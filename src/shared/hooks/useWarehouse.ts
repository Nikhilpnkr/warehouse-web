import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { warehouseService } from '../services/warehouseService';
import { Database } from '../types';

type WarehouseInsert = Database['public']['Tables']['warehouses']['Insert'];
type WarehouseUpdate = Database['public']['Tables']['warehouses']['Update'];

export const useWarehouses = () => {
    return useQuery({
        queryKey: ['warehouses'],
        queryFn: () => warehouseService.getWarehouses(),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useWarehouse = (id: string) => {
    return useQuery({
        queryKey: ['warehouse', id],
        queryFn: () => warehouseService.getWarehouseById(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
    });
};

export const useDefaultWarehouse = () => {
    return useQuery({
        queryKey: ['warehouse', 'default'],
        queryFn: () => warehouseService.getDefaultWarehouse(),
        staleTime: 10 * 60 * 1000, // 10 minutes
    });
};

export const useCreateWarehouse = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (warehouse: WarehouseInsert) =>
            warehouseService.createWarehouse(warehouse),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['warehouses'] });
        },
    });
};

export const useUpdateWarehouse = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, warehouse }: { id: string; warehouse: WarehouseUpdate }) =>
            warehouseService.updateWarehouse(id, warehouse),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ['warehouses'] });
            queryClient.invalidateQueries({ queryKey: ['warehouse', id] });
        },
    });
};

export const useDeleteWarehouse = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => warehouseService.deleteWarehouse(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['warehouses'] });
        },
    });
};
