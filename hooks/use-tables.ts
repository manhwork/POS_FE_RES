"use client";

import { useState, useEffect, useCallback } from "react";
import {
    Table,
    TableJSON,
    calculateTax,
    calculateTotal,
    Product,
    Category,
    Order,
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
    guestCount: number;
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

            const initialTables = convertTableData(tablesData.tables);
            const initialOrders = new Map<string, TableOrder>();

            initialTables.forEach((table) => {
                if (table.currentOrder) {
                    initialOrders.set(table.id, {
                        id: table.currentOrder.id,
                        tableId: table.id,
                        guestCount: 0, // This data is missing from tables.json, defaulting to 0
                        items: [], // This data is also missing, starting with an empty cart
                        startTime: table.currentOrder.startTime,
                        status: "active",
                        subtotal: table.currentOrder.totalAmount,
                        tax: 0, // Missing data
                        total: table.currentOrder.totalAmount,
                    });
                }
            });

            setTables(initialTables);
            setOrders(initialOrders);
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

    const startOrder = (tableId: string, guestCount: number) => {
        const newOrder: TableOrder = {
            id: `order-${Date.now()}`,
            tableId,
            guestCount,
            items: [],
            startTime: new Date(),
            status: "active",
            subtotal: 0,
            tax: 0,
            total: 0,
        };

        setOrders((prev) => {
            const newOrders = new Map(prev);
            newOrders.set(tableId, newOrder);
            return newOrders;
        });
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
                    guestCount: 1, // Default to 1 guest if order is created implicitly
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

    const sendOrderToKitchen = async (tableId: string): Promise<boolean> => {
        const order = orders.get(tableId);
        const table = tables.find((t) => t.id === tableId);

        if (!order || !table) {
            console.error("Order or table not found to send to kitchen");
            return false;
        }

        const orderPayload = {
            id: order.id,
            tableId: order.tableId,
            tableName: table.name,
            guestCount: order.guestCount,
            items: order.items,
            subtotal: order.subtotal,
            tax: order.tax,
            total: order.total,
        };

        try {
            const response = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(orderPayload),
            });

            if (!response.ok) {
                throw new Error("Failed to send order to kitchen");
            }

            // Clear the local order from the POS state, as it's now managed in the Orders page
            // Note: We are NOT changing the table status here. It remains 'occupied'.
            // The local order is cleared so the cart becomes empty.
            setOrders((prev) => {
                const newOrders = new Map(prev);
                const existingOrder = newOrders.get(tableId);
                if (existingOrder) {
                    // Create a new order object to ensure React detects the change
                    const updatedOrder = {
                        ...existingOrder,
                        items: [],
                        subtotal: 0,
                        tax: 0,
                        total: 0,
                    };
                    newOrders.set(tableId, updatedOrder);
                }
                return newOrders;
            });

            return true;
        } catch (error) {
            console.error("Error sending order to kitchen:", error);
            return false;
        }
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
        // Logic to open guest count modal will be in the page component
        // if (table.status === "available" && !orders.has(table.id)) {
        //     startOrder(table.id);
        // }
    };

    const clearSelection = () => {
        setSelectedTableId(null);
    };

    const clearTable = (tableId: string) => {
        setOrders((prev) => {
            const newOrders = new Map(prev);
            newOrders.delete(tableId);
            return newOrders;
        });
        // The useEffect will handle updating the table status to 'available' and persisting it.
        clearSelection();
    };

    const makeReservation = async (
        tableId: string,
        reservationData: {
            customerName: string;
            phone: string;
            time: string;
            note: string;
        }
    ) => {
        const tableIndex = tables.findIndex((t) => t.id === tableId);
        if (tableIndex > -1) {
            const newTables = [...tables];
            newTables[tableIndex].status = "reserved";
            newTables[tableIndex].reservation = {
                ...reservationData,
                time: new Date(reservationData.time),
            };

            await persistTables(newTables);
            setTables(newTables);
            return true;
        }
        return false;
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
        sendOrderToKitchen,
        cancelOrder,
        selectTable,
        clearSelection,
        clearTable,
        makeReservation,
    } as const;
}
