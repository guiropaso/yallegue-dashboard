"use client"

import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
  useSidebar
} from "@/components/ui/sidebar"
import { Users, Building2, List, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import Image from "next/image"

type DashboardSection = "providers" | "users" | "listings"

interface DashboardLayoutProps {
  children: React.ReactNode
  activeSection: DashboardSection
  onSectionChange: (section: DashboardSection) => void
}

function AppSidebar({ activeSection, onSectionChange }: { activeSection: DashboardSection, onSectionChange: (section: DashboardSection) => void }) {
  const { open } = useSidebar()
  const { signOut } = useAuth()

  const menuItems = [
    {
      id: "providers" as DashboardSection,
      label: "Providers",
      icon: Building2,
    },
    {
      id: "users" as DashboardSection,
      label: "Clientes", 
      icon: Users,
    },
    {
      id: "listings" as DashboardSection,
      label: "Listings",
      icon: List,
    },
  ]

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-center">
        <Image
          src="/logo.png"
          alt="Logo"
          width={200}
          height={300}
          className={cn(
            "rounded-md transition-all duration-300",
            open ? "w-24 h-auto" : "w-12 h-auto"
          )}
        />
      </SidebarHeader>
      <SidebarContent className="flex flex-col h-full">
        <div className="flex-1">
          <SidebarMenu>
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onSectionChange(item.id)}
                    isActive={activeSection === item.id}
                    tooltip={!open ? item.label : undefined}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <span className={cn(
                      "transition-opacity duration-300",
                      !open ? "opacity-0 w-0" : "opacity-100"
                    )}>
                      {item.label}
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </div>
        
        <div className="p-4 border-t">
          <Button
            onClick={signOut}
            variant="ghost"
            className="w-full justify-start"
            size="sm"
          >
            <LogOut className="h-4 w-4 mr-2" />
            <span className={cn(
              "transition-opacity duration-300",
              !open ? "opacity-0 w-0" : "opacity-100"
            )}>
              Sign Out
            </span>
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  )
}

export function DashboardLayout({ children, activeSection, onSectionChange }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background">
        <AppSidebar activeSection={activeSection} onSectionChange={onSectionChange} />
        
        <main className="flex-1 overflow-auto bg-background">
          <div className="flex items-center gap-2 p-4 border-b relative z-10">
            <SidebarTrigger />
            <h1 className="text-lg font-semibold">Dashboard</h1>
          </div>
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
