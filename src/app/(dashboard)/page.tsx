"use client";

import { useEffect, useState } from "react";
import { transactionService, useAuth, storageService } from "@shared";
import {
    ArrowUpRight,
    ArrowDownLeft,
    DollarSign,
    Package,
    Loader2
} from "lucide-react";
import { formatUtils } from "@shared";

export default function DashboardPage() {
    const { currentWarehouse, isLoading: isAuthLoading } = useAuth();
    const [transactions, setTransactions] = useState<any[]>([]);
    const [stats, setStats] = useState({
        totalInflow: 0,
        totalOutflow: 0,
        activeInventory: 0,
        revenue: 0
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!currentWarehouse?.id) {
                setIsLoading(false);
                return;
            }

            try {
                const [txns, lots] = await Promise.all([
                    transactionService.getTransactions(currentWarehouse.id),
                    storageService.getLotUtilization(currentWarehouse.id)
                ]);

                setTransactions(txns.slice(0, 5)); // Get top 5 recent

                // Calculate stats
                let inflow = 0;
                let outflow = 0;
                let revenue = 0;

                txns.forEach(txn => {
                    if (txn.transaction_type === 'inflow') {
                        inflow += txn.total_amount || 0;
                    } else {
                        outflow += txn.total_amount || 0;
                        revenue += txn.total_amount || 0; // Assuming revenue is outflow amount for now
                    }
                });

                const activeInventory = lots.reduce((acc, lot) => acc + (lot.current_occupancy || 0), 0);

                setStats({
                    totalInflow: inflow,
                    totalOutflow: outflow,
                    activeInventory,
                    revenue
                });

            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (!isAuthLoading) {
            fetchData();
        }
    }, [currentWarehouse, isAuthLoading]);

    if (isAuthLoading || isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!currentWarehouse) {
        return (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
                <Package className="h-12 w-12 text-muted-foreground" />
                <h2 className="text-xl font-semibold">No Warehouse Selected</h2>
                <p className="text-muted-foreground">Please contact your administrator to assign a warehouse.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
                        New Transaction
                    </button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Total Inflow"
                    value={formatUtils.formatCurrency(stats.totalInflow)}
                    icon={ArrowDownLeft}
                    trend="+12.5%"
                    trendUp={true}
                />
                <StatsCard
                    title="Total Outflow"
                    value={formatUtils.formatCurrency(stats.totalOutflow)}
                    icon={ArrowUpRight}
                    trend="+4.3%"
                    trendUp={true}
                />
                <StatsCard
                    title="Active Inventory"
                    value={`${stats.activeInventory} Bags`}
                    icon={Package}
                    trend="-2.1%"
                    trendUp={false}
                />
                <StatsCard
                    title="Revenue"
                    value={formatUtils.formatCurrency(stats.revenue)}
                    icon={DollarSign}
                    trend="+8.2%"
                    trendUp={true}
                />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="bg-card rounded-xl border border-border p-6">
                    <h2 className="text-lg font-semibold text-foreground mb-4">Recent Transactions</h2>
                    <div className="space-y-4">
                        {transactions.length === 0 ? (
                            <p className="text-muted-foreground text-sm">No recent transactions</p>
                        ) : (
                            transactions.map((txn) => (
                                <div key={txn.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${txn.transaction_type === 'inflow' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                                            {txn.transaction_type === 'inflow' ? <ArrowDownLeft className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-foreground">
                                                {txn.customers?.customer_name || 'Unknown Customer'}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(txn.transaction_date).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-foreground">
                                            {formatUtils.formatCurrency(txn.total_amount)}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {txn.item_quantity} {txn.item_unit}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="bg-card rounded-xl border border-border p-6">
                    <h2 className="text-lg font-semibold text-foreground mb-4">Warehouse Status</h2>
                    <div className="space-y-4">
                        <div className="p-4 bg-muted/30 rounded-lg border border-border">
                            <div className="flex justify-between mb-2">
                                <span className="text-sm font-medium text-foreground">Storage Capacity</span>
                                <span className="text-sm text-muted-foreground">
                                    {(currentWarehouse.warehouse_capacity as any)?.total_capacity ?
                                        Math.round((stats.activeInventory / (currentWarehouse.warehouse_capacity as any).total_capacity) * 100) : 0}% Full
                                </span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary transition-all duration-500"
                                    style={{ width: `${(currentWarehouse.warehouse_capacity as any)?.total_capacity ? Math.round((stats.activeInventory / (currentWarehouse.warehouse_capacity as any).total_capacity) * 100) : 0}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-muted/30 rounded-lg border border-border text-center">
                                <p className="text-2xl font-bold text-foreground">
                                    {transactions.filter(t => t.status === 'pending').length}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">Pending Orders</p>
                            </div>
                            <div className="p-4 bg-muted/30 rounded-lg border border-border text-center">
                                <p className="text-2xl font-bold text-foreground">
                                    {/* Placeholder for low stock items */}
                                    -
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">Low Stock Items</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatsCard({ title, value, icon: Icon, trend, trendUp }: any) {
    return (
        <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">{title}</p>
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Icon className="h-4 w-4" />
                </div>
            </div>
            <div className="mt-4">
                <h3 className="text-2xl font-bold text-foreground">{value}</h3>
                <p className={`text-xs mt-1 flex items-center ${trendUp ? 'text-green-500' : 'text-red-500'}`}>
                    {trend}
                    <span className="text-muted-foreground ml-1">from last month</span>
                </p>
            </div>
        </div>
    );
}
