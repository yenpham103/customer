import { auth } from "@/auth"
import AppFrame from "@/components/_layout/app-frame"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const session = await auth()

    if (!session) {
        redirect("/")
    }

    if (!session.user.role) {
        redirect("/guest-dashboard")
    }

    return (
        <AppFrame session={session}>
            {children}
        </AppFrame>
    )
}