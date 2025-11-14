"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/language-context";
import { Minus, Plus, Trash2 } from "lucide-react";
import { CheckoutModal } from "./checkout-modal";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
}

export function Cart({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}: CartProps) {
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const { t } = useLanguage();

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  const handleCheckout = () => {
    setShowCheckoutModal(true);
  };

  return (
    <>
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle>Đơn hàng</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <div className="flex-1 space-y-3 mb-4">
            {items.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Chưa có món nào</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Chọn món từ menu để bắt đầu
                </p>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {item.price.toLocaleString("vi-VN")}đ mỗi món
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        onUpdateQuantity(
                          item.id,
                          Math.max(0, item.quantity - 1),
                        )
                      }
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center font-medium">
                      {item.quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        onUpdateQuantity(item.id, item.quantity + 1)
                      }
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onRemoveItem(item.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          {items.length > 0 && (
            <div className="space-y-2 pt-4 border-t">
              <div className="flex justify-between">
                <span>Tạm tính:</span>
                <span>{subtotal.toLocaleString("vi-VN")}đ</span>
              </div>
              <div className="flex justify-between">
                <span>Thuế (10%):</span>
                <span>{tax.toLocaleString("vi-VN")}đ</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Tổng cộng:</span>
                <span>{total.toLocaleString("vi-VN")}đ</span>
              </div>
              <Button
                className="w-full mt-4"
                size="lg"
                onClick={handleCheckout}
              >
                Thanh toán - {total.toLocaleString("vi-VN")}đ
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <CheckoutModal
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        items={items}
        total={total}
      />
    </>
  );
}
