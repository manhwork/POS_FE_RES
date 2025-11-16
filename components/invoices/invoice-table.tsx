"use client";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    MoreHorizontal,
    Eye,
    Edit,
    Trash2,
    Download,
    CreditCard,
} from "lucide-react";
import { toast } from "sonner";
import { Invoice } from "@/lib/data";

interface InvoiceTableProps {
    invoices: Invoice[];
    onEdit: (invoice: Invoice) => void;
    onView: (invoice: Invoice) => void;
    onDelete: (id: string) => void;
    onPay: (invoice: Invoice) => void;
}

const statusColors = {
    draft: "bg-gray-100 text-gray-800",
    sent: "bg-blue-100 text-blue-800",
    paid: "bg-green-100 text-green-800",
    overdue: "bg-red-100 text-red-800",
    cancelled: "bg-gray-100 text-gray-800",
};

export function InvoiceTable({
    invoices,
    onEdit,
    onView,
    onDelete,
    onPay,
}: InvoiceTableProps) {
    const handleDownload = (invoice: Invoice) => {
        toast.success(`Downloading invoice ${invoice.invoiceNumber}`);
    };

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this invoice?")) {
            onDelete(id);
            toast.success("Invoice deleted successfully");
        }
    };

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Invoice #</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Issue Date</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {invoices.map((invoice) => (
                        <TableRow key={invoice.id}>
                            <TableCell className="font-medium">
                                {invoice.invoiceNumber}
                            </TableCell>
                            <TableCell>
                                <div>
                                    <div className="font-medium">
                                        {invoice.customerName || "N/A"}
                                    </div>
                                    {invoice.customerEmail && (
                                        <div className="text-sm text-muted-foreground">
                                            {invoice.customerEmail}
                                        </div>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell>{invoice.issueDate}</TableCell>
                            <TableCell>{invoice.dueDate}</TableCell>
                            <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                            <TableCell>
                                <Badge className={statusColors[invoice.status]}>
                                    {invoice.status.charAt(0).toUpperCase() +
                                        invoice.status.slice(1)}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            className="h-8 w-8 p-0"
                                        >
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem
                                            onClick={() => onView(invoice)}
                                        >
                                            <Eye className="mr-2 h-4 w-4" />
                                            View
                                        </DropdownMenuItem>
                                        {invoice.status !== "paid" &&
                                            invoice.status !== "cancelled" && (
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        onPay(invoice)
                                                    }
                                                >
                                                    <CreditCard className="mr-2 h-4 w-4" />
                                                    Thanh toán
                                                </DropdownMenuItem>
                                            )}
                                        <DropdownMenuItem
                                            onClick={() => onEdit(invoice)}
                                        >
                                            <Edit className="mr-2 h-4 w-4" />
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() =>
                                                handleDownload(invoice)
                                            }
                                        >
                                            <Download className="mr-2 h-4 w-4" />
                                            Download PDF
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() =>
                                                handleDelete(invoice.id)
                                            }
                                            className="text-red-600"
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
