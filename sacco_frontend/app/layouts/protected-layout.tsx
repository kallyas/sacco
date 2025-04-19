// app/layouts/protected-layout.tsx
import { Outlet } from "react-router-dom";
import { AppSidebar } from "~/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "~/components/ui/breadcrumb";
import { Separator } from "~/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar";
import { useAuth } from "~/providers/auth-provider";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { UserNav } from "~/components/nav-user";
import { RequireAuth } from "~/components/auth/auth-route-guard";

export default function ProtectedLayout() {
  return (
    <RequireAuth>
      <ProtectedLayoutContent />
    </RequireAuth>
  );
}

function ProtectedLayoutContent() {
  const { user } = useAuth();

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Current Page</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* User navigation */}
          <div className="flex items-center gap-4">
            <UserNav
              user={{
                name: user ? `${user.first_name} ${user.last_name}` : "",
                email: user?.email || "",
                role: user?.role || "",
                imageUrl: "/api/placeholder/32/32",
              }}
            />
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-8">
          <Suspense fallback={<LoadingSpinner />}>
            <Outlet />
          </Suspense>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex h-full items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}
