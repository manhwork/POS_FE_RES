"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Calculator, TrendingUp, DollarSign, Percent, Save, Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PricingProduct {
  id: string
  name: string
  sku: string
  category: string
  currentPrice: number
  cost: number
  margin: number
  marginPercent: number
  suggestedPrice: number
  lastUpdated: string
  priceHistory: { date: string; price: number; reason: string }[]
}

const sampleProducts: PricingProduct[] = [
  {
    id: "1",
    name: "Premium Coffee",
    sku: "BEV-COFFEE01",
    category: "Beverages",
    currentPrice: 3.5,
    cost: 1.2,
    margin: 2.3,
    marginPercent: 65.7,
    suggestedPrice: 3.6,
    lastUpdated: "2024-01-15",
    priceHistory: [
      { date: "2024-01-15", price: 3.5, reason: "Regular price update" },
      { date: "2023-12-01", price: 3.25, reason: "Cost increase adjustment" },
      { date: "2023-10-15", price: 3.0, reason: "Initial pricing" },
    ],
  },
  {
    id: "2",
    name: "Club Sandwich",
    sku: "FOO-SAND01",
    category: "Food",
    currentPrice: 8.99,
    cost: 3.5,
    margin: 5.49,
    marginPercent: 61.1,
    suggestedPrice: 9.5,
    lastUpdated: "2024-01-14",
    priceHistory: [
      { date: "2024-01-14", price: 8.99, reason: "Menu optimization" },
      { date: "2023-11-20", price: 8.5, reason: "Ingredient cost increase" },
    ],
  },
  {
    id: "3",
    name: "Caesar Salad",
    sku: "FOO-SAL01",
    category: "Food",
    currentPrice: 12.5,
    cost: 4.8,
    margin: 7.7,
    marginPercent: 61.6,
    suggestedPrice: 13.0,
    lastUpdated: "2024-01-11",
    priceHistory: [
      { date: "2024-01-11", price: 12.5, reason: "Premium ingredients" },
      { date: "2023-12-05", price: 11.99, reason: "Market positioning" },
    ],
  },
]

export default function PricingPage() {
  const [products, setProducts] = useState<PricingProduct[]>(sampleProducts)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All Categories")
  const [bulkMarkup, setBulkMarkup] = useState("")
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const { toast } = useToast()

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = categoryFilter === "All Categories" || product.category === categoryFilter
      return matchesSearch && matchesCategory
    })
  }, [products, searchTerm, categoryFilter])

  const handlePriceUpdate = (productId: string, newPrice: number, reason: string) => {
    setProducts(
      products.map((product) => {
        if (product.id === productId) {
          const margin = newPrice - product.cost
          const marginPercent = (margin / newPrice) * 100
          return {
            ...product,
            currentPrice: newPrice,
            margin,
            marginPercent,
            lastUpdated: new Date().toISOString().split("T")[0],
            priceHistory: [
              { date: new Date().toISOString().split("T")[0], price: newPrice, reason },
              ...product.priceHistory,
            ],
          }
        }
        return product
      }),
    )

    toast({
      title: "Price updated",
      description: `Price updated successfully for ${products.find((p) => p.id === productId)?.name}`,
    })
  }

  const handleBulkPriceUpdate = () => {
    if (!bulkMarkup || selectedProducts.length === 0) {
      toast({
        title: "Invalid selection",
        description: "Please select products and enter markup percentage",
        variant: "destructive",
      })
      return
    }

    const markupPercent = Number.parseFloat(bulkMarkup)
    setProducts(
      products.map((product) => {
        if (selectedProducts.includes(product.id)) {
          const newPrice = product.cost * (1 + markupPercent / 100)
          const margin = newPrice - product.cost
          const marginPercent = (margin / newPrice) * 100
          return {
            ...product,
            currentPrice: newPrice,
            margin,
            marginPercent,
            lastUpdated: new Date().toISOString().split("T")[0],
            priceHistory: [
              {
                date: new Date().toISOString().split("T")[0],
                price: newPrice,
                reason: `Bulk update: ${markupPercent}% markup`,
              },
              ...product.priceHistory,
            ],
          }
        }
        return product
      }),
    )

    setSelectedProducts([])
    setBulkMarkup("")
    toast({
      title: "Bulk update completed",
      description: `Updated prices for ${selectedProducts.length} products`,
    })
  }

  const calculateSuggestedPrice = (cost: number, targetMargin = 60) => {
    return cost / (1 - targetMargin / 100)
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Pricing Management</h1>
            <p className="text-muted-foreground">Manage product pricing and margins</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Import Prices
            </Button>
            <Button>
              <Save className="h-4 w-4 mr-2" />
              Export Prices
            </Button>
          </div>
        </div>

        {/* Pricing Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Margin</CardTitle>
              <Percent className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">62.8%</div>
              <p className="text-xs text-muted-foreground">+2.1% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$24,999</div>
              <p className="text-xs text-muted-foreground">+12.5% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Price Updates</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Margin Items</CardTitle>
              <Calculator className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">Need attention</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="pricing" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pricing">Product Pricing</TabsTrigger>
            <TabsTrigger value="bulk">Bulk Updates</TabsTrigger>
            <TabsTrigger value="analysis">Price Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="pricing" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Price Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All Categories">All Categories</SelectItem>
                      <SelectItem value="Beverages">Beverages</SelectItem>
                      <SelectItem value="Food">Food</SelectItem>
                      <SelectItem value="Desserts">Desserts</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead>Cost</TableHead>
                        <TableHead>Current Price</TableHead>
                        <TableHead>Margin</TableHead>
                        <TableHead>Margin %</TableHead>
                        <TableHead>Suggested</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                          <TableCell>${product.cost.toFixed(2)}</TableCell>
                          <TableCell className="font-semibold">${product.currentPrice.toFixed(2)}</TableCell>
                          <TableCell>${product.margin.toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                product.marginPercent < 50
                                  ? "destructive"
                                  : product.marginPercent < 60
                                    ? "secondary"
                                    : "default"
                              }
                            >
                              {product.marginPercent.toFixed(1)}%
                            </Badge>
                          </TableCell>
                          <TableCell>${product.suggestedPrice.toFixed(2)}</TableCell>
                          <TableCell>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  Edit Price
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Update Price - {product.name}</DialogTitle>
                                </DialogHeader>
                                <PriceUpdateForm product={product} onUpdate={handlePriceUpdate} />
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bulk" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Bulk Price Updates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Markup Percentage</Label>
                    <Input
                      type="number"
                      placeholder="Enter markup %"
                      value={bulkMarkup}
                      onChange={(e) => setBulkMarkup(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Selected Products</Label>
                    <div className="text-sm text-muted-foreground">{selectedProducts.length} products selected</div>
                  </div>
                </div>

                <Button onClick={handleBulkPriceUpdate} disabled={!bulkMarkup || selectedProducts.length === 0}>
                  Apply Bulk Update
                </Button>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <input
                            type="checkbox"
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedProducts(filteredProducts.map((p) => p.id))
                              } else {
                                setSelectedProducts([])
                              }
                            }}
                          />
                        </TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Current Price</TableHead>
                        <TableHead>Cost</TableHead>
                        <TableHead>New Price</TableHead>
                        <TableHead>New Margin</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts.map((product) => {
                        const newPrice = bulkMarkup
                          ? product.cost * (1 + Number.parseFloat(bulkMarkup) / 100)
                          : product.currentPrice
                        const newMargin = bulkMarkup
                          ? ((newPrice - product.cost) / newPrice) * 100
                          : product.marginPercent

                        return (
                          <TableRow key={product.id}>
                            <TableCell>
                              <input
                                type="checkbox"
                                checked={selectedProducts.includes(product.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedProducts([...selectedProducts, product.id])
                                  } else {
                                    setSelectedProducts(selectedProducts.filter((id) => id !== product.id))
                                  }
                                }}
                              />
                            </TableCell>
                            <TableCell className="font-medium">{product.name}</TableCell>
                            <TableCell>${product.currentPrice.toFixed(2)}</TableCell>
                            <TableCell>${product.cost.toFixed(2)}</TableCell>
                            <TableCell className="font-semibold">${newPrice.toFixed(2)}</TableCell>
                            <TableCell>
                              <Badge
                                variant={newMargin < 50 ? "destructive" : newMargin < 60 ? "secondary" : "default"}
                              >
                                {newMargin.toFixed(1)}%
                              </Badge>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Margin Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>High Margin &gt;60%</span>
                      <span className="font-semibold">2 products</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Medium Margin 40-60%</span>
                      <span className="font-semibold">1 product</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Low Margin &lt;40%</span>
                      <span className="font-semibold">0 products</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Price Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {filteredProducts
                      .filter((p) => p.currentPrice < p.suggestedPrice)
                      .map((product) => (
                        <div key={product.id} className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-muted-foreground">
                              Current: ${product.currentPrice.toFixed(2)} → Suggested: $
                              {product.suggestedPrice.toFixed(2)}
                            </div>
                          </div>
                          <Button size="sm" variant="outline">
                            Apply
                          </Button>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

function PriceUpdateForm({
  product,
  onUpdate,
}: { product: PricingProduct; onUpdate: (id: string, price: number, reason: string) => void }) {
  const [newPrice, setNewPrice] = useState(product.currentPrice.toString())
  const [reason, setReason] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onUpdate(product.id, Number.parseFloat(newPrice), reason)
  }

  const newMargin = Number.parseFloat(newPrice) - product.cost
  const newMarginPercent = (newMargin / Number.parseFloat(newPrice)) * 100

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Current Price</Label>
          <Input value={`$${product.currentPrice.toFixed(2)}`} disabled />
        </div>
        <div className="space-y-2">
          <Label>Cost</Label>
          <Input value={`$${product.cost.toFixed(2)}`} disabled />
        </div>
      </div>

      <div className="space-y-2">
        <Label>New Price</Label>
        <Input type="number" step="0.01" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>New Margin</Label>
          <Input value={`$${newMargin.toFixed(2)}`} disabled />
        </div>
        <div className="space-y-2">
          <Label>New Margin %</Label>
          <Input value={`${newMarginPercent.toFixed(1)}%`} disabled />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Reason for Change</Label>
        <Input
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="e.g., Cost increase, Market adjustment"
          required
        />
      </div>

      <Button type="submit" className="w-full">
        Update Price
      </Button>
    </form>
  )
}
