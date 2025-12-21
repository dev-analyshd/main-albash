import { redirect } from "next/navigation"

export default function VerifierDashboardRedirect() {
  redirect("/dashboard/admin/verification")
}
