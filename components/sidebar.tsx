"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/language-context";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Warehouse,
  ClipboardList,
  Users,
  BarChart3,
  Truck,
  FileText,
  ChevronLeft,
  ChevronRight,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navigation = [
  {
    name: "navigation.dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "navigation.pos",
    href: "/pos",
    icon: ShoppingCart,
  },
  {
    name: "navigation.products",
    href: "/products",
    icon: Package,
  },
  // {
  //   name: "navigation.pricing",
  //   href: "/pricing",
  //   icon: DollarSign,
  // },
  {
    name: "navigation.inventory",
    href: "/inventory",
    icon: Warehouse,
  },
  {
    name: "navigation.orders",
    href: "/orders",
    icon: ClipboardList,
  },
  {
    name: "navigation.customers",
    href: "/customers",
    icon: Users,
  },
  // {
  //   name: "navigation.suppliers",
  //   href: "/suppliers",
  //   icon: Truck,
  // },
  {
    name: "navigation.invoices",
    href: "/invoices",
    icon: FileText,
  },
  {
    name: "navigation.reports",
    href: "/reports",
    icon: BarChart3,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { t } = useLanguage();

  return (
    <div
      className={cn(
        "flex h-full flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex h-16 items-center border-b border-sidebar-border">
        <div className="flex items-center justify-between w-full px-4">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <LayoutDashboard className="h-6 w-6 text-sidebar-primary" />
              <span className="text-lg font-semibold text-sidebar-foreground">
                POS System
              </span>
            </div>
          )}
          {isCollapsed && (
            <LayoutDashboard className="h-6 w-6 text-sidebar-primary mx-auto" />
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8 p-0 hover:bg-sidebar-accent"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const translatedName = t(item.name);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                isCollapsed && "justify-center",
              )}
              title={isCollapsed ? translatedName : undefined}
            >
              <item.icon className="h-4 w-4 flex-shrink-0" />
              {!isCollapsed && translatedName}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
