'use client'
import AccessDashboard from "@/components/dashboard/access-dashboard"
import GuestDashboard from "@/components/dashboard/guest-dashboard"
import { useSession } from "next-auth/react"

export default function Dashboard() {
  const { data: session } = useSession()
  
  return (
    <>
      {
        !!session?.user?.role ? (
          <AccessDashboard />
        ) : (
          <GuestDashboard />
        )
      }
    </>
  )
}
