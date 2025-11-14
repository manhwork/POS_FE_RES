"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

interface BusinessInfo {
  name: string
  address: string
  city: string
  state: string
  zipCode: string
  phone: string
  email: string
  website: string
  taxId: string
  description: string
}

export function BusinessSettings() {
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>({
    name: "My POS Business",
    address: "123 Business St",
    city: "Business City",
    state: "CA",
    zipCode: "12345",
    phone: "(555) 123-4567",
    email: "info@mybusiness.com",
    website: "www.mybusiness.com",
    taxId: "12-3456789",
    description: "A modern point of sale business",
  })

  const { toast } = useToast()

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Business information has been updated successfully.",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="businessName">Business Name</Label>
            <Input
              id="businessName"
              value={businessInfo.name}
              onChange={(e) => setBusinessInfo({ ...businessInfo, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="taxId">Tax ID</Label>
            <Input
              id="taxId"
              value={businessInfo.taxId}
              onChange={(e) => setBusinessInfo({ ...businessInfo, taxId: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            value={businessInfo.address}
            onChange={(e) => setBusinessInfo({ ...businessInfo, address: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={businessInfo.city}
              onChange={(e) => setBusinessInfo({ ...businessInfo, city: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              value={businessInfo.state}
              onChange={(e) => setBusinessInfo({ ...businessInfo, state: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="zipCode">ZIP Code</Label>
            <Input
              id="zipCode"
              value={businessInfo.zipCode}
              onChange={(e) => setBusinessInfo({ ...businessInfo, zipCode: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={businessInfo.phone}
              onChange={(e) => setBusinessInfo({ ...businessInfo, phone: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={businessInfo.email}
              onChange={(e) => setBusinessInfo({ ...businessInfo, email: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            value={businessInfo.website}
            onChange={(e) => setBusinessInfo({ ...businessInfo, website: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={businessInfo.description}
            onChange={(e) => setBusinessInfo({ ...businessInfo, description: e.target.value })}
            rows={3}
          />
        </div>

        <Button onClick={handleSave}>Save Business Information</Button>
      </CardContent>
    </Card>
  )
}
