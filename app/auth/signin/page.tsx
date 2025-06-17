import { SignInForm } from "@/components/auth/signin-form"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function SignInPage() {
  const session = await auth()

  if (session) {
    redirect("/")
  }

  return <SignInForm />
}
