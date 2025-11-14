"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export function TaxSettings() {
  const [taxSettings, setTaxSettings] = useState({
    enabled: true,
    rate: 8.0,
    includedInPrice: false,
    name: "Sales Tax",
  })

  const { toast } = useToast()

  const handleSave = () => {
    toast({
      title: "Tax settings saved",
      description: "Tax configuration has been updated successfully.",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tax Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Enable Tax</Label>
            <div className="text-sm text-muted-foreground">Apply tax to all transactions</div>
          </div>
          <Switch
            checked={taxSettings.enabled}
            onCheckedChange={(checked) => setTaxSettings({ ...taxSettings, enabled: checked })}
          />
        </div>

        {taxSettings.enabled && (
          <>
            <div className="space-y-2">
              <Label htmlFor="taxName">Tax Name</Label>
              <Input
                id="taxName"
                value={taxSettings.name}
                onChange={(e) => setTaxSettings({ ...taxSettings, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="taxRate">Tax Rate (%)</Label>
              <Input
                id="taxRate"
                type="number"
                step="0.01"
                value={taxSettings.rate}
                onChange={(e) => setTaxSettings({ ...taxSettings, rate: Number.parseFloat(e.target.value) })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Tax Included in Price</Label>
                <div className="text-sm text-muted-foreground">Tax is already included in product prices</div>
              </div>
              <Switch
                checked={taxSettings.includedInPrice}
                onCheckedChange={(checked) => setTaxSettings({ ...taxSettings, includedInPrice: checked })}
              />
            </div>
          </>
        )}

        <Button onClick={handleSave}>Save Tax Settings</Button>
      </CardContent>
    </Card>
  )
}
