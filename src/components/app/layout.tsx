import { ThemeProvider } from "@/components/ui/theme-provider";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { AppSidebar } from "@/components/app/sidebar";
import { Github, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useLocation, Link } from "react-router-dom";
import React from "react";

// Path-to-Breadcrumb Mapping
const breadcrumbMap = {
  "/": "Home",
  "/transform-list": "Transform Lists",
  "/date-time-converter": "Date/Time Converter",
  "/reverse-proxy-config": "Reverse Proxy Config",
  "/subnet-calculator": "Visual Subnet Calculator",
  "/base64-converter": "Base64 String Converter",
  "/certificate-checker": "Certificate Checker",
  "/ssh-key-generator": "SSH Key Generator",
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  // Generate breadcrumbs
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const breadcrumbs = pathSegments.map((segment, index) => {
    const path = `/${pathSegments.slice(0, index + 1).join("/")}`;
    return {
      label: breadcrumbMap[path] || segment,
      path,
    };
  });

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SidebarProvider>
        <AppSidebar />

        {/* Main Content Area */}
        <div className="flex flex-col flex-1">
          {/* Header */}
          <header className="flex h-14 items-center gap-2 border-b px-3">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                {/* Add "Home" as the root breadcrumb */}
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                {breadcrumbs.map((breadcrumb, index) => (
                  <BreadcrumbItem key={breadcrumb.path}>
                    {index < breadcrumbs.length - 1 ? (
                      <>
                        <BreadcrumbLink asChild>
                          <Link to={breadcrumb.path}>{breadcrumb.label}</Link>
                        </BreadcrumbLink>
                        <BreadcrumbSeparator />
                      </>
                    ) : (
                      <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
            <div className="ml-auto space-x-1">
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  window.open("https://github.com/TruStorey/", "_blank")
                }
              >
                <Github />
              </Button>
              <ModeToggle />
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 p-4 overflow-auto">{children}</main>

          {/* Footer */}
          <footer className="flex h-10 items-center justify-end text-end gap-2 border-t px-3">
            <div className="ml-auto space-x-2">💩</div>
          </footer>
        </div>
      </SidebarProvider>
      <Toaster />
    </ThemeProvider>
  );
};

export default Layout;
