import { Outlet } from "react-router";
import { MainNav } from "@/components/main-nav";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export function SidebarLayout() {
  return (
    <SidebarProvider>
      <MainNav />
      <SidebarInset>
        {/*<header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="md:hidden -ml-1" />
          <h3 className="text-xl font-semibold">Data Panels</h3>
          <Separator orientation="vertical" className="mr-2 h-4" />
        </header>*/}
        <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
