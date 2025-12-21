import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  Building,
  Bitcoin,
} from "lucide-react"

export default async function WalletPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from("profiles")
    .select("wallet_balance, pending_balance")
    .eq("id", user?.id)
    .single()

  const { data: transactions } = await supabase
    .from("transactions")
    .select("*")
    .or(`buyer_id.eq.${user?.id},seller_id.eq.${user?.id}`)
    .order("created_at", { ascending: false })
    .limit(20)

  const { data: paymentMethods } = await supabase
    .from("payment_methods")
    .select("*")
    .eq("user_id", user?.id)
    .order("is_default", { ascending: false })

  const { data: withdrawals } = await supabase
    .from("withdrawal_requests")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false })
    .limit(10)

  const balance = profile?.wallet_balance || 0
  const pendingBalance = profile?.pending_balance || 0
  const totalEarned =
    transactions
      ?.filter((t) => t.seller_id === user?.id && t.status === "completed")
      .reduce((sum, t) => sum + t.amount, 0) || 0

  const getPaymentIcon = (type: string) => {
    switch (type) {
      case "card":
        return <CreditCard className="h-5 w-5" />
      case "bank":
        return <Building className="h-5 w-5" />
      case "crypto_wallet":
        return <Bitcoin className="h-5 w-5" />
      default:
        return <CreditCard className="h-5 w-5" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "pending":
      case "processing":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "failed":
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Wallet</h1>
        <p className="text-muted-foreground mt-1">Manage your funds, payments, and withdrawals</p>
      </div>

      {/* Balance Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Available Balance</p>
                <p className="text-3xl font-bold mt-1">${balance.toFixed(2)}</p>
              </div>
              <Wallet className="h-10 w-10 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-3xl font-bold mt-1">${pendingBalance.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground mt-1">In escrow</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Earned</p>
                <p className="text-3xl font-bold mt-1">${totalEarned.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground mt-1">All time</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <ArrowDownLeft className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <Link href="/dashboard/wallet/deposit">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Funds
          </Button>
        </Link>
        <Link href="/dashboard/wallet/withdraw">
          <Button variant="outline" className="gap-2 bg-transparent">
            <ArrowUpRight className="h-4 w-4" />
            Withdraw
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
          <TabsTrigger value="methods">Payment Methods</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>Your recent purchases and sales</CardDescription>
            </CardHeader>
            <CardContent>
              {transactions && transactions.length > 0 ? (
                <div className="space-y-4">
                  {transactions.map((tx) => {
                    const isSale = tx.seller_id === user?.id
                    return (
                      <div key={tx.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${isSale ? "bg-green-100" : "bg-blue-100"}`}>
                            {isSale ? (
                              <ArrowDownLeft className="h-5 w-5 text-green-600" />
                            ) : (
                              <ArrowUpRight className="h-5 w-5 text-blue-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{isSale ? "Sale" : "Purchase"}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(tx.created_at).toLocaleDateString()} at{" "}
                              {new Date(tx.created_at).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold ${isSale ? "text-green-600" : ""}`}>
                            {isSale ? "+" : "-"}${tx.amount.toFixed(2)}
                          </p>
                          <Badge variant="secondary" className="capitalize">
                            {tx.status}
                          </Badge>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Wallet className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No transactions yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="withdrawals">
          <Card>
            <CardHeader>
              <CardTitle>Withdrawal History</CardTitle>
              <CardDescription>Track your withdrawal requests</CardDescription>
            </CardHeader>
            <CardContent>
              {withdrawals && withdrawals.length > 0 ? (
                <div className="space-y-4">
                  {withdrawals.map((wd) => (
                    <div key={wd.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(wd.status)}
                        <div>
                          <p className="font-medium">${wd.amount.toFixed(2)}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(wd.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={
                          wd.status === "completed" ? "default" : wd.status === "failed" ? "destructive" : "secondary"
                        }
                        className="capitalize"
                      >
                        {wd.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <ArrowUpRight className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No withdrawals yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="methods">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>Manage your connected payment methods</CardDescription>
              </div>
              <Link href="/dashboard/wallet/methods/add">
                <Button size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Method
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {paymentMethods && paymentMethods.length > 0 ? (
                paymentMethods.map((method) => (
                  <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-muted rounded">{getPaymentIcon(method.type)}</div>
                      <div>
                        <p className="font-medium">{method.label || method.type}</p>
                        {method.last_four && <p className="text-sm text-muted-foreground">•••• {method.last_four}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {method.is_default && <Badge>Default</Badge>}
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <CreditCard className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No payment methods added</p>
                  <Link href="/dashboard/wallet/methods/add">
                    <Button variant="link" className="mt-2">
                      Add your first payment method
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
