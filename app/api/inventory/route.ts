import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import type { InventoryItem } from "@/lib/data";

const dataFilePath = path.join(process.cwd(), "data/inventory.json");

async function readInventoryData(): Promise<InventoryItem[]> {
    try {
        const fileContents = await fs.readFile(dataFilePath, "utf8");
        return JSON.parse(fileContents);
    } catch (error: any) {
        if (error.code === "ENOENT") {
            return []; // Return empty array if file doesn't exist
        }
        throw error;
    }
}

async function writeInventoryData(data: InventoryItem[]) {
    const updatedFileContents = JSON.stringify(data, null, 2);
    await fs.writeFile(dataFilePath, updatedFileContents, "utf8");
}

/**
 * Handles GET requests to fetch all inventory items.
 */
export async function GET() {
    try {
        const inventory = await readInventoryData();
        return NextResponse.json(inventory);
    } catch (error: any) {
        console.error("Error reading inventory data file:", error);
        return NextResponse.json(
            { message: "Error reading inventory data file." },
            { status: 500 }
        );
    }
}

/**
 * Handles POST requests to update the entire inventory list.
 * This is useful for syncing with the menu.
 */
export async function POST(request: Request) {
    try {
        const newInventoryData = await request.json();
        // Basic validation
        if (!Array.isArray(newInventoryData)) {
            return NextResponse.json(
                { message: "Invalid data format. Expected an array." },
                { status: 400 }
            );
        }
        await writeInventoryData(newInventoryData);
        return NextResponse.json({
            message: "Inventory data updated successfully.",
        });
    } catch (error: any) {
        console.error("Error writing inventory data file:", error);
        return NextResponse.json(
            { message: "Error writing inventory data file." },
            { status: 500 }
        );
    }
}

/**
 * Handles PATCH requests to update a single inventory item or multiple items.
 * Can be used for stock adjustments or sales.
 */
export async function PATCH(request: Request) {
    try {
        const updates: { id: string; change: number }[] = await request.json();
        if (!Array.isArray(updates)) {
            return NextResponse.json(
                {
                    message:
                        "Invalid data format. Expected an array of updates.",
                },
                { status: 400 }
            );
        }

        const inventory = await readInventoryData();
        const inventoryMap = new Map(inventory.map((item) => [item.id, item]));

        for (const update of updates) {
            const item = inventoryMap.get(update.id);
            if (item) {
                item.currentStock += update.change;
                item.lastUpdated = new Date().toISOString();
            }
        }

        const updatedInventory = Array.from(inventoryMap.values());
        await writeInventoryData(updatedInventory);

        return NextResponse.json({
            message: "Inventory updated successfully.",
            data: updatedInventory,
        });
    } catch (error: any) {
        console.error("Error patching inventory data file:", error);
        return NextResponse.json(
            { message: "Error patching inventory data file." },
            { status: 500 }
        );
    }
}
