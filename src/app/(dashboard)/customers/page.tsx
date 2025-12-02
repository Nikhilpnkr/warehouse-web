"use client";

import { useEffect, useState } from "react";
import { customerService, useAuth } from "@shared";
import {
    Plus,
    Search,
    Phone,
    Mail,
    MoreVertical,
    Loader2,
    Users
} from "lucide-react";

export default function CustomersPage() {
    const { currentWarehouse } = useAuth();
    const [customers, setCustomers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchCustomers = async () => {
            if (!currentWarehouse?.id) {
                setIsLoading(false);
                return;
            }

            try {
                const data = await customerService.getCustomers(currentWarehouse.id);
                setCustomers(data);
            } catch (error) {
                console.error("Error fetching customers:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCustomers();
    }, [currentWarehouse]);

    const filteredCustomers = customers.filter(customer =>
        customer.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.customer_phone.includes(searchQuery)
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-foreground">Customers</h1>
                <button
                    onClick={() => window.alert("Add Customer functionality coming soon!")}
                    className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Customer
                </button>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Search customers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-md border border-input bg-background pl-9 pr-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : filteredCustomers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                        <Users className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium text-foreground">No customers found</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        {searchQuery ? "Try adjusting your search query" : "Get started by adding your first customer"}
                    </p>
                </div>
            ) : (
                <div className="rounded-md border border-border bg-card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/50 text-muted-foreground font-medium">
                                <tr>
                                    <th className="px-4 py-3">Customer Name</th>
                                    <th className="px-4 py-3">Phone</th>
                                    <th className="px-4 py-3">Email</th>
                                    <th className="px-4 py-3">Outstanding</th>
                                    <th className="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {filteredCustomers.map((customer) => (
                                    <tr key={customer.id} className="hover:bg-muted/50 transition-colors">
                                        <td className="px-4 py-3 font-medium text-foreground">{customer.customer_name}</td>
                                        <td className="px-4 py-3 text-muted-foreground flex items-center gap-2">
                                            <Phone className="h-3 w-3" />
                                            {customer.customer_phone}
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            {customer.customer_email ? (
                                                <div className="flex items-center gap-2">
                                                    <Mail className="h-3 w-3" />
                                                    {customer.customer_email}
                                                </div>
                                            ) : "-"}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`font-medium ${customer.current_outstanding > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                                ₹ {customer.current_outstanding}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <button className="p-2 hover:bg-accent rounded-full transition-colors">
                                                <MoreVertical className="h-4 w-4 text-muted-foreground" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
