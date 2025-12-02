"use client";

import { useState, useEffect } from "react";
import { useAuth, transactionService, formatUtils } from "@shared";
import { Loader2 } from "lucide-react";

export default function ReportsPage() {
    const { currentWarehouse } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [reportData, setReportData] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        averageOrderValue: 0
    });

    useEffect(() => {
        const fetchReportData = async () => {
            if (!currentWarehouse?.id) {
                setIsLoading(false);
                return;
            }

            try {
                const transactions = await transactionService.getTransactions(currentWarehouse.id);

                let revenue = 0;
                let orders = 0;

                transactions.forEach((txn: any) => {
                    if (txn.transaction_type === 'outflow') {
                        revenue += txn.total_amount || 0;
                        orders++;
                    }
                });

                setReportData({
                    totalRevenue: revenue,
                    totalOrders: orders,
                    averageOrderValue: orders > 0 ? revenue / orders : 0
                });

            } catch (error) {
                console.error("Error fetching report data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchReportData();
    }, [currentWarehouse]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-foreground">Reports & Analytics</h1>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-background border border-input rounded-md text-sm font-medium hover:bg-accent transition-colors">
                        Download PDF
                    </button>
                    <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
                        Export CSV
                    </button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="bg-card rounded-xl border border-border p-6">
                    <h3 className="text-sm font-medium text-muted-foreground">Total Revenue</h3>
                    <p className="text-2xl font-bold text-foreground mt-2">
                        {formatUtils.formatCurrency(reportData.totalRevenue)}
                    </p>
                    <p className="text-xs text-green-500 mt-1 flex items-center">
                        +12.5% <span className="text-muted-foreground ml-1">from last month</span>
                    </p>
                </div>
                <div className="bg-card rounded-xl border border-border p-6">
                    <h3 className="text-sm font-medium text-muted-foreground">Total Orders</h3>
                    <p className="text-2xl font-bold text-foreground mt-2">{reportData.totalOrders}</p>
                    <p className="text-xs text-green-500 mt-1 flex items-center">
                        +8.2% <span className="text-muted-foreground ml-1">from last month</span>
                    </p>
                </div>
                <div className="bg-card rounded-xl border border-border p-6">
                    <h3 className="text-sm font-medium text-muted-foreground">Average Order Value</h3>
                    <p className="text-2xl font-bold text-foreground mt-2">
                        {formatUtils.formatCurrency(reportData.averageOrderValue)}
                    </p>
                    <p className="text-xs text-red-500 mt-1 flex items-center">
                        -2.1% <span className="text-muted-foreground ml-1">from last month</span>
                    </p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="bg-card rounded-xl border border-border p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-6">Revenue Trend</h3>
                    <div className="h-[300px] flex items-end justify-between gap-2 px-4">
                        {[40, 65, 45, 80, 55, 90, 75].map((height, i) => (
                            <div key={i} className="w-full bg-primary/10 rounded-t-sm relative group">
                                <div
                                    className="absolute bottom-0 w-full bg-primary rounded-t-sm transition-all duration-500 group-hover:bg-primary/80"
                                    style={{ height: `${height}%` }}
                                ></div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 text-xs text-muted-foreground px-4">
                        <span>Mon</span>
                        <span>Tue</span>
                        <span>Wed</span>
                        <span>Thu</span>
                        <span>Fri</span>
                        <span>Sat</span>
                        <span>Sun</span>
                    </div>
                </div>

                <div className="bg-card rounded-xl border border-border p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-6">Stock Turnover</h3>
                    <div className="h-[300px] flex items-center justify-center">
                        <div className="relative h-48 w-48 rounded-full border-8 border-muted">
                            <div className="absolute top-0 left-0 h-full w-full rounded-full border-8 border-primary border-t-transparent rotate-45"></div>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-3xl font-bold text-foreground">85%</span>
                                <span className="text-xs text-muted-foreground">Turnover Rate</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
