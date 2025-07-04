import { auth } from "@/auth"
import AppFrame from "@/components/_layout/app-frame"
import { redirect } from "next/navigation"

export default async function GuestDashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const session = await auth()
    
    if (!session) {
        redirect("/")
    }

    if (session.user.role) {
        redirect("/dashboard")
    }

    return (
        <AppFrame session={session} isGuestMode={true}>
            {children}
        </AppFrame>
    )
}
