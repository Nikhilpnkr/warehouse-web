import { getSupabase } from '../lib/supabase';
import { Database } from '../types';

type Product = Database['public']['Tables']['products']['Row'];
type ProductInsert = Database['public']['Tables']['products']['Insert'];
type ProductUpdate = Database['public']['Tables']['products']['Update'];

export interface ProductService {
    getProducts: (warehouseId?: string) => Promise<Product[]>;
    getProductById: (id: string) => Promise<Product | null>;
    createProduct: (product: ProductInsert) => Promise<Product | null>;
    updateProduct: (id: string, product: ProductUpdate) => Promise<Product | null>;
    deleteProduct: (id: string) => Promise<boolean>;
    getProductsByCategory: (warehouseId?: string, category?: string) => Promise<Product[]>;
    searchProducts: (query: string, warehouseId?: string) => Promise<Product[]>;
}

export const productService: ProductService = {
    async getProducts(warehouseId?: string) {
        try {
            const supabase = getSupabase();
            let query = supabase
                .from('products')
                .select('*')
                .eq('is_active', true)
                .is('deleted_at', null)
                .order('name');

            if (warehouseId) {
                query = query.eq('warehouse_id', warehouseId);
            } else {
                query = query.is('warehouse_id', null);
            }

            const { data, error } = await query;

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    },

    async getProductById(id: string) {
        try {
            const supabase = getSupabase();
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('id', id)
                .eq('is_active', true)
                .is('deleted_at', null)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching product:', error);
            throw error;
        }
    },

    async createProduct(product) {
        try {
            const supabase = getSupabase();
            const { data, error } = await supabase
                .from('products')
                // @ts-ignore
                .insert(product)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error creating product:', error);
            throw error;
        }
    },

    async updateProduct(id: string, product) {
        try {
            const supabase = getSupabase();
            const { data, error } = await supabase
                .from('products')
                // @ts-ignore
                .update(product)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error updating product:', error);
            throw error;
        }
    },

    async deleteProduct(id: string) {
        try {
            const supabase = getSupabase();
            const { error } = await supabase
                .from('products')
                // @ts-ignore
                .update({
                    is_active: false,
                    deleted_at: new Date().toISOString()
                })
                .eq('id', id);

            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Error deleting product:', error);
            throw error;
        }
    },

    async getProductsByCategory(warehouseId?: string, category?: string) {
        try {
            const supabase = getSupabase();
            let query = supabase
                .from('products')
                .select('*')
                .eq('is_active', true)
                .is('deleted_at', null)
                .order('name');

            if (warehouseId) {
                query = query.eq('warehouse_id', warehouseId);
            } else {
                query = query.is('warehouse_id', null);
            }

            if (category) {
                query = query.eq('category', category);
            }

            const { data, error } = await query;

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching products by category:', error);
            throw error;
        }
    },

    async searchProducts(query: string, warehouseId?: string) {
        try {
            const supabase = getSupabase();
            let dbQuery = supabase
                .from('products')
                .select('*')
                .eq('is_active', true)
                .is('deleted_at', null)
                .or(`name.ilike.%${query}%,code.ilike.%${query}%,category.ilike.%${query}%`)
                .order('name');

            if (warehouseId) {
                dbQuery = dbQuery.eq('warehouse_id', warehouseId);
            } else {
                dbQuery = dbQuery.is('warehouse_id', null);
            }

            const { data, error } = await dbQuery;

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error searching products:', error);
            throw error;
        }
    },
};
