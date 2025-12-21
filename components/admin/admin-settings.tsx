"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Save, Settings, ArrowLeftRight, Store, Award, CreditCard, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"

export function AdminSettings() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [settings, setSettings] = useState<any>(null)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/settings")
      const result = await response.json()
      if (result.data) {
        setSettings(result.data)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load settings",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })

      const result = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: "Settings saved successfully",
        })
      } else {
        throw new Error(result.error || "Failed to save settings")
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const updateSetting = (section: string, key: string, value: any) => {
    setSettings((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }))
  }

  if (isLoading || !settings) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Platform Settings</h1>
          <p className="text-muted-foreground mt-1">Configure platform-wide settings</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="gap-2">
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Changes
        </Button>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Changes to these settings affect the entire platform. Please review carefully before saving.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="platform" className="space-y-4">
        <TabsList>
          <TabsTrigger value="platform" className="gap-2">
            <Settings className="h-4 w-4" />
            Platform
          </TabsTrigger>
          <TabsTrigger value="swap" className="gap-2">
            <ArrowLeftRight className="h-4 w-4" />
            Swap System
          </TabsTrigger>
          <TabsTrigger value="marketplace" className="gap-2">
            <Store className="h-4 w-4" />
            Marketplace
          </TabsTrigger>
          <TabsTrigger value="reputation" className="gap-2">
            <Award className="h-4 w-4" />
            Reputation
          </TabsTrigger>
          <TabsTrigger value="payments" className="gap-2">
            <CreditCard className="h-4 w-4" />
            Payments
          </TabsTrigger>
        </TabsList>

        <TabsContent value="platform" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Platform Configuration</CardTitle>
              <CardDescription>Basic platform settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Platform Name</Label>
                <Input
                  value={settings.platform.name}
                  onChange={(e) => updateSetting("platform", "name", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={settings.platform.description}
                  onChange={(e) => updateSetting("platform", "description", e.target.value)}
                  rows={3}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">Disable public access to the platform</p>
                </div>
                <Switch
                  checked={settings.platform.maintenance}
                  onCheckedChange={(checked) => updateSetting("platform", "maintenance", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Registration Enabled</Label>
                  <p className="text-sm text-muted-foreground">Allow new user registrations</p>
                </div>
                <Switch
                  checked={settings.platform.registrationEnabled}
                  onCheckedChange={(checked) => updateSetting("platform", "registrationEnabled", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Verification Required</Label>
                  <p className="text-sm text-muted-foreground">Require verification for public features</p>
                </div>
                <Switch
                  checked={settings.platform.verificationRequired}
                  onCheckedChange={(checked) => updateSetting("platform", "verificationRequired", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="swap" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Swap System Settings</CardTitle>
              <CardDescription>Configure the value swap and transformation engine</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Swap System Enabled</Label>
                  <p className="text-sm text-muted-foreground">Enable value swapping features</p>
                </div>
                <Switch
                  checked={settings.swap.enabled}
                  onCheckedChange={(checked) => updateSetting("swap", "enabled", checked)}
                />
              </div>
              <div className="space-y-2">
                <Label>Minimum Reputation for Swaps</Label>
                <Input
                  type="number"
                  value={settings.swap.minimumReputation}
                  onChange={(e) => updateSetting("swap", "minimumReputation", parseInt(e.target.value) || 0)}
                />
                <p className="text-xs text-muted-foreground">Minimum reputation score required to propose swaps</p>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Require Verification</Label>
                  <p className="text-sm text-muted-foreground">Only verified users can swap</p>
                </div>
                <Switch
                  checked={settings.swap.requireVerification}
                  onCheckedChange={(checked) => updateSetting("swap", "requireVerification", checked)}
                />
              </div>
              <div className="space-y-2">
                <Label>Platform Fee (%)</Label>
                <Input
                  type="number"
                  value={settings.swap.defaultPlatformFee}
                  onChange={(e) => updateSetting("swap", "defaultPlatformFee", parseFloat(e.target.value) || 0)}
                />
                <p className="text-xs text-muted-foreground">Default platform fee percentage for swaps</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="marketplace" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Marketplace Settings</CardTitle>
              <CardDescription>Configure marketplace behavior</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Marketplace Enabled</Label>
                  <p className="text-sm text-muted-foreground">Enable marketplace features</p>
                </div>
                <Switch
                  checked={settings.marketplace.enabled}
                  onCheckedChange={(checked) => updateSetting("marketplace", "enabled", checked)}
                />
              </div>
              <div className="space-y-2">
                <Label>Listing Fee</Label>
                <Input
                  type="number"
                  value={settings.marketplace.listingFee}
                  onChange={(e) => updateSetting("marketplace", "listingFee", parseFloat(e.target.value) || 0)}
                />
                <p className="text-xs text-muted-foreground">Fee charged for creating a listing</p>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Verification Required</Label>
                  <p className="text-sm text-muted-foreground">Only verified listings appear publicly</p>
                </div>
                <Switch
                  checked={settings.marketplace.verificationRequired}
                  onCheckedChange={(checked) => updateSetting("marketplace", "verificationRequired", checked)}
                />
              </div>
              <div className="space-y-2">
                <Label>Max Listings Per User</Label>
                <Input
                  type="number"
                  value={settings.marketplace.maxListingsPerUser}
                  onChange={(e) => updateSetting("marketplace", "maxListingsPerUser", parseInt(e.target.value) || 0)}
                />
                <p className="text-xs text-muted-foreground">Maximum number of listings a user can create</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reputation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reputation System Settings</CardTitle>
              <CardDescription>Configure reputation scoring</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Reputation System Enabled</Label>
                  <p className="text-sm text-muted-foreground">Enable reputation scoring</p>
                </div>
                <Switch
                  checked={settings.reputation.enabled}
                  onCheckedChange={(checked) => updateSetting("reputation", "enabled", checked)}
                />
              </div>
              <div className="space-y-2">
                <Label>Initial Reputation Score</Label>
                <Input
                  type="number"
                  value={settings.reputation.initialScore}
                  onChange={(e) => updateSetting("reputation", "initialScore", parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label>Verification Bonus</Label>
                <Input
                  type="number"
                  value={settings.reputation.verificationBonus}
                  onChange={(e) => updateSetting("reputation", "verificationBonus", parseInt(e.target.value) || 0)}
                />
                <p className="text-xs text-muted-foreground">Points awarded when user is verified</p>
              </div>
              <div className="space-y-2">
                <Label>Swap Completion Bonus</Label>
                <Input
                  type="number"
                  value={settings.reputation.swapBonus}
                  onChange={(e) => updateSetting("reputation", "swapBonus", parseInt(e.target.value) || 0)}
                />
                <p className="text-xs text-muted-foreground">Points awarded per completed swap</p>
              </div>
              <div className="space-y-2">
                <Label>Listing Creation Bonus</Label>
                <Input
                  type="number"
                  value={settings.reputation.listingBonus}
                  onChange={(e) => updateSetting("reputation", "listingBonus", parseInt(e.target.value) || 0)}
                />
                <p className="text-xs text-muted-foreground">Points awarded per verified listing</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Settings</CardTitle>
              <CardDescription>Configure payment processing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Payments Enabled</Label>
                  <p className="text-sm text-muted-foreground">Enable payment processing</p>
                </div>
                <Switch
                  checked={settings.payments.enabled}
                  onCheckedChange={(checked) => updateSetting("payments", "enabled", checked)}
                />
              </div>
              <div className="space-y-2">
                <Label>Supported Currencies</Label>
                <Input
                  value={settings.payments.supportedCurrencies.join(", ")}
                  onChange={(e) =>
                    updateSetting(
                      "payments",
                      "supportedCurrencies",
                      e.target.value.split(",").map((c) => c.trim()),
                    )
                  }
                />
                <p className="text-xs text-muted-foreground">Comma-separated list of currency codes (e.g., USD, NGN, USDT)</p>
              </div>
              <div className="space-y-2">
                <Label>Platform Fee Percentage</Label>
                <Input
                  type="number"
                  value={settings.payments.platformFeePercent}
                  onChange={(e) => updateSetting("payments", "platformFeePercent", parseFloat(e.target.value) || 0)}
                />
                <p className="text-xs text-muted-foreground">Percentage fee charged on all transactions</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

