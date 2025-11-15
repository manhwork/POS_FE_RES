"use client";

import { useState, useEffect, useCallback } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { ProductTable } from "@/components/products/product-table";
import { ProductModal } from "@/components/products/product-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Product, Category } from "@/lib/data";

export default function ProductsPage() {
    const [menuData, setMenuData] = useState<{
        products: Product[];
        categories: Category[];
        allergens: any[];
        promotions: any[];
    } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const { toast } = useToast();

    const fetchMenu = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/menu");
            const data = await res.json();
            setMenuData(data);
        } catch (error) {
            console.error("Failed to fetch menu", error);
            toast({
                title: "Error",
                description: "Could not fetch product data.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchMenu();
    }, [fetchMenu]);

    const persistMenu = useCallback(
        async (updatedMenuData: typeof menuData) => {
            if (!updatedMenuData) return;
            try {
                await fetch("/api/menu", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(updatedMenuData),
                });
            } catch (error) {
                console.error("Failed to save menu", error);
                toast({
                    title: "Error",
                    description: "Could not save product changes.",
                    variant: "destructive",
                });
            }
        },
        [toast]
    );

    const handleAddProduct = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
    };

    const handleEditProduct = (product: Product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleSaveProduct = async (productData: Omit<Product, "id">) => {
        if (!menuData) return;

        let updatedProducts: Product[];
        if (editingProduct) {
            // Update existing product
            updatedProducts = menuData.products.map((p) =>
                p.id === editingProduct.id
                    ? { ...editingProduct, ...productData }
                    : p
            );
            toast({
                title: "Product updated",
                description: `${productData.name} has been updated successfully.`,
            });
        } else {
            // Add new product
            const newProduct: Product = {
                ...productData,
                id: `prod-${Date.now()}`, // Simple unique ID
            };
            updatedProducts = [newProduct, ...menuData.products];
            toast({
                title: "Product added",
                description: `${productData.name} has been added successfully.`,
            });
        }

        const updatedMenu = { ...menuData, products: updatedProducts };
        setMenuData(updatedMenu);
        await persistMenu(updatedMenu);
    };

    const handleDeleteProduct = async (id: string) => {
        if (!menuData) return;
        const product = menuData.products.find((p) => p.id === id);
        if (!product) return;

        const updatedProducts = menuData.products.filter((p) => p.id !== id);
        const updatedMenu = { ...menuData, products: updatedProducts };

        setMenuData(updatedMenu);
        await persistMenu(updatedMenu);

        toast({
            title: "Product deleted",
            description: `${product.name} has been deleted.`,
            variant: "destructive",
        });
    };

    if (isLoading || !menuData) {
        return (
            <DashboardLayout>
                <div className="h-full flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">Products</h1>
                        <p className="text-muted-foreground">
                            Manage your product catalog
                        </p>
                    </div>
                    <Button onClick={handleAddProduct}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Product
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>
                            Products ({menuData.products.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ProductTable
                            products={menuData.products}
                            onEdit={handleEditProduct}
                            onDelete={handleDeleteProduct}
                        />
                    </CardContent>
                </Card>

                <ProductModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveProduct}
                    product={editingProduct}
                    categories={menuData.categories}
                />
            </div>
        </DashboardLayout>
    );
}
