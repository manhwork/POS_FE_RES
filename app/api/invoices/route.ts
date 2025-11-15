import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import type { Invoice } from "@/lib/data";

const dataFilePath = path.join(process.cwd(), "data/invoices.json");

async function readInvoices(): Promise<Invoice[]> {
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

async function writeInvoices(data: Invoice[]) {
    const updatedFileContents = JSON.stringify(data, null, 2);
    await fs.writeFile(dataFilePath, updatedFileContents, "utf8");
}

/**
 * Handles GET requests to fetch all invoices.
 */
export async function GET() {
    try {
        const invoices = await readInvoices();
        return NextResponse.json(invoices);
    } catch (error: any) {
        console.error("Error reading invoices data file:", error);
        return NextResponse.json(
            { message: "Error reading invoices data file." },
            { status: 500 }
        );
    }
}

/**
 * Handles POST requests to create a new invoice.
 */
export async function POST(request: Request) {
    try {
        const newInvoiceData = await request.json();
        const invoices = await readInvoices();

        const newInvoice: Invoice = {
            ...newInvoiceData,
            id: `INV-${Date.now()}`,
            generatedAt: new Date().toISOString(),
        };

        invoices.push(newInvoice);
        await writeInvoices(invoices);

        return NextResponse.json({
            message: "Invoice created successfully.",
            invoice: newInvoice,
        });
    } catch (error: any) {
        console.error("Error creating invoice:", error);
        return NextResponse.json(
            { message: "Error creating invoice." },
            { status: 500 }
        );
    }
}

/**
 * Handles PUT requests to update an existing invoice.
 */
export async function PUT(request: Request) {
    try {
        const updatedInvoice = await request.json();
        const invoices = await readInvoices();
        const index = invoices.findIndex((inv) => inv.id === updatedInvoice.id);
        if (index === -1) {
            return NextResponse.json(
                { message: "Invoice not found." },
                { status: 404 }
            );
        }
        invoices[index] = updatedInvoice;
        await writeInvoices(invoices);
        return NextResponse.json({
            message: "Invoice updated successfully.",
            invoice: updatedInvoice,
        });
    } catch (error: any) {
        console.error("Error updating invoice:", error);
        return NextResponse.json(
            { message: "Error updating invoice." },
            { status: 500 }
        );
    }
}

/**
 * Handles DELETE requests to delete an invoice.
 */
export async function DELETE(request: Request) {
    try {
        const { id } = await request.json();
        if (!id) {
            return NextResponse.json(
                { message: "Invoice ID is required." },
                { status: 400 }
            );
        }
        let invoices = await readInvoices();
        const initialLength = invoices.length;
        invoices = invoices.filter((inv) => inv.id !== id);
        if (invoices.length === initialLength) {
            return NextResponse.json(
                { message: "Invoice not found." },
                { status: 404 }
            );
        }
        await writeInvoices(invoices);
        return NextResponse.json({ message: "Invoice deleted successfully." });
    } catch (error: any) {
        console.error("Error deleting invoice:", error);
        return NextResponse.json(
            { message: "Error deleting invoice." },
            { status: 500 }
        );
    }
}
