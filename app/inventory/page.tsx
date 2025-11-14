"use client";

import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import {
  InventoryTable,
  type InventoryItem,
} from "@/components/inventory/inventory-table";
import { InventoryStats } from "@/components/inventory/inventory-stats";
import { InventoryFilters } from "@/components/inventory/inventory-filters";
import { StockAdjustmentModal } from "@/components/inventory/stock-adjustment-modal";
import {
  InventoryHistoryModal,
  type StockMovement,
} from "@/components/inventory/inventory-history-modal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Sample inventory data
const sampleInventory: InventoryItem[] = [
  {
    id: "1",
    name: "Premium Coffee",
    sku: "BEV-COFFEE01",
    category: "Beverages",
    currentStock: 25,
    reorderPoint: 50,
    maxStock: 200,
    unitCost: 2.5,
    totalValue: 62.5,
    lastUpdated: "2024-01-15T10:00:00Z",
    status: "low-stock",
  },
  {
    id: "2",
    name: "Club Sandwich",
    sku: "FOO-SAND01",
    category: "Food",
    currentStock: 45,
    reorderPoint: 20,
    maxStock: 100,
    unitCost: 6.5,
    totalValue: 292.5,
    lastUpdated: "2024-01-14T14:30:00Z",
    status: "in-stock",
  },
  {
    id: "3",
    name: "Blueberry Muffin",
    sku: "DES-MUFF01",
    category: "Desserts",
    currentStock: 0,
    reorderPoint: 15,
    maxStock: 50,
    unitCost: 3.0,
    totalValue: 0,
    lastUpdated: "2024-01-13T09:15:00Z",
    status: "out-of-stock",
  },
  {
    id: "4",
    name: "Green Tea",
    sku: "BEV-TEA01",
    category: "Beverages",
    currentStock: 75,
    reorderPoint: 30,
    maxStock: 150,
    unitCost: 2.0,
    totalValue: 150,
    lastUpdated: "2024-01-12T16:45:00Z",
    status: "in-stock",
  },
  {
    id: "5",
    name: "Caesar Salad",
    sku: "FOO-SAL01",
    category: "Food",
    currentStock: 12,
    reorderPoint: 15,
    maxStock: 40,
    unitCost: 8.5,
    totalValue: 102,
    lastUpdated: "2024-01-11T11:20:00Z",
    status: "low-stock",
  },
];

// Sample stock movement history data
const sampleStockMovements: Record<string, StockMovement[]> = {
  "1": [
    {
      id: "1",
      date: "2024-01-15T10:00:00Z",
      type: "remove",
      quantity: 25,
      previousStock: 50,
      newStock: 25,
      reason: "Daily sales",
      user: "John Doe",
      notes: "Morning rush sales",
    },
    {
      id: "2",
      date: "2024-01-14T14:30:00Z",
      type: "restock",
      quantity: 100,
      previousStock: 20,
      newStock: 120,
      reason: "Weekly restock",
      user: "Admin",
      notes: "Supplier delivery",
    },
    {
      id: "3",
      date: "2024-01-13T09:15:00Z",
      type: "adjustment",
      quantity: 5,
      previousStock: 25,
      newStock: 20,
      reason: "Inventory count correction",
      user: "Manager",
      notes: "Physical count discrepancy",
    },
  ],
  "2": [
    {
      id: "4",
      date: "2024-01-14T14:30:00Z",
      type: "sale",
      quantity: 15,
      previousStock: 60,
      newStock: 45,
      reason: "Customer orders",
      user: "Cashier 1",
    },
  ],
};

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>(sampleInventory);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [isAdjustmentModalOpen, setIsAdjustmentModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedItemForHistory, setSelectedItemForHistory] =
    useState<InventoryItem | null>(null);
  const { toast } = useToast();

  const filteredInventory = useMemo(() => {
    return inventory.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        categoryFilter === "All Categories" || item.category === categoryFilter;
      const matchesStatus =
        statusFilter === "All Status" || item.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [inventory, searchTerm, categoryFilter, statusFilter]);

  const handleAdjustStock = (id: string, type: "add" | "remove") => {
    const item = inventory.find((i) => i.id === id);
    if (item) {
      setSelectedItem(item);
      setIsAdjustmentModalOpen(true);
    }
  };

  const handleSaveAdjustment = (adjustment: {
    itemId: string;
    type: "add" | "remove";
    quantity: number;
    reason: string;
    notes?: string;
  }) => {
    setInventory((items) =>
      items.map((item) => {
        if (item.id === adjustment.itemId) {
          const newStock =
            adjustment.type === "add"
              ? item.currentStock + adjustment.quantity
              : Math.max(0, item.currentStock - adjustment.quantity);

          const newStatus: InventoryItem["status"] =
            newStock === 0
              ? "out-of-stock"
              : newStock <= item.reorderPoint
                ? "low-stock"
                : "in-stock";

          return {
            ...item,
            currentStock: newStock,
            totalValue: newStock * item.unitCost,
            status: newStatus,
            lastUpdated: new Date().toISOString(),
          };
        }
        return item;
      }),
    );

    toast({
      title: "Stock adjusted",
      description: `${adjustment.type === "add" ? "Added" : "Removed"} ${adjustment.quantity} units`,
    });
  };

  const handleViewHistory = (id: string) => {
    const item = inventory.find((i) => i.id === id);
    if (item) {
      setSelectedItemForHistory(item);
      setIsHistoryModalOpen(true);
    }
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("All Categories");
    setStatusFilter("All Status");
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

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/*<div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Inventory Management</h1>
            <p className="text-muted-foreground">
              Track and manage your stock levels
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleImport}>
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>*/}

        {/*<InventoryStats items={inventory} />*/}

        {/*<Card>
          <CardHeader>
            <CardTitle>Inventory Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <InventoryFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              categoryFilter={categoryFilter}
              onCategoryChange={setCategoryFilter}
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
              onClearFilters={handleClearFilters}
            />
          </CardContent>
        </Card>*/}

        <Card>
          <CardHeader>
            <CardTitle>Inventory Items ({filteredInventory.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <InventoryTable
              items={filteredInventory}
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

        <InventoryHistoryModal
          isOpen={isHistoryModalOpen}
          onClose={() => setIsHistoryModalOpen(false)}
          itemName={selectedItemForHistory?.name || ""}
          itemSku={selectedItemForHistory?.sku || ""}
          movements={
            selectedItemForHistory
              ? sampleStockMovements[selectedItemForHistory.id] || []
              : []
          }
        />
      </div>
    </DashboardLayout>
  );
}
