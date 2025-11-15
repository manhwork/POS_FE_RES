"use client";

import { useState, useEffect, useCallback } from "react";
import {
    Table,
    TableJSON,
    calculateTax,
    calculateTotal,
    Product,
    Category,
} from "@/lib/data";

export interface OrderItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

export interface TableOrder {
    id: string;
    tableId: string;
    items: OrderItem[];
    startTime: Date;
    status: "active" | "completed" | "cancelled";
    subtotal: number;
    tax: number;
    total: number;
}

// Convert JSON data to runtime data with proper Date objects
const convertTableData = (jsonTables: TableJSON[]): Table[] => {
    return jsonTables.map((table) => ({
        ...table,
        currentOrder: table.currentOrder
            ? {
                  ...table.currentOrder,
                  startTime: new Date(table.currentOrder.startTime),
              }
            : undefined,
        reservation: table.reservation
            ? {
                  ...table.reservation,
                  time: new Date(table.reservation.time),
              }
            : undefined,
    }));
};

export function useTables() {
    const [tables, setTables] = useState<Table[]>([]);
    const [zones, setZones] = useState<any[]>([]);
    const [tableStatuses, setTableStatuses] = useState<any[]>([]);
    const [menu, setMenu] = useState<{
        products: Product[];
        categories: Category[];
    }>({ products: [], categories: [] });

    const [orders, setOrders] = useState<Map<string, TableOrder>>(new Map());
    const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [tablesRes, menuRes] = await Promise.all([
                fetch("/api/tables"),
                fetch("/api/menu"),
            ]);

            const tablesData = await tablesRes.json();
            const menuData = await menuRes.json();

            setTables(convertTableData(tablesData.tables));
            setZones(tablesData.zones);
            setTableStatuses(tablesData.tableStatuses);
            setMenu({
                products: menuData.products,
                categories: menuData.categories,
            });
        } catch (error) {
            console.error("Failed to fetch initial data:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const selectedTable = selectedTableId
        ? tables.find((t) => t.id === selectedTableId) || null
        : null;
    const selectedOrder = selectedTableId ? orders.get(selectedTableId) : null;

    const persistTables = useCallback(
        async (updatedTables: Table[]) => {
            try {
                const tablesToSave = updatedTables.map((table) => ({
                    ...table,
                    currentOrder: table.currentOrder
                        ? {
                              ...table.currentOrder,
                              startTime:
                                  table.currentOrder.startTime.toISOString(),
                          }
                        : undefined,
                    reservation: table.reservation
                        ? {
                              ...table.reservation,
                              time: table.reservation.time.toISOString(),
                          }
                        : undefined,
                }));

                await fetch("/api/tables", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        tables: tablesToSave,
                        zones,
                        tableStatuses,
                    }),
                });
            } catch (error) {
                console.error("Failed to save tables:", error);
            }
        },
        [zones, tableStatuses]
    );

    // Update table status based on current orders and persist changes
    useEffect(() => {
        let hasChanged = false;
        const newTables = tables.map((table) => {
            const order = orders.get(table.id);
            if (
                order &&
                order.status === "active" &&
                table.status !== "occupied"
            ) {
                hasChanged = true;
                return {
                    ...table,
                    status: "occupied" as const,
                    currentOrder: {
                        id: order.id,
                        startTime: order.startTime,
                        totalAmount: order.total,
                        itemCount: order.items.reduce(
                            (sum, item) => sum + item.quantity,
                            0
                        ),
                    },
                };
            } else if (
                table.status === "occupied" &&
                (!order || order.status !== "active")
            ) {
                hasChanged = true;
                return {
                    ...table,
                    status: "available" as const,
                    currentOrder: undefined,
                };
            }
            return table;
        });

        if (hasChanged && tables.length > 0) {
            setTables(newTables);
            persistTables(newTables);
        }
    }, [orders, tables, persistTables]);

    const startOrder = (tableId: string) => {
        const newOrder: TableOrder = {
            id: `order-${Date.now()}`,
            tableId,
            items: [],
            startTime: new Date(),
            status: "active",
            subtotal: 0,
            tax: 0,
            total: 0,
        };

        setOrders((prev) => new Map(prev).set(tableId, newOrder));
        setSelectedTableId(tableId);
    };

    const addItemToOrder = (tableId: string, item: OrderItem) => {
        setOrders((prev) => {
            const newOrders = new Map(prev);
            const order = newOrders.get(tableId);

            if (!order) {
                // Create new order if doesn't exist
                const newOrder: TableOrder = {
                    id: `order-${Date.now()}`,
                    tableId,
                    items: [item],
                    startTime: new Date(),
                    status: "active",
                    subtotal: item.price * item.quantity,
                    tax: calculateTax(item.price * item.quantity),
                    total: calculateTotal(item.price * item.quantity),
                };
                newOrders.set(tableId, newOrder);
            } else {
                const existingItemIndex = order.items.findIndex(
                    (i) => i.id === item.id
                );
                let updatedItems: OrderItem[];

                if (existingItemIndex >= 0) {
                    // Update existing item quantity
                    updatedItems = order.items.map((i, index) =>
                        index === existingItemIndex
                            ? { ...i, quantity: i.quantity + item.quantity }
                            : i
                    );
                } else {
                    // Add new item
                    updatedItems = [...order.items, item];
                }

                const subtotal = updatedItems.reduce(
                    (sum, i) => sum + i.price * i.quantity,
                    0
                );
                const tax = calculateTax(subtotal);
                const total = calculateTotal(subtotal);

                const updatedOrder: TableOrder = {
                    ...order,
                    items: updatedItems,
                    subtotal,
                    tax,
                    total,
                };

                newOrders.set(tableId, updatedOrder);
            }

            return newOrders;
        });
    };

    const updateOrderItem = (
        tableId: string,
        itemId: string,
        quantity: number
    ) => {
        setOrders((prev) => {
            const newOrders = new Map(prev);
            const order = newOrders.get(tableId);

            if (!order) return prev;

            let updatedItems: OrderItem[];

            if (quantity === 0) {
                updatedItems = order.items.filter((item) => item.id !== itemId);
            } else {
                updatedItems = order.items.map((item) =>
                    item.id === itemId ? { ...item, quantity } : item
                );
            }

            const subtotal = updatedItems.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
            );
            const tax = calculateTax(subtotal);
            const total = calculateTotal(subtotal);

            const updatedOrder: TableOrder = {
                ...order,
                items: updatedItems,
                subtotal,
                tax,
                total,
            };

            newOrders.set(tableId, updatedOrder);
            return newOrders;
        });
    };

    const removeOrderItem = (tableId: string, itemId: string) => {
        updateOrderItem(tableId, itemId, 0);
    };

    const completeOrder = (tableId: string) => {
        setOrders((prev) => {
            const newOrders = new Map(prev);
            const order = newOrders.get(tableId);

            if (order) {
                // Immediately remove the order
                newOrders.delete(tableId);
            }

            return newOrders;
        });
    };

    const cancelOrder = (tableId: string) => {
        setOrders((prev) => {
            const newOrders = new Map(prev);
            newOrders.delete(tableId);
            return newOrders;
        });
    };

    const selectTable = (table: Table) => {
        setSelectedTableId(table.id);

        // If table is available and no order exists, start a new order
        if (table.status === "available" && !orders.has(table.id)) {
            startOrder(table.id);
        }
    };

    const clearSelection = () => {
        setSelectedTableId(null);
    };

    return {
        tables,
        zones,
        tableStatuses,
        menu,
        orders,
        selectedTable,
        selectedOrder,
        selectedTableId,
        isLoading,
        fetchData,
        startOrder,
        addItemToOrder,
        updateOrderItem,
        removeOrderItem,
        completeOrder,
        cancelOrder,
        selectTable,
        clearSelection,
    } as const;
}
