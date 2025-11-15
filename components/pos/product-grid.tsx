"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Flame } from "lucide-react";
import { Product, Category, formatCurrency } from "@/lib/data";

interface ProductGridProps {
    products: Product[];
    categories: Category[];
    onProductSelect: (product: Product) => void;
    selectedCategory?: string;
}

export function ProductGrid({
    products,
    categories,
    onProductSelect,
    selectedCategory,
}: ProductGridProps) {
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [activeCategory, setActiveCategory] = useState<string | null>(
        selectedCategory || null
    );

    useEffect(() => {
        const availableProducts = products.filter((p) => p.isAvailable);
        if (activeCategory) {
            setFilteredProducts(
                availableProducts.filter((p) => p.categoryId === activeCategory)
            );
        } else {
            setFilteredProducts(availableProducts);
        }
    }, [activeCategory, products]);

    const handleCategorySelect = (categoryId: string) => {
        setActiveCategory(activeCategory === categoryId ? null : categoryId);
    };

    const getCategoryIcon = (categoryId: string) => {
        const category = categories.find((c) => c.id === categoryId);
        return category?.icon || "🍽️";
    };

    return (
        <div className="flex flex-col h-full">
            {/* Category Filter */}
            <div className="p-4 border-b bg-muted/50">
                <div className="flex flex-wrap gap-2">
                    <Button
                        variant={
                            activeCategory === null ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setActiveCategory(null)}
                        className="text-xs"
                    >
                        Tất cả
                    </Button>
                    {categories.map((category) => (
                        <Button
                            key={category.id}
                            variant={
                                activeCategory === category.id
                                    ? "default"
                                    : "outline"
                            }
                            size="sm"
                            onClick={() => handleCategorySelect(category.id)}
                            className="text-xs"
                        >
                            <span className="mr-1">{category.icon}</span>
                            {category.name}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Products Grid */}
            <div className="flex-1 overflow-auto">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                    {filteredProducts.map((product) => (
                        <Card
                            key={product.id}
                            className="cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
                            onClick={() => onProductSelect(product)}
                        >
                            <CardContent className="p-3">
                                {/* Product Image/Icon */}
                                <div className="aspect-square bg-muted rounded-lg mb-3 flex items-center justify-center relative overflow-hidden">
                                    {product.image &&
                                    product.image !==
                                        `/images/${product.id}.jpg` ? (
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-3xl">
                                            {getCategoryIcon(
                                                product.categoryId
                                            )}
                                        </span>
                                    )}

                                    {/* Badges */}
                                    <div className="absolute top-1 left-1 flex gap-1">
                                        {product.isSpicy && (
                                            <Badge
                                                variant="destructive"
                                                className="text-xs p-1"
                                            >
                                                <Flame className="w-3 h-3" />
                                            </Badge>
                                        )}
                                        {product.isAlcoholic && (
                                            <Badge
                                                variant="secondary"
                                                className="text-xs p-1"
                                            >
                                                🍺
                                            </Badge>
                                        )}
                                    </div>

                                    {!product.isAvailable && (
                                        <div className="absolute inset-0 bg-gray-500/50 flex items-center justify-center">
                                            <Badge variant="secondary">
                                                Hết món
                                            </Badge>
                                        </div>
                                    )}
                                </div>

                                {/* Product Info */}
                                <div className="space-y-1">
                                    <h3 className="font-semibold text-sm line-clamp-2 min-h-[2.5rem]">
                                        {product.name}
                                    </h3>

                                    {product.description && (
                                        <p className="text-xs text-muted-foreground line-clamp-2">
                                            {product.description}
                                        </p>
                                    )}

                                    <div className="flex items-center justify-between">
                                        <p className="text-lg font-bold text-primary">
                                            {formatCurrency(product.price)}
                                        </p>

                                        {product.preparationTime > 0 && (
                                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                <Clock className="w-3 h-3" />
                                                <span>
                                                    {product.preparationTime}p
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Allergen Warning */}
                                    {product.allergens.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {product.allergens
                                                .slice(0, 2)
                                                .map((allergen) => (
                                                    <Badge
                                                        key={allergen}
                                                        variant="outline"
                                                        className="text-xs"
                                                    >
                                                        {allergen}
                                                    </Badge>
                                                ))}
                                            {product.allergens.length > 2 && (
                                                <Badge
                                                    variant="outline"
                                                    className="text-xs"
                                                >
                                                    +
                                                    {product.allergens.length -
                                                        2}
                                                </Badge>
                                            )}
                                        </div>
                                    )}

                                    {/* Serving Size for Hot Pot */}
                                    {product.servingSize && (
                                        <Badge
                                            variant="secondary"
                                            className="text-xs mt-1"
                                        >
                                            {product.servingSize}
                                        </Badge>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* No Products Message */}
                {filteredProducts.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                        <span className="text-4xl mb-2">🍽️</span>
                        <p className="text-lg font-medium">Không có món ăn</p>
                        <p className="text-sm">
                            {activeCategory
                                ? "Danh mục này hiện tại không có món nào"
                                : "Hiện tại không có món ăn nào"}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
