import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import type { Promotion } from "@/lib/data";

const dataFilePath = path.join(process.cwd(), "data/promotions.json");

async function readPromotions(): Promise<Promotion[]> {
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

/**
 * Handles GET requests to fetch all promotions.
 */
export async function GET() {
    try {
        const promotions = await readPromotions();
        return NextResponse.json(promotions);
    } catch (error: any) {
        console.error("Error reading promotions data file:", error);
        return NextResponse.json(
            { message: "Error reading promotions data file." },
            { status: 500 }
        );
    }
}
