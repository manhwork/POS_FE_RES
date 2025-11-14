"use client";

import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import {
  ProductTable,
  type Product,
} from "@/components/products/product-table";
import { ProductFilters } from "@/components/products/product-filters";
import { ProductModal } from "@/components/products/product-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Sample product data
const sampleProducts: Product[] = [
  {
    id: "1",
    name: "Premium Coffee",
    price: 3.5,
    category: "Beverages",
    stock: 150,
    sku: "BEV-COFFEE01",
    status: "active",
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    name: "Club Sandwich",
    price: 8.99,
    category: "Food",
    stock: 45,
    sku: "FOO-SAND01",
    status: "active",
    createdAt: "2024-01-14T14:30:00Z",
  },
  {
    id: "3",
    name: "Blueberry Muffin",
    price: 4.25,
    category: "Desserts",
    stock: 30,
    sku: "DES-MUFF01",
    status: "active",
    createdAt: "2024-01-13T09:15:00Z",
  },
  {
    id: "4",
    name: "Green Tea",
    price: 2.75,
    category: "Beverages",
    stock: 0,
    sku: "BEV-TEA01",
    status: "inactive",
    createdAt: "2024-01-12T16:45:00Z",
  },
  {
    id: "5",
    name: "Caesar Salad",
    price: 12.5,
    category: "Food",
    stock: 25,
    sku: "FOO-SAL01",
    status: "active",
    createdAt: "2024-01-11T11:20:00Z",
  },
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(sampleProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { toast } = useToast();

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        categoryFilter === "All Categories" ||
        product.category === categoryFilter;
      const matchesStatus =
        statusFilter === "All Status" || product.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, searchTerm, categoryFilter, statusFilter]);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleSaveProduct = (
    productData: Omit<Product, "id" | "createdAt">,
  ) => {
    if (editingProduct) {
      // Update existing product
      setProducts(
        products.map((p) =>
          p.id === editingProduct.id
            ? {
                ...productData,
                id: editingProduct.id,
                createdAt: editingProduct.createdAt,
              }
            : p,
        ),
      );
      toast({
        title: "Product updated",
        description: `${productData.name} has been updated successfully.`,
      });
    } else {
      // Add new product
      const newProduct: Product = {
        ...productData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      setProducts([newProduct, ...products]);
      toast({
        title: "Product added",
        description: `${productData.name} has been added successfully.`,
      });
    }
  };

  const handleDeleteProduct = (id: string) => {
    const product = products.find((p) => p.id === id);
    setProducts(products.filter((p) => p.id !== id));
    toast({
      title: "Product deleted",
      description: `${product?.name} has been deleted.`,
      variant: "destructive",
    });
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("All Categories");
    setStatusFilter("All Status");
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Products</h1>
            <p className="text-muted-foreground">Manage your product catalog</p>
          </div>
          <Button onClick={handleAddProduct}>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>

        {/*<Card>
          <CardHeader>
            <CardTitle>Product Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <ProductFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              categoryFilter={categoryFilter}
              onCategoryChange={setCategoryFilter}
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
              onClearFilters={handleClearFilters}
            />
          </CardContent>
        </Card>*/}

        <Card>
          <CardHeader>
            <CardTitle>Products ({filteredProducts.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <ProductTable
              products={filteredProducts}
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
        />
      </div>
    </DashboardLayout>
  );
}
