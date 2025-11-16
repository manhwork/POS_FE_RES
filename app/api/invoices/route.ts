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

        // Check if invoice number already exists
        if (
            newInvoiceData.invoiceNumber &&
            invoices.find(
                (inv) => inv.invoiceNumber === newInvoiceData.invoiceNumber
            )
        ) {
            return NextResponse.json(
                { message: "Invoice number already exists." },
                { status: 400 }
            );
        }

        // Validate that orderIds exist if provided
        if (newInvoiceData.orderIds && newInvoiceData.orderIds.length > 0) {
            // Note: In a real app, you would validate against orders database
            // For now, we just ensure it's an array
            if (!Array.isArray(newInvoiceData.orderIds)) {
                return NextResponse.json(
                    { message: "orderIds must be an array." },
                    { status: 400 }
                );
            }
        }

        const newInvoice: Invoice = {
            ...newInvoiceData,
            id: newInvoiceData.id || `INV-${Date.now()}`,
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

        // Check if invoice number is being changed and already exists
        if (
            updatedInvoice.invoiceNumber &&
            updatedInvoice.invoiceNumber !== invoices[index].invoiceNumber &&
            invoices.find(
                (inv) =>
                    inv.id !== updatedInvoice.id &&
                    inv.invoiceNumber === updatedInvoice.invoiceNumber
            )
        ) {
            return NextResponse.json(
                { message: "Invoice number already exists." },
                { status: 400 }
            );
        }

        // Prevent updating paid invoices (they are immutable after payment)
        if (invoices[index].status === "paid") {
            return NextResponse.json(
                {
                    message:
                        "Cannot modify paid invoice. Paid invoices are immutable.",
                },
                { status: 400 }
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
 * Handles PATCH requests to update invoice status (for payment).
 */
export async function PATCH(request: Request) {
    try {
        const { id, status, paymentMethod, finalTotal, appliedPromotionId } =
            await request.json();
        if (!id) {
            return NextResponse.json(
                { message: "Invoice ID is required." },
                { status: 400 }
            );
        }
        const invoices = await readInvoices();
        const invoiceIndex = invoices.findIndex((inv) => inv.id === id);

        if (invoiceIndex === -1) {
            return NextResponse.json(
                { message: "Invoice not found." },
                { status: 404 }
            );
        }

        // Update invoice status
        if (status) {
            invoices[invoiceIndex].status = status as Invoice["status"];
        }

        // Store payment method if provided
        if (paymentMethod !== undefined) {
            invoices[invoiceIndex].paymentMethod = paymentMethod;
        }

        // Update amount if finalTotal is provided (applied promotion discount)
        if (finalTotal !== undefined) {
            invoices[invoiceIndex].amount = finalTotal;
        }

        // Store applied promotion ID if provided
        if (appliedPromotionId !== undefined) {
            invoices[invoiceIndex].appliedPromotionId = appliedPromotionId;
        }

        await writeInvoices(invoices);

        return NextResponse.json({
            message: "Invoice updated successfully.",
            invoice: invoices[invoiceIndex],
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
        const invoiceToDelete = invoices.find((inv) => inv.id === id);

        if (!invoiceToDelete) {
            return NextResponse.json(
                { message: "Invoice not found." },
                { status: 404 }
            );
        }

        // Prevent deleting paid invoices
        if (invoiceToDelete.status === "paid") {
            return NextResponse.json(
                { message: "Cannot delete paid invoice." },
                { status: 400 }
            );
        }

        // Remove invoiceId from linked orders when deleting
        if (invoiceToDelete.orderIds && invoiceToDelete.orderIds.length > 0) {
            // Note: In a real app, you would update orders database
            // For now, we just delete the invoice
        }

        invoices = invoices.filter((inv) => inv.id !== id);
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
