"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { InventoryTable } from "@/components/inventory/inventory-table";
import { StockAdjustmentModal } from "@/components/inventory/stock-adjustment-modal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Product, InventoryItem } from "@/lib/data";
import { Loader2 } from "lucide-react";

// This is a new combined type for display purposes
export interface DisplayInventoryItem
    extends Product,
        Omit<InventoryItem, "id"> {
    totalValue: number;
    status: "in-stock" | "low-stock" | "out-of-stock";
}

export default function InventoryPage() {
    const [inventory, setInventory] = useState<DisplayInventoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    const [isAdjustmentModalOpen, setIsAdjustmentModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] =
        useState<DisplayInventoryItem | null>(null);

    const fetchDataAndSync = useCallback(async () => {
        setIsLoading(true);
        try {
            const [menuRes, inventoryRes] = await Promise.all([
                fetch("/api/menu"),
                fetch("/api/inventory"),
            ]);

            const menuData = await menuRes.json();
            const inventoryData: InventoryItem[] = await inventoryRes.json();

            const products: Product[] = menuData.products;
            const inventoryMap = new Map(
                inventoryData.map((item) => [item.id, item])
            );
            let inventoryNeedsUpdate = false;

            products.forEach((product) => {
                if (!inventoryMap.has(product.id)) {
                    inventoryMap.set(product.id, {
                        id: product.id,
                        sku: `SKU-${product.id.substring(0, 6).toUpperCase()}`,
                        currentStock: 0,
                        reorderPoint: 10, // Default value
                        unitCost: product.price * 0.4, // Assume a 40% cost margin
                        lastUpdated: new Date().toISOString(),
                    });
                    inventoryNeedsUpdate = true;
                }
            });

            if (inventoryNeedsUpdate) {
                const fullInventory = Array.from(inventoryMap.values());
                await fetch("/api/inventory", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(fullInventory),
                });
            }

            const productMap = new Map(products.map((p) => [p.id, p]));
            const displayInventory = Array.from(inventoryMap.values())
                .map((invItem) => {
                    const product = productMap.get(invItem.id);
                    if (!product) return null; // Should not happen

                    const totalValue = invItem.currentStock * invItem.unitCost;
                    const status: DisplayInventoryItem["status"] =
                        invItem.currentStock === 0
                            ? "out-of-stock"
                            : invItem.currentStock <= invItem.reorderPoint
                            ? "low-stock"
                            : "in-stock";

                    return {
                        ...product,
                        ...invItem,
                        totalValue,
                        status,
                    };
                })
                .filter((item): item is DisplayInventoryItem => item !== null);

            setInventory(displayInventory);
        } catch (error) {
            console.error("Failed to fetch or sync inventory:", error);
            toast({
                title: "Error",
                description: "Could not load inventory data.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchDataAndSync();
    }, [fetchDataAndSync]);

    const handleAdjustStock = (id: string) => {
        const item = inventory.find((i) => i.id === id);
        if (item) {
            setSelectedItem(item);
            setIsAdjustmentModalOpen(true);
        }
    };

    const handleSaveAdjustment = async (adjustment: {
        itemId: string;
        quantity: number;
        reason: string;
    }) => {
        const itemToUpdate = inventory.find((i) => i.id === adjustment.itemId);
        if (!itemToUpdate) return;

        const change = adjustment.quantity - itemToUpdate.currentStock;

        try {
            await fetch("/api/inventory", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify([{ id: adjustment.itemId, change }]),
            });

            toast({
                title: "Stock adjusted",
                description: `Stock for ${itemToUpdate.name} set to ${adjustment.quantity}.`,
            });
            fetchDataAndSync(); // Refresh data
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update stock.",
                variant: "destructive",
            });
        }
    };

    // Dummy handlers for now
    const handleViewHistory = (id: string) => {
        toast({
            title: "Coming soon!",
            description: "Stock history view is not yet implemented.",
        });
    };

    const handleExport = () => {
        toast({
            title: "Exporting inventory",
            description: "Inventory data exported to CSV",
        });
    };

    const handleImport = () => {
        toast({
            title: "Import inventory",
            description: "Bulk import feature coming soon",
        });
    };

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="h-full flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="p-6 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Inventory Items ({inventory.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <InventoryTable
                            items={inventory}
                            onAdjustStock={handleAdjustStock}
                            onViewHistory={handleViewHistory}
                        />
                    </CardContent>
                </Card>

                <StockAdjustmentModal
                    isOpen={isAdjustmentModalOpen}
                    onClose={() => setIsAdjustmentModalOpen(false)}
                    onSave={handleSaveAdjustment}
                    item={selectedItem}
                />
            </div>
        </DashboardLayout>
    );
}
