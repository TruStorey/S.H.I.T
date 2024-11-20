import { ThemeProvider } from "@/components/ui/theme-provider";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { AppSidebar } from "@/components/app/sidebar";
import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
            <div className="flex-1"></div>
            <Button
              variant="outline"
              size="icon"
              className="ml-auto"
              onClick={() => window.open("https://github.com/TruStorey/", "_blank")}
            >
              <Github />
            </Button>
            <ModeToggle className="ml-auto" />
          </header>

          {/* Content */}
          <main className="flex-1 p-4">{children}</main>

          {/* Footer */}
          <footer className="flex h-10 items-center justify-end text-end gap-2 border-t px-3">
            <div className="flex-1">💩</div>
          </footer>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default Layout;
