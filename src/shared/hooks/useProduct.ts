import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '../services/productService';
import { useAuth } from './useAuth';
import { Database } from '../types';

type ProductInsert = Database['public']['Tables']['products']['Insert'];
type ProductUpdate = Database['public']['Tables']['products']['Update'];

export const useProducts = () => {
    const { currentWarehouse } = useAuth();

    return useQuery({
        queryKey: ['products', currentWarehouse?.id],
        queryFn: () => productService.getProducts(currentWarehouse?.id),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useGlobalProducts = () => {
    return useQuery({
        queryKey: ['products', 'global'],
        queryFn: () => productService.getProducts(), // No warehouse filter for global products
        staleTime: 10 * 60 * 1000, // 10 minutes
    });
};

export const useProduct = (id: string) => {
    return useQuery({
        queryKey: ['product', id],
        queryFn: () => productService.getProductById(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
    });
};

export const useProductsByCategory = (category?: string) => {
    const { currentWarehouse } = useAuth();

    return useQuery({
        queryKey: ['products', 'category', currentWarehouse?.id, category],
        queryFn: () => productService.getProductsByCategory(currentWarehouse?.id, category),
        staleTime: 5 * 60 * 1000,
    });
};

export const useSearchProducts = (query: string) => {
    const { currentWarehouse } = useAuth();

    return useQuery({
        queryKey: ['products', 'search', currentWarehouse?.id, query],
        queryFn: () => productService.searchProducts(query, currentWarehouse?.id),
        enabled: !!query,
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
};

export const useCreateProduct = () => {
    const queryClient = useQueryClient();
    const { currentWarehouse } = useAuth();

    return useMutation({
        mutationFn: (product: Omit<ProductInsert, 'warehouse_id'>) => {
            return productService.createProduct({
                ...product,
                warehouse_id: currentWarehouse?.id || null,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });
};

export const useUpdateProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, product }: { id: string; product: ProductUpdate }) =>
            productService.updateProduct(id, product),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['product', id] });
        },
    });
};

export const useDeleteProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => productService.deleteProduct(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });
};
