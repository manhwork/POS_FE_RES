import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import type { Order } from "@/lib/data";

const dataFilePath = path.join(process.cwd(), "data/orders.json");

async function readOrders(): Promise<Order[]> {
    try {
        const fileContents = await fs.readFile(dataFilePath, "utf8");
        return JSON.parse(fileContents);
    } catch (error: any) {
        if (error.code === "ENOENT") {
            return [];
        }
        throw error;
    }
}

async function writeOrders(data: Order[]) {
    const updatedFileContents = JSON.stringify(data, null, 2);
    await fs.writeFile(dataFilePath, updatedFileContents, "utf8");
}

/**
 * Handles GET requests to fetch all orders.
 */
export async function GET() {
    try {
        const orders = await readOrders();
        return NextResponse.json(orders);
    } catch (error: any) {
        console.error("Error reading orders data file:", error);
        return NextResponse.json(
            { message: "Error reading orders data file." },
            { status: 500 }
        );
    }
}

/**
 * Handles POST requests to add a new order.
 */
export async function POST(request: Request) {
    try {
        const newOrderData = await request.json();
        const orders = await readOrders();

        const newOrder: Order = {
            ...newOrderData,
            status: "pending", // Always start as pending
            startTime: new Date().toISOString(),
        };

        orders.push(newOrder);
        await writeOrders(orders);

        return NextResponse.json({
            message: "Order created successfully.",
            order: newOrder,
        });
    } catch (error: any) {
        console.error("Error in POST /api/orders:", error);
        return NextResponse.json(
            { message: "Error creating order." },
            { status: 500 }
        );
    }
}

/**
 * Handles PATCH requests to update an order's status.
 */
export async function PATCH(request: Request) {
    try {
        const { id, status, paymentMethod, total, appliedPromotionId } =
            await request.json();
        if (!id || !status) {
            return NextResponse.json(
                { message: "Missing order ID or status." },
                { status: 400 }
            );
        }

        const orders = await readOrders();
        const orderIndex = orders.findIndex((o) => o.id === id);

        if (orderIndex === -1) {
            return NextResponse.json(
                { message: "Order not found." },
                { status: 404 }
            );
        }

        orders[orderIndex].status = status;
        if (status === "completed") {
            orders[orderIndex].endTime = new Date().toISOString();
            if (paymentMethod) {
                orders[orderIndex].paymentMethod = paymentMethod;
            }
            if (total !== undefined) {
                orders[orderIndex].total = total;
            }
            if (appliedPromotionId) {
                orders[orderIndex].appliedPromotionId = appliedPromotionId;
            }
        }

        await writeOrders(orders);

        return NextResponse.json({
            message: "Order updated successfully.",
            order: orders[orderIndex],
        });
    } catch (error: any) {
        console.error("Error in PATCH /api/orders:", error);
        return NextResponse.json(
            { message: "Error updating order." },
            { status: 500 }
        );
    }
}
