"use client";

import { useEffect, useState } from "react";
import { warehouseService } from "@shared";
import {
    Plus,
    Search,
    MapPin,
    Phone,
    MoreVertical,
    Loader2,
    Warehouse
} from "lucide-react";

export default function WarehousesPage() {
    const [warehouses, setWarehouses] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchWarehouses = async () => {
            try {
                const data = await warehouseService.getWarehouses();
                setWarehouses(data);
            } catch (error) {
                console.error("Error fetching warehouses:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchWarehouses();
    }, []);

    const filteredWarehouses = warehouses.filter(warehouse =>
        warehouse.warehouse_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        warehouse.warehouse_code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-foreground">Warehouses</h1>
                <button
                    onClick={() => window.alert("Add Warehouse functionality coming soon!")}
                    className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Warehouse
                </button>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Search warehouses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-md border border-input bg-background pl-9 pr-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : filteredWarehouses.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                        <Warehouse className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium text-foreground">No warehouses found</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        {searchQuery ? "Try adjusting your search query" : "Get started by adding your first warehouse"}
                    </p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredWarehouses.map((warehouse) => (
                        <div key={warehouse.id} className="rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <span className="font-bold text-sm">{warehouse.warehouse_initials || warehouse.warehouse_code.substring(0, 2)}</span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground">{warehouse.warehouse_name}</h3>
                                        <p className="text-xs text-muted-foreground">{warehouse.warehouse_code}</p>
                                    </div>
                                </div>
                                <button className="p-2 hover:bg-accent rounded-full transition-colors">
                                    <MoreVertical className="h-4 w-4 text-muted-foreground" />
                                </button>
                            </div>

                            <div className="mt-4 space-y-2">
                                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                                    <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                    <span className="line-clamp-2">
                                        {warehouse.warehouse_address?.street}, {warehouse.warehouse_address?.city}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Phone className="h-4 w-4 flex-shrink-0" />
                                    <span>{warehouse.warehouse_contact?.phone || "No contact"}</span>
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-sm">
                                <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${warehouse.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {warehouse.is_active ? 'Active' : 'Inactive'}
                                </span>
                                <span className="text-muted-foreground">
                                    Capacity: {warehouse.warehouse_capacity?.total_capacity || 0}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
