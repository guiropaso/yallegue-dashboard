"use client"

import { useState } from "react"
import { DashboardLayout } from "./dashboard-layout"
import { ProvidersSection } from "./providers-section"
import { UsersSection } from "./users-section"
import { ListingsSection } from "./listings-section"

type DashboardSection = "providers" | "users" | "listings"

export function Dashboard() {
  const [activeSection, setActiveSection] = useState<DashboardSection>("providers")

  const renderContent = () => {
    switch (activeSection) {
      case "providers":
        return <ProvidersSection />
      case "users":
        return <UsersSection />
      case "listings":
        return <ListingsSection />
      default:
        return <ProvidersSection />
    }
  }

  return (
    <DashboardLayout 
      activeSection={activeSection}
      onSectionChange={setActiveSection}
    >
      {renderContent()}
    </DashboardLayout>
  )
}
