import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { storageService } from '../services/storageService';
import { useAuth } from './useAuth';
import { Database } from '../types';

type StorageLotInsert = Database['public']['Tables']['storage_lots']['Insert'];
type StorageLotUpdate = Database['public']['Tables']['storage_lots']['Update'];

export const useStorageLots = (warehouseId: string) => {
    return useQuery({
        queryKey: ['storage_lots', warehouseId],
        queryFn: () => storageService.getStorageLots(warehouseId),
        enabled: !!warehouseId,
        staleTime: 5 * 60 * 1000,
    });
};

export const useStorageLot = (id: string) => {
    return useQuery({
        queryKey: ['storage_lot', id],
        queryFn: () => storageService.getStorageLotById(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
    });
};

export const useCreateStorageLot = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (lot: StorageLotInsert) =>
            storageService.createStorageLot(lot),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['storage_lots', variables.warehouse_id] });
        },
    });
};

export const useCreateStorageLots = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (lots: StorageLotInsert[]) =>
            storageService.createStorageLots(lots),
        onSuccess: (_, variables) => {
            if (variables.length > 0) {
                queryClient.invalidateQueries({ queryKey: ['storage_lots', variables[0].warehouse_id] });
            }
        },
    });
};


export const useUpdateStorageLot = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, lot }: { id: string; lot: StorageLotUpdate }) =>
            storageService.updateStorageLot(id, lot),
        onSuccess: (_, { id, lot }) => {
            // @ts-ignore
            queryClient.invalidateQueries({ queryKey: ['storage_lots', lot.warehouse_id] });
            queryClient.invalidateQueries({ queryKey: ['storage_lot', id] });
        },
    });
};

export const useDeleteStorageLot = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => storageService.deleteStorageLot(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['storage_lots'] });
        },
    });
};

export const useAvailableStorageLots = (requiredCapacity = 0) => {
    const { currentWarehouse } = useAuth();

    return useQuery({
        queryKey: ['storage_lots', 'available', currentWarehouse?.id, requiredCapacity],
        queryFn: () => {
            if (!currentWarehouse?.id) return [];
            return storageService.getAvailableLots(currentWarehouse.id, requiredCapacity);
        },
        enabled: !!currentWarehouse?.id,
        staleTime: 1 * 60 * 1000,
    });
};

export const useLotUtilization = () => {
    const { currentWarehouse } = useAuth();

    return useQuery({
        queryKey: ['storage_lots', 'utilization', currentWarehouse?.id],
        queryFn: () => {
            if (!currentWarehouse?.id) return [];
            return storageService.getLotUtilization(currentWarehouse.id);
        },
        enabled: !!currentWarehouse?.id,
        staleTime: 2 * 60 * 1000,
    });
};

export const useUpdateLotOccupancy = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ lotId, quantityChange }: { lotId: string; quantityChange: number }) =>
            storageService.updateLotOccupancy(lotId, quantityChange),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['storage_lots'] });
        },
    });
};
