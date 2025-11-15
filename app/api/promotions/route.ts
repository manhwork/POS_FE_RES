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

async function writePromotions(data: Promotion[]) {
    const updatedFileContents = JSON.stringify(data, null, 2);
    await fs.writeFile(dataFilePath, updatedFileContents, "utf8");
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

/**
 * Handles POST requests to create a new promotion.
 */
export async function POST(request: Request) {
    try {
        const newPromotion = await request.json();
        const promotions = await readPromotions();
        promotions.push(newPromotion);
        await writePromotions(promotions);
        return NextResponse.json({
            message: "Promotion created successfully.",
            promotion: newPromotion,
        });
    } catch (error: any) {
        console.error("Error creating promotion:", error);
        return NextResponse.json(
            { message: "Error creating promotion." },
            { status: 500 }
        );
    }
}

/**
 * Handles PUT requests to update an existing promotion.
 */
export async function PUT(request: Request) {
    try {
        const updatedPromotion = await request.json();
        const promotions = await readPromotions();
        const index = promotions.findIndex((p) => p.id === updatedPromotion.id);
        if (index === -1) {
            return NextResponse.json(
                { message: "Promotion not found." },
                { status: 404 }
            );
        }
        promotions[index] = updatedPromotion;
        await writePromotions(promotions);
        return NextResponse.json({
            message: "Promotion updated successfully.",
            promotion: updatedPromotion,
        });
    } catch (error: any) {
        console.error("Error updating promotion:", error);
        return NextResponse.json(
            { message: "Error updating promotion." },
            { status: 500 }
        );
    }
}

/**
 * Handles DELETE requests to delete a promotion.
 */
export async function DELETE(request: Request) {
    try {
        const { id } = await request.json();
        if (!id) {
            return NextResponse.json(
                { message: "Promotion ID is required." },
                { status: 400 }
            );
        }
        let promotions = await readPromotions();
        const initialLength = promotions.length;
        promotions = promotions.filter((p) => p.id !== id);
        if (promotions.length === initialLength) {
            return NextResponse.json(
                { message: "Promotion not found." },
                { status: 404 }
            );
        }
        await writePromotions(promotions);
        return NextResponse.json({
            message: "Promotion deleted successfully.",
        });
    } catch (error: any) {
        console.error("Error deleting promotion:", error);
        return NextResponse.json(
            { message: "Error deleting promotion." },
            { status: 500 }
        );
    }
}
