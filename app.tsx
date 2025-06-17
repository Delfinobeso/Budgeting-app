"use client"

import { BudgetProvider, useBudget } from "@/lib/budget-context"
import { Onboarding } from "@/components/onboarding"
import { Dashboard } from "@/components/dashboard"

function AppContent() {
  const { isOnboarded } = useBudget()

  return isOnboarded ? <Dashboard /> : <Onboarding />
}

export default function App() {
  return (
    <BudgetProvider>
      <AppContent />
    </BudgetProvider>
  )
}
