"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { BusinessSettings } from "@/components/settings/business-settings"
import { TaxSettings } from "@/components/settings/tax-settings"
import { ReceiptSettings } from "@/components/settings/receipt-settings"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const [systemSettings, setSystemSettings] = useState({
    darkMode: false,
    notifications: true,
    autoBackup: true,
    soundEffects: true,
  })

  const { toast } = useToast()

  const handleSystemSettingChange = (key: keyof typeof systemSettings, value: boolean) => {
    setSystemSettings({ ...systemSettings, [key]: value })
    toast({
      title: "Setting updated",
      description: `${key.replace(/([A-Z])/g, " $1").toLowerCase()} has been ${value ? "enabled" : "disabled"}`,
    })
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your POS system configuration</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <BusinessSettings />
            <TaxSettings />
          </div>

          <div className="space-y-6">
            <ReceiptSettings />

            <Card>
              <CardHeader>
                <CardTitle>System Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Dark Mode</Label>
                    <div className="text-sm text-muted-foreground">Use dark theme</div>
                  </div>
                  <Switch
                    checked={systemSettings.darkMode}
                    onCheckedChange={(checked) => handleSystemSettingChange("darkMode", checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notifications</Label>
                    <div className="text-sm text-muted-foreground">Show system notifications</div>
                  </div>
                  <Switch
                    checked={systemSettings.notifications}
                    onCheckedChange={(checked) => handleSystemSettingChange("notifications", checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto Backup</Label>
                    <div className="text-sm text-muted-foreground">Automatically backup data daily</div>
                  </div>
                  <Switch
                    checked={systemSettings.autoBackup}
                    onCheckedChange={(checked) => handleSystemSettingChange("autoBackup", checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Sound Effects</Label>
                    <div className="text-sm text-muted-foreground">Play sounds for actions</div>
                  </div>
                  <Switch
                    checked={systemSettings.soundEffects}
                    onCheckedChange={(checked) => handleSystemSettingChange("soundEffects", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full bg-transparent">
                  Export All Data
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  Import Data
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  Backup Database
                </Button>
                <Button variant="destructive" className="w-full">
                  Reset All Data
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
