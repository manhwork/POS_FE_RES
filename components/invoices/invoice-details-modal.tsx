"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Download, Mail, Edit, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { Invoice } from "@/lib/data";

interface InvoiceDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    invoice: Invoice | null;
    onEdit: (invoice: Invoice) => void;
    onPay?: (invoice: Invoice) => void;
}

const statusColors = {
    draft: "bg-gray-100 text-gray-800",
    sent: "bg-blue-100 text-blue-800",
    paid: "bg-green-100 text-green-800",
    overdue: "bg-red-100 text-red-800",
    cancelled: "bg-gray-100 text-gray-800",
};

export function InvoiceDetailsModal({
    isOpen,
    onClose,
    invoice,
    onEdit,
    onPay,
}: InvoiceDetailsModalProps) {
    if (!invoice) return null;

    const handleDownload = () => {
        toast.success(`Downloading invoice ${invoice.invoiceNumber}`);
    };

    const handleSendEmail = () => {
        if (invoice.customerEmail) {
            toast.success(`Email sent to ${invoice.customerEmail}`);
        } else {
            toast.error("No email address available");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <DialogTitle>Invoice Details</DialogTitle>
                        <div className="flex gap-2">
                            {invoice.status !== "paid" &&
                                invoice.status !== "cancelled" &&
                                onPay && (
                                    <Button
                                        variant="default"
                                        size="sm"
                                        onClick={() => onPay(invoice)}
                                    >
                                        <CreditCard className="h-4 w-4 mr-2" />
                                        Thanh toán
                                    </Button>
                                )}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onEdit(invoice)}
                            >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleSendEmail}
                            >
                                <Mail className="h-4 w-4 mr-2" />
                                Send Email
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleDownload}
                            >
                                <Download className="h-4 w-4 mr-2" />
                                Download PDF
                            </Button>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Invoice Header */}
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold">
                                {invoice.invoiceNumber}
                            </h2>
                            <Badge className={statusColors[invoice.status]}>
                                {invoice.status.charAt(0).toUpperCase() +
                                    invoice.status.slice(1)}
                            </Badge>
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-muted-foreground">
                                Issue Date
                            </div>
                            <div className="font-medium">
                                {invoice.issueDate}
                            </div>
                            <div className="text-sm text-muted-foreground mt-2">
                                Due Date
                            </div>
                            <div className="font-medium">{invoice.dueDate}</div>
                        </div>
                    </div>

                    <Separator />

                    {/* Customer Information */}
                    <div>
                        <h3 className="font-semibold mb-2">Bill To:</h3>
                        <div className="space-y-1">
                            <div className="font-medium">
                                {invoice.customerName || "N/A"}
                            </div>
                            {invoice.customerEmail && (
                                <div className="text-sm text-muted-foreground">
                                    {invoice.customerEmail}
                                </div>
                            )}
                            {invoice.customerPhone && (
                                <div className="text-sm text-muted-foreground">
                                    {invoice.customerPhone}
                                </div>
                            )}
                            {invoice.customerAddress && (
                                <div className="text-sm text-muted-foreground whitespace-pre-line">
                                    {invoice.customerAddress}
                                </div>
                            )}
                        </div>
                    </div>

                    <Separator />

                    {/* Invoice Items */}
                    <div>
                        <h3 className="font-semibold mb-4">Items</h3>
                        <div className="space-y-2">
                            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-muted-foreground">
                                <div className="col-span-6">Description</div>
                                <div className="col-span-2 text-center">
                                    Quantity
                                </div>
                                <div className="col-span-2 text-right">
                                    Unit Price
                                </div>
                                <div className="col-span-2 text-right">
                                    Total
                                </div>
                            </div>
                            <Separator />
                            {invoice.items.map((item, index) => (
                                <div
                                    key={item.id || index}
                                    className="grid grid-cols-12 gap-4 py-2"
                                >
                                    <div className="col-span-6">
                                        {item.name}
                                    </div>
                                    <div className="col-span-2 text-center">
                                        {item.quantity}
                                    </div>
                                    <div className="col-span-2 text-right">
                                        ${item.unitPrice.toFixed(2)}
                                    </div>
                                    <div className="col-span-2 text-right font-medium">
                                        ${item.total.toFixed(2)}
                                    </div>
                                </div>
                            ))}
                            <Separator />
                            <div className="grid grid-cols-12 gap-4 py-2">
                                <div className="col-span-10 text-right font-semibold">
                                    Total Amount:
                                </div>
                                <div className="col-span-2 text-right text-lg font-bold">
                                    ${invoice.amount.toFixed(2)}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    {invoice.notes && (
                        <>
                            <Separator />
                            <div>
                                <h3 className="font-semibold mb-2">Notes</h3>
                                <div className="text-sm text-muted-foreground whitespace-pre-line">
                                    {invoice.notes}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
