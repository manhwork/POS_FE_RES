"use client";

import { useState, useEffect } from "react";
import { Table } from "@/components/pos/table-grid";

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

// Sample data for restaurant tables
const initialTables: Table[] = [
  {
    id: "table-1",
    name: "Bàn 1",
    capacity: 2,
    status: "available",
  },
  {
    id: "table-2",
    name: "Bàn 2",
    capacity: 4,
    status: "occupied",
    currentOrder: {
      id: "order-1",
      startTime: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      totalAmount: 250000,
      itemCount: 3,
    },
  },
  {
    id: "table-3",
    name: "Bàn 3",
    capacity: 2,
    status: "available",
  },
  {
    id: "table-4",
    name: "Bàn 4",
    capacity: 6,
    status: "reserved",
  },
  {
    id: "table-5",
    name: "Bàn 5",
    capacity: 4,
    status: "occupied",
    currentOrder: {
      id: "order-2",
      startTime: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
      totalAmount: 180000,
      itemCount: 2,
    },
  },
  {
    id: "table-6",
    name: "Bàn 6",
    capacity: 2,
    status: "cleaning",
  },
  {
    id: "table-7",
    name: "Bàn 7",
    capacity: 4,
    status: "available",
  },
  {
    id: "table-8",
    name: "Bàn 8",
    capacity: 8,
    status: "available",
  },
  {
    id: "table-9",
    name: "Bàn 9",
    capacity: 2,
    status: "occupied",
    currentOrder: {
      id: "order-3",
      startTime: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
      totalAmount: 320000,
      itemCount: 5,
    },
  },
  {
    id: "table-10",
    name: "Bàn 10",
    capacity: 6,
    status: "available",
  },
];

export function useTables() {
  const [tables, setTables] = useState<Table[]>(initialTables);
  const [orders, setOrders] = useState<Map<string, TableOrder>>(new Map());
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);

  const selectedTable = selectedTableId
    ? tables.find((t) => t.id === selectedTableId) || null
    : null;
  const selectedOrder = selectedTableId ? orders.get(selectedTableId) : null;

  // Update table status based on current orders
  useEffect(() => {
    setTables((prevTables) =>
      prevTables.map((table) => {
        const order = orders.get(table.id);
        if (order && order.status === "active") {
          return {
            ...table,
            status: "occupied" as const,
            currentOrder: {
              id: order.id,
              startTime: order.startTime,
              totalAmount: order.total,
              itemCount: order.items.reduce(
                (sum, item) => sum + item.quantity,
                0,
              ),
            },
          };
        } else if (table.status === "occupied" && !order) {
          return {
            ...table,
            status: "available" as const,
            currentOrder: undefined,
          };
        }
        return table;
      }),
    );
  }, [orders]);

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
          tax: item.price * item.quantity * 0.1, // 10% tax
          total: item.price * item.quantity * 1.1,
        };
        newOrders.set(tableId, newOrder);
      } else {
        const existingItemIndex = order.items.findIndex(
          (i) => i.id === item.id,
        );
        let updatedItems: OrderItem[];

        if (existingItemIndex >= 0) {
          // Update existing item quantity
          updatedItems = order.items.map((i, index) =>
            index === existingItemIndex
              ? { ...i, quantity: i.quantity + item.quantity }
              : i,
          );
        } else {
          // Add new item
          updatedItems = [...order.items, item];
        }

        const subtotal = updatedItems.reduce(
          (sum, i) => sum + i.price * i.quantity,
          0,
        );
        const tax = subtotal * 0.1;
        const total = subtotal + tax;

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
    quantity: number,
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
          item.id === itemId ? { ...item, quantity } : item,
        );
      }

      const subtotal = updatedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );
      const tax = subtotal * 0.1;
      const total = subtotal + tax;

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
        newOrders.set(tableId, { ...order, status: "completed" });
        // Remove completed order after a short delay to update table status
        setTimeout(() => {
          setOrders((current) => {
            const updated = new Map(current);
            updated.delete(tableId);
            return updated;
          });
        }, 100);
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
    orders,
    selectedTable,
    selectedOrder,
    selectedTableId,
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
