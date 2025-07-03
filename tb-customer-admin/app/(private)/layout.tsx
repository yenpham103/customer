import { auth } from "@/auth"
import AppFrame from "@/components/_layout/app-frame"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const session = await auth()
    // If user is authenticated, redirect to dashboard
    if (!session) {
        redirect("/")
    }

    return (
        <AppFrame session={session}>
            {
            session?.user?.role === "admin" ? (
                children
            ) : (
                <>You have no permissions</>
            )}
        </AppFrame>
    )
}