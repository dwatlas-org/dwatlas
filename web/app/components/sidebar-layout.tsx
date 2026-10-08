import { Outlet } from "react-router";
import { MainNav } from "@/components/main-nav";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export function SidebarLayout() {
  return (
    <SidebarProvider>
      <MainNav />
      <SidebarInset className="bg-white">
        <main className="flex flex-1 flex-col bg-white">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
