import { AppSidebar } from "@/components/AppSidebar";
import Navbar from "@/components/Navbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

interface AppLayoutProps {
  children: React.ReactNode;
}

function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <main className="w-full">
          <Navbar />
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default AppLayout