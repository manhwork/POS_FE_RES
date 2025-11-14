"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Clock } from "lucide-react";

export interface Table {
  id: string;
  name: string;
  capacity: number;
  status: "available" | "occupied" | "reserved" | "cleaning";
  currentOrder?: {
    id: string;
    startTime: Date;
    totalAmount: number;
    itemCount: number;
  };
}

interface TableGridProps {
  tables: Table[];
  selectedTableId?: string | null;
  onTableSelect: (table: Table) => void;
}

const getStatusColor = (status: Table["status"]) => {
  switch (status) {
    case "available":
      return "bg-green-100 text-green-800 border-green-200";
    case "occupied":
      return "bg-red-100 text-red-800 border-red-200";
    case "reserved":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "cleaning":
      return "bg-gray-100 text-gray-800 border-gray-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getStatusText = (status: Table["status"]) => {
  switch (status) {
    case "available":
      return "Trống";
    case "occupied":
      return "Đang phục vụ";
    case "reserved":
      return "Đã đặt";
    case "cleaning":
      return "Dọn dẹp";
    default:
      return "Không xác định";
  }
};

const formatDuration = (startTime: Date) => {
  const now = new Date();
  const duration = Math.floor(
    (now.getTime() - startTime.getTime()) / 1000 / 60,
  );

  if (duration < 60) {
    return `${duration}p`;
  }

  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;
  return `${hours}h${minutes > 0 ? ` ${minutes}p` : ""}`;
};

export function TableGrid({
  tables,
  selectedTableId,
  onTableSelect,
}: TableGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
      {tables.map((table) => (
        <Card
          key={table.id}
          className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
            selectedTableId === table.id
              ? "ring-2 ring-primary shadow-lg"
              : "hover:shadow-md"
          }`}
          onClick={() => onTableSelect(table)}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-lg">{table.name}</h3>
              <Badge className={getStatusColor(table.status)}>
                {getStatusText(table.status)}
              </Badge>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
              <Users className="h-4 w-4" />
              <span>{table.capacity} chỗ</span>
            </div>

            {table.currentOrder && (
              <div className="space-y-2 pt-2 border-t">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{formatDuration(table.currentOrder.startTime)}</span>
                </div>

                <div className="text-sm">
                  <div className="flex justify-between">
                    <span>Món:</span>
                    <span className="font-medium">
                      {table.currentOrder.itemCount}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tổng:</span>
                    <span className="font-medium text-primary">
                      {table.currentOrder.totalAmount.toLocaleString("vi-VN")}đ
                    </span>
                  </div>
                </div>
              </div>
            )}

            {table.status === "available" && (
              <div className="text-center py-4 text-muted-foreground">
                <span className="text-2xl">🍽️</span>
                <p className="text-xs mt-1">Nhấn để bắt đầu</p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
