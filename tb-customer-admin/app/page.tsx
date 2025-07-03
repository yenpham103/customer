import { redirect } from "next/navigation"
import { auth } from "@/auth"
import SignIn from "@/components/_common/signin"


export default async function Home() {
  const session = await auth()

  // If user is authenticated, redirect to dashboard
  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <SignIn />
    </div>
  )
}
