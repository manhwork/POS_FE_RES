"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export function ReceiptSettings() {
  const [receiptSettings, setReceiptSettings] = useState({
    header: "POS SYSTEM",
    footer: "Thank you for your business!",
    showLogo: true,
    showBusinessInfo: true,
    showTaxBreakdown: true,
    showOrderNumber: true,
    paperSize: "80mm",
  })

  const { toast } = useToast()

  const handleSave = () => {
    toast({
      title: "Receipt settings saved",
      description: "Receipt configuration has been updated successfully.",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Receipt Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="receiptHeader">Receipt Header</Label>
          <Input
            id="receiptHeader"
            value={receiptSettings.header}
            onChange={(e) => setReceiptSettings({ ...receiptSettings, header: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="receiptFooter">Receipt Footer</Label>
          <Textarea
            id="receiptFooter"
            value={receiptSettings.footer}
            onChange={(e) => setReceiptSettings({ ...receiptSettings, footer: e.target.value })}
            rows={2}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Show Business Logo</Label>
              <div className="text-sm text-muted-foreground">Display logo on receipts</div>
            </div>
            <Switch
              checked={receiptSettings.showLogo}
              onCheckedChange={(checked) => setReceiptSettings({ ...receiptSettings, showLogo: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Show Business Information</Label>
              <div className="text-sm text-muted-foreground">Include address and contact info</div>
            </div>
            <Switch
              checked={receiptSettings.showBusinessInfo}
              onCheckedChange={(checked) => setReceiptSettings({ ...receiptSettings, showBusinessInfo: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Show Tax Breakdown</Label>
              <div className="text-sm text-muted-foreground">Display detailed tax information</div>
            </div>
            <Switch
              checked={receiptSettings.showTaxBreakdown}
              onCheckedChange={(checked) => setReceiptSettings({ ...receiptSettings, showTaxBreakdown: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Show Order Number</Label>
              <div className="text-sm text-muted-foreground">Include order number on receipts</div>
            </div>
            <Switch
              checked={receiptSettings.showOrderNumber}
              onCheckedChange={(checked) => setReceiptSettings({ ...receiptSettings, showOrderNumber: checked })}
            />
          </div>
        </div>

        <Button onClick={handleSave}>Save Receipt Settings</Button>
      </CardContent>
    </Card>
  )
}
