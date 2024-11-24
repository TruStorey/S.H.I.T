import * as React from "react";
import { PocketKnife, ListMinus, CalendarClock, Waypoints, Workflow, Binary, ShieldCheck, KeyRound } from "lucide-react";
import { useLocation } from "react-router-dom";
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
} from "@/components/ui/sidebar";

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
          title: "Date/Time Converter",
          url: "/date-time-converter",
          icon: CalendarClock,
        },
        {
          title: "Table Maker",
          url: "/date-time-converter",
          icon: CalendarClock,
        },
      ],
    },
    {
      title: "Hosting",
      items: [
        {
          title: "Reverse Proxy Config",
          url: "/reverse-proxy-config",
          icon: Waypoints,
        },
      ],
    },
    {
      title: "Networking",
      items: [
        {
          title: "Subnet Calculator",
          url: "/subnet-calculator",
          icon: Workflow,
        },
      ],
    },
    {
      title: "Security",
      items: [
        {
          title: "Base64 Converter",
          url: "/base64-converter",
          icon: Binary,
        },
        {
          title: "Certificate Checker",
          url: "/certificate-checker",
          icon: ShieldCheck,
        },
        {
          title: "SSH Key Generator",
          url: "/ssh-key-generator",
          icon: KeyRound,
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation();

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
            {data.navMain.map((group) => (
              <SidebarMenuItem key={group.title}>
                <SidebarMenuButton asChild>
                  <span className="font-medium">{group.title}</span>
                </SidebarMenuButton>
                {group.items?.length ? (
                  <SidebarMenuSub>
                    {group.items.map((item) => (
                      <SidebarMenuSubItem key={item.title}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={location.pathname === item.url}
                        >
                          <a href={item.url} className="flex items-center space-x-2">
                            <item.icon />
                            <span>{item.title}</span>
                          </a>
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
  );
}
