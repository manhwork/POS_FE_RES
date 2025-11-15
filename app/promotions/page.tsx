"use client";

import { useState, useEffect, useCallback } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Promotion } from "@/lib/data";
import { PromotionTable } from "@/components/promotions/promotion-table";
import { PromotionModal } from "@/components/promotions/promotion-modal";

export default function PromotionsPage() {
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPromotion, setSelectedPromotion] =
        useState<Promotion | null>(null);
    const { toast } = useToast();

    const fetchPromotions = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/promotions");
            const data = await res.json();
            setPromotions(data);
        } catch (error) {
            toast({
                title: "Error",
                description: "Could not fetch promotions.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchPromotions();
    }, [fetchPromotions]);

    const handleAddPromotion = () => {
        setSelectedPromotion(null);
        setIsModalOpen(true);
    };

    const handleEditPromotion = (promotion: Promotion) => {
        setSelectedPromotion(promotion);
        setIsModalOpen(true);
    };

    const handleDeletePromotion = async (id: string) => {
        if (!confirm("Are you sure you want to delete this promotion?")) return;
        try {
            const res = await fetch("/api/promotions", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });
            if (!res.ok) throw new Error("Failed to delete promotion.");
            toast({
                title: "Success",
                description: "Promotion deleted successfully.",
            });
            fetchPromotions();
        } catch (error) {
            toast({
                title: "Error",
                description: "Could not delete promotion.",
                variant: "destructive",
            });
        }
    };

    const handleSavePromotion = async (promotionData: Promotion) => {
        try {
            const method = promotionData.id ? "PUT" : "POST";
            const res = await fetch("/api/promotions", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(promotionData),
            });
            if (!res.ok) throw new Error("Failed to save promotion.");
            toast({
                title: "Success",
                description: "Promotion saved successfully.",
            });
            fetchPromotions();
            setIsModalOpen(false);
        } catch (error) {
            toast({
                title: "Error",
                description: "Could not save promotion.",
                variant: "destructive",
            });
        }
    };

    if (isLoading) {
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
                    <h1 className="text-2xl font-bold">Quản lý Khuyến mãi</h1>
                    <Button onClick={handleAddPromotion}>
                        <Plus className="h-4 w-4 mr-2" /> Thêm Khuyến mãi
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>
                            Danh sách Khuyến mãi ({promotions.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <PromotionTable
                            promotions={promotions}
                            onEdit={handleEditPromotion}
                            onDelete={handleDeletePromotion}
                        />
                    </CardContent>
                </Card>

                <PromotionModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSavePromotion}
                    promotion={selectedPromotion}
                />
            </div>
        </DashboardLayout>
    );
}
