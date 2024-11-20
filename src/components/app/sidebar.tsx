import * as React from "react"
import { PocketKnife, ListMinus, CalendarClock, Waypoints, Network, Binary, ShieldCheck, KeyRound } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  navMain: [
    {
      title: "Data",
      items: [
        {
          title: "Transform Lists",
          url: "/transform-list",
          icon: ListMinus,
        },
        {
          title: "Date/Time Convertor",
          url: "#",
          icon: CalendarClock,
        },
      ],
    },
    {
      title: "Hosting",
      items: [
        {
          title: "Reverse Proxy Config",
          url: "#",
          icon: Waypoints,
        },
      ],
    },
    {
      title: "Networking",
      items: [
        {
          title: "Visual Subnet Calculator ",
          url: "#",
          icon: Network,
        },
      ],
    },
    {
      title: "Security",
      url: "#",
      items: [
        {
          title: "Base64 String Convertor",
          url: "#",
          icon: Binary,
        },
        {
          title: "Certificate Checker",
          url: "#",
          icon: ShieldCheck,
        },
        {
          title: "SSH Key Generator",
          url: "#",
          icon: KeyRound,
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="xl" asChild>
              <a href="/">
                <div className="flex aspect-square size-14 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <PocketKnife className="size-8" />
                </div>
                <div className="flex flex-col leading-3">
                  <h1>S.H.I.T</h1>
                  <span className="text-end">happening</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {data.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <a href={item.url} className="font-medium">
                    {item.title}
                  </a>
                </SidebarMenuButton>
                {item.items?.length ? (
                  <SidebarMenuSub>
                    {item.items.map((item) => (
                      <SidebarMenuSubItem key={item.title}>
                        <SidebarMenuSubButton asChild isActive={item.isActive}>
                          <a href={item.url}><item.icon />{item.title}</a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                ) : null}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
