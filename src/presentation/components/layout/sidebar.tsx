import { Calendar, Inbox, FileText, Shield, Package } from "lucide-react"
import { useUserRole } from "@/hooks/useUserRole"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const adminItems = [
  {
    title: "Painel Admin",
    url: "/admin",
    icon: Shield,
  },
  {
    title: "Área Operacional",
    url: "/operacional",
    icon: Package,
  },
]

const operacionalItems = [
  {
    title: "Solicitações",
    url: "/operacional",
    icon: Package,
  },
  {
    title: "Todas as Notas",
    url: "/requested-notes",
    icon: FileText,
  },
]

const clienteItems = [
  {
    title: "Minhas Notas",
    url: "/cliente",
    icon: FileText,
  },
  {
    title: "Emissão de nota",
    url: "/create-note",
    icon: Inbox,
  },
  {
    title: "Notas fiscais",
    url: "/list-notes",
    icon: Calendar,
  },
]

export function AppSidebar() {
  const { role, loading } = useUserRole()

  if (loading) {
    return (
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Carregando...</SidebarGroupLabel>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    )
  }

  let items = clienteItems
  let label = "Menu Cliente"

  if (role === 'admin') {
    items = adminItems
    label = "Administração"
  } else if (role === 'operacional') {
    items = operacionalItems
    label = "Operacional"
  }

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{label}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
