export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            user_roles: {
                Row: {
                    id: string
                    role_code: string
                    role_name: string
                    role_description: string | null
                    hierarchy_level: number
                    permissions: Json
                    is_active: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    role_code: string
                    role_name: string
                    role_description?: string | null
                    hierarchy_level: number
                    permissions?: Json
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    role_code?: string
                    role_name?: string
                    role_description?: string | null
                    hierarchy_level?: number
                    permissions?: Json
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            warehouses: {
                Row: {
                    id: string
                    warehouse_name: string
                    warehouse_code: string
                    warehouse_initials: string | null
                    warehouse_address: Json
                    warehouse_contact: Json
                    warehouse_settings: Json
                    warehouse_capacity: Json
                    business_details: Json
                    default_storage_rate: number
                    default_labor_rate: number
                    timezone: string
                    currency: string
                    gst_number: string | null
                    license_details: Json
                    is_active: boolean
                    deleted_at: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    warehouse_name: string
                    warehouse_code: string
                    warehouse_initials?: string | null
                    warehouse_address: Json
                    warehouse_contact: Json
                    warehouse_settings?: Json
                    warehouse_capacity?: Json
                    business_details?: Json
                    default_storage_rate?: number
                    default_labor_rate?: number
                    timezone?: string
                    currency?: string
                    gst_number?: string | null
                    license_details?: Json
                    is_active?: boolean
                    deleted_at?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    warehouse_name?: string
                    warehouse_code?: string
                    warehouse_initials?: string | null
                    warehouse_address?: Json
                    warehouse_contact?: Json
                    warehouse_settings?: Json
                    warehouse_capacity?: Json
                    business_details?: Json
                    default_storage_rate?: number
                    default_labor_rate?: number
                    timezone?: string
                    currency?: string
                    gst_number?: string | null
                    license_details?: Json
                    is_active?: boolean
                    deleted_at?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            profiles: {
                Row: {
                    id: string
                    warehouse_id: string
                    user_role_id: string
                    email: string
                    full_name: string
                    phone: string
                    avatar_url: string | null
                    employee_id: string | null
                    department: string | null
                    designation: string | null
                    address: Json | null
                    emergency_contact: Json | null
                    custom_permissions: Json
                    reporting_manager_id: string | null
                    hire_date: string | null
                    salary_details: Json | null
                    is_active: boolean
                    deleted_at: string | null
                    last_login: string | null
                    login_attempts: number
                    account_locked_until: string | null
                    session_timeout: number
                    notes: string | null
                    created_by: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    warehouse_id: string
                    user_role_id: string
                    email: string
                    full_name: string
                    phone: string
                    avatar_url?: string | null
                    employee_id?: string | null
                    department?: string | null
                    designation?: string | null
                    address?: Json | null
                    emergency_contact?: Json | null
                    custom_permissions?: Json
                    reporting_manager_id?: string | null
                    hire_date?: string | null
                    salary_details?: Json | null
                    is_active?: boolean
                    deleted_at?: string | null
                    last_login?: string | null
                    login_attempts?: number
                    account_locked_until?: string | null
                    session_timeout?: number
                    notes?: string | null
                    created_by?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    warehouse_id?: string
                    user_role_id?: string
                    email?: string
                    full_name?: string
                    phone?: string
                    avatar_url?: string | null
                    employee_id?: string | null
                    department?: string | null
                    designation?: string | null
                    address?: Json | null
                    emergency_contact?: Json | null
                    custom_permissions?: Json
                    reporting_manager_id?: string | null
                    hire_date?: string | null
                    salary_details?: Json | null
                    is_active?: boolean
                    deleted_at?: string | null
                    last_login?: string | null
                    login_attempts?: number
                    account_locked_until?: string | null
                    session_timeout?: number
                    notes?: string | null
                    created_by?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            customers: {
                Row: {
                    id: string
                    warehouse_id: string
                    customer_name: string
                    customer_phone: string
                    customer_email: string | null
                    customer_address: Json | null
                    business_name: string | null
                    gst_number: string | null
                    pan_number: string | null
                    customer_type: string
                    customer_status: string
                    credit_limit: number
                    current_outstanding: number
                    payment_terms: string
                    risk_category: string
                    kyc_status: string
                    kyc_documents: Json
                    last_transaction_date: string | null
                    notes: string | null
                    tags: Json
                    is_active: boolean
                    deleted_at: string | null
                    created_by: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    warehouse_id: string
                    customer_name: string
                    customer_phone: string
                    customer_email?: string | null
                    customer_address?: Json | null
                    business_name?: string | null
                    gst_number?: string | null
                    pan_number?: string | null
                    customer_type?: string
                    customer_status?: string
                    credit_limit?: number
                    current_outstanding?: number
                    payment_terms?: string
                    risk_category?: string
                    kyc_status?: string
                    kyc_documents?: Json
                    last_transaction_date?: string | null
                    notes?: string | null
                    tags?: Json
                    is_active?: boolean
                    deleted_at?: string | null
                    created_by: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    warehouse_id?: string
                    customer_name?: string
                    customer_phone?: string
                    customer_email?: string | null
                    customer_address?: Json | null
                    business_name?: string | null
                    gst_number?: string | null
                    pan_number?: string | null
                    customer_type?: string
                    customer_status?: string
                    credit_limit?: number
                    current_outstanding?: number
                    payment_terms?: string
                    risk_category?: string
                    kyc_status?: string
                    kyc_documents?: Json
                    last_transaction_date?: string | null
                    notes?: string | null
                    tags?: Json
                    is_active?: boolean
                    deleted_at?: string | null
                    created_by?: string
                    created_at?: string
                    updated_at?: string
                }
            }
            products: {
                Row: {
                    id: string
                    warehouse_id: string | null
                    name: string
                    code: string | null
                    category: string | null
                    subcategory: string | null
                    rates: Json
                    unit: string
                    weight_per_unit: number | null
                    quality_grades: Json
                    storage_requirements: Json
                    handling_instructions: Json
                    seasonal_rates: Json
                    minimum_storage_period: number
                    maximum_storage_period: number | null
                    perishable: boolean
                    hazardous: boolean
                    is_active: boolean
                    deleted_at: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    warehouse_id?: string | null
                    name: string
                    code?: string | null
                    category?: string | null
                    subcategory?: string | null
                    rates?: Json
                    unit?: string
                    weight_per_unit?: number | null
                    quality_grades?: Json
                    storage_requirements?: Json
                    handling_instructions?: Json
                    seasonal_rates?: Json
                    minimum_storage_period?: number
                    maximum_storage_period?: number | null
                    perishable?: boolean
                    hazardous?: boolean
                    is_active?: boolean
                    deleted_at?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    warehouse_id?: string | null
                    name?: string
                    code?: string | null
                    category?: string | null
                    subcategory?: string | null
                    rates?: Json
                    unit?: string
                    weight_per_unit?: number | null
                    quality_grades?: Json
                    storage_requirements?: Json
                    handling_instructions?: Json
                    seasonal_rates?: Json
                    minimum_storage_period?: number
                    maximum_storage_period?: number | null
                    perishable?: boolean
                    hazardous?: boolean
                    is_active?: boolean
                    deleted_at?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            storage_lots: {
                Row: {
                    id: string
                    warehouse_id: string
                    lot_name: string
                    capacity: number
                    current_occupancy: number
                    reserved_capacity: number
                    lot_type: string
                    rate_multiplier: number
                    lot_status: string
                    lot_description: string | null
                    lot_settings: Json
                    climate_control: Json
                    safety_features: Json
                    maintenance_schedule: Json
                    last_maintenance_date: string | null
                    next_maintenance_date: string | null
                    is_active: boolean
                    deleted_at: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    warehouse_id: string
                    lot_name: string
                    capacity: number
                    current_occupancy?: number
                    reserved_capacity?: number
                    lot_type?: string
                    rate_multiplier?: number
                    lot_status?: string
                    lot_description?: string | null
                    lot_settings?: Json
                    climate_control?: Json
                    safety_features?: Json
                    maintenance_schedule?: Json
                    last_maintenance_date?: string | null
                    next_maintenance_date?: string | null
                    is_active?: boolean
                    deleted_at?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    warehouse_id?: string
                    lot_name?: string
                    capacity?: number
                    current_occupancy?: number
                    reserved_capacity?: number
                    lot_type?: string
                    rate_multiplier?: number
                    lot_status?: string
                    lot_description?: string | null
                    lot_settings?: Json
                    climate_control?: Json
                    safety_features?: Json
                    maintenance_schedule?: Json
                    last_maintenance_date?: string | null
                    next_maintenance_date?: string | null
                    is_active?: boolean
                    deleted_at?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            transactions: {
                Row: {
                    id: string
                    warehouse_id: string
                    customer_id: string
                    product_id: string | null
                    storage_lot_id: string | null
                    transaction_type: string
                    transaction_date: string
                    transaction_date_only: string | null
                    item_quantity: number
                    item_unit: string
                    item_weight: number | null
                    storage_date: string
                    expected_outflow_date: string | null
                    actual_outflow_date: string | null
                    storage_rate: number | null
                    base_amount: number
                    tax_amount: number
                    discount_amount: number
                    handling_charges: number
                    labor_charge_per_bag: number
                    total_labor_charges: number
                    total_amount: number
                    parent_transaction_id: string | null
                    receipt_number: string
                    status: string
                    payment_status: string
                    labor_payment_status: string
                    verified_by: string | null
                    verification_date: string | null
                    quality_notes: string | null
                    moisture_content: number | null
                    damage_percentage: number
                    weight_notes: string | null
                    photos: Json
                    documents: Json
                    notes: string | null
                    is_active: boolean
                    deleted_at: string | null
                    created_by: string
                    created_at: string
                    updated_at: string
                    storage_outstanding: number
                    storage_paid_amount: number
                    storage_payment_status: string
                }
                Insert: {
                    id?: string
                    warehouse_id: string
                    customer_id: string
                    product_id?: string | null
                    storage_lot_id?: string | null
                    transaction_type: string
                    transaction_date?: string
                    transaction_date_only?: string | null
                    item_quantity: number
                    item_unit?: string
                    item_weight?: number | null
                    storage_date: string
                    expected_outflow_date?: string | null
                    actual_outflow_date?: string | null
                    storage_rate?: number | null
                    base_amount: number
                    tax_amount?: number
                    discount_amount?: number
                    handling_charges?: number
                    labor_charge_per_bag?: number
                    total_labor_charges?: number
                    total_amount: number
                    parent_transaction_id?: string | null
                    receipt_number: string
                    status?: string
                    payment_status?: string
                    labor_payment_status?: string
                    verified_by?: string | null
                    verification_date?: string | null
                    quality_notes?: string | null
                    moisture_content?: number | null
                    damage_percentage?: number
                    weight_notes?: string | null
                    photos?: Json
                    documents?: Json
                    notes?: string | null
                    is_active?: boolean
                    deleted_at?: string | null
                    created_by: string
                    created_at?: string
                    updated_at?: string
                    storage_outstanding?: number
                    storage_paid_amount?: number
                    storage_payment_status?: string
                }
                Update: {
                    id?: string
                    warehouse_id?: string
                    customer_id?: string
                    product_id?: string | null
                    storage_lot_id?: string | null
                    transaction_type?: string
                    transaction_date?: string
                    transaction_date_only?: string | null
                    item_quantity?: number
                    item_unit?: string
                    item_weight?: number | null
                    storage_date?: string
                    expected_outflow_date?: string | null
                    actual_outflow_date?: string | null
                    storage_rate?: number | null
                    base_amount?: number
                    tax_amount?: number
                    discount_amount?: number
                    handling_charges?: number
                    labor_charge_per_bag?: number
                    total_labor_charges?: number
                    total_amount?: number
                    parent_transaction_id?: string | null
                    receipt_number?: string
                    status?: string
                    payment_status?: string
                    labor_payment_status?: string
                    verified_by?: string | null
                    verification_date?: string | null
                    quality_notes?: string | null
                    moisture_content?: number | null
                    damage_percentage?: number
                    weight_notes?: string | null
                    photos?: Json
                    documents?: Json
                    notes?: string | null
                    is_active?: boolean
                    deleted_at?: string | null
                    created_by?: string
                    created_at?: string
                    updated_at?: string
                    storage_outstanding?: number
                    storage_paid_amount?: number
                    storage_payment_status?: string
                }
            }
            payments: {
                Row: {
                    id: string
                    warehouse_id: string
                    customer_id: string
                    transaction_id: string
                    payment_amount: number
                    payment_date: string
                    payment_date_only: string | null
                    payment_type: string
                    payment_mode: string
                    payment_status: string
                    payment_reference: string | null
                    receipt_number: string
                    received_by: string
                    verified_by: string | null
                    verification_date: string | null
                    reconciliation_status: string
                    notes: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    warehouse_id: string
                    customer_id: string
                    transaction_id: string
                    payment_amount: number
                    payment_date?: string
                    payment_date_only?: string | null
                    payment_type?: string
                    payment_mode: string
                    payment_status?: string
                    payment_reference?: string | null
                    receipt_number: string
                    received_by: string
                    verified_by?: string | null
                    verification_date?: string | null
                    reconciliation_status?: string
                    notes?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    warehouse_id?: string
                    customer_id?: string
                    transaction_id?: string
                    payment_amount?: number
                    payment_date?: string
                    payment_date_only?: string | null
                    payment_type?: string
                    payment_mode?: string
                    payment_status?: string
                    payment_reference?: string | null
                    receipt_number?: string
                    received_by?: string
                    verified_by?: string | null
                    verification_date?: string | null
                    reconciliation_status?: string
                    notes?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
        }
    }
}
