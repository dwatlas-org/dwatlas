"use client";

import * as React from "react";
import { NavLink } from "react-router";
import {
  Search,
  LayoutGrid,
  Bell,
  Bookmark,
  CircleUser,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { getGroupFirstPanelSlug, panelGroups } from "@/lib/panels";

const footerLinks = [
  { title: "About us", url: "#" },
  { title: "Research", url: "#" },
  { title: "Methodology", url: "#" },
  { title: "Data dictionary", url: "#" },
  { title: "Analysis", url: "#" },
  { title: "Glossary", url: "#" },
  { title: "FAQ", url: "#" },
  { title: "Contact", url: "#" },
];

export function MainNav({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { toggleSidebar, state, isMobile } = useSidebar();

  // Only use the collapsed (icon-only) UI on desktop.
  // On mobile, force the expanded UI since it opens as a drawer/sheet.
  const isCollapsed = state === "collapsed" && !isMobile;

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-slate-200 bg-white"
      {...props}
    >
      {isCollapsed ? (
        <>
          <SidebarHeader className="flex flex-col items-center gap-4 py-4 px-2">
            <Tooltip>
              <TooltipTrigger
                render={
                  <button
                    type="button"
                    onClick={toggleSidebar}
                    aria-label="Expand Sidebar"
                    className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors hover:bg-blue-100"
                  >
                    <ChevronRight className="size-5" />
                  </button>
                }
              />
              <TooltipContent side="right">Expand Sidebar</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger
                render={
                  <button
                    type="button"
                    onClick={toggleSidebar}
                    aria-label="Search indicators"
                    className="flex size-10 items-center justify-center rounded-lg text-slate-800 transition-colors hover:bg-slate-100"
                  >
                    <Search className="size-6" />
                  </button>
                }
              />
              <TooltipContent side="right">Search indicators</TooltipContent>
            </Tooltip>
          </SidebarHeader>

          <SidebarContent className="no-scrollbar flex flex-col items-center gap-3 py-2 px-2">
            <Tooltip>
              <TooltipTrigger
                render={
                  <NavLink
                    to="/"
                    aria-label="Home"
                    className="flex size-10 items-center justify-center rounded-lg text-slate-800 transition-colors hover:bg-slate-100"
                  >
                    <LayoutGrid className="size-6" />
                  </NavLink>
                }
              />
              <TooltipContent side="right">Home</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger
                render={
                  <NavLink
                    to="#"
                    aria-label="Notifications"
                    className="relative flex size-10 items-center justify-center rounded-lg text-slate-800 transition-colors hover:bg-slate-100"
                  >
                    <Bell className="size-6" />
                    <span className="absolute right-1.5 bottom-1.5 size-2 rounded-full bg-orange-500" />
                  </NavLink>
                }
              />
              <TooltipContent side="right">Notifications (3)</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger
                render={
                  <NavLink
                    to="#"
                    aria-label="Saved Visualisations"
                    className="relative flex size-10 items-center justify-center rounded-lg text-slate-800 transition-colors hover:bg-slate-100"
                  >
                    <Bookmark className="size-6" />
                    <span className="absolute right-1.5 bottom-1.5 size-2 rounded-full bg-orange-500" />
                  </NavLink>
                }
              />
              <TooltipContent side="right">
                Saved Visualisations (1)
              </TooltipContent>
            </Tooltip>

            {panelGroups.map((item) => {
              const firstPanelSlug = getGroupFirstPanelSlug(item);
              const icon = firstPanelSlug ? (
                <NavLink
                  to={`/panels/${firstPanelSlug}`}
                  aria-label={item.title}
                  className={({ isActive }) =>
                    cn(
                      "flex size-10 items-center justify-center rounded-lg transition-colors",
                      isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-blue-600 hover:bg-blue-50",
                    )
                  }
                >
                  <item.icon className="size-6" />
                </NavLink>
              ) : (
                <span
                  aria-label={item.title}
                  className="flex size-10 cursor-not-allowed items-center justify-center rounded-lg text-slate-300"
                >
                  <item.icon className="size-6" />
                </span>
              );

              return (
                <Tooltip key={item.title}>
                  <TooltipTrigger render={icon} />
                  <TooltipContent side="right">{item.title}</TooltipContent>
                </Tooltip>
              );
            })}
          </SidebarContent>

          <SidebarFooter className="flex items-center justify-center bg-white p-3">
            <Tooltip>
              <TooltipTrigger
                render={
                  <NavLink
                    to="#profile"
                    aria-label="Profile"
                    className="flex size-10 items-center justify-center rounded-lg text-slate-900 transition-colors hover:bg-slate-100"
                  >
                    <CircleUser className="size-7" />
                  </NavLink>
                }
              />
              <TooltipContent side="right">Profile</TooltipContent>
            </Tooltip>
          </SidebarFooter>
        </>
      ) : (
        <>
          <SidebarHeader className="p-4 pb-2">
            <div className="flex items-center justify-between gap-2">
              <div className="select-none text-xl font-bold tracking-tight text-slate-900">
                DeliveryWorker<span className="text-orange-500">Atlas</span>
              </div>
              <button
                type="button"
                onClick={toggleSidebar}
                aria-label="Toggle Sidebar"
                className="flex size-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition-colors hover:bg-blue-100"
              >
                <ChevronLeft className="size-4" />
              </button>
            </div>

            <div className="mt-3 flex items-center gap-2 rounded-lg bg-slate-100/90 px-3 py-2 text-slate-500">
              <Search className="size-4 shrink-0 text-slate-600" />
              <input
                type="text"
                placeholder="Search indicators..."
                className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none"
              />
            </div>
          </SidebarHeader>

          <SidebarContent className="no-scrollbar px-3 py-1">
            <SidebarMenu className="gap-1">
              <SidebarMenuItem>
                <SidebarMenuButton className="h-10 px-3 font-semibold text-slate-900 hover:bg-slate-100">
                  <LayoutGrid className="size-5 shrink-0 text-slate-900" />
                  <NavLink to="/">
                    <span className="text-sm font-semibold">Home</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton className="h-10 px-3 font-semibold text-slate-900 hover:bg-slate-100">
                  <Bell className="size-5 shrink-0 text-slate-900" />
                  <NavLink to="#">
                    <span className="text-sm font-semibold">Notifications</span>
                  </NavLink>
                  <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-100 px-1.5 text-xs font-bold text-orange-600">
                    3
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton className="h-10 px-3 font-semibold text-slate-900 hover:bg-slate-100">
                  <Bookmark className="size-5 shrink-0 text-slate-900" />
                  <span className="text-sm font-semibold">
                    Saved Visualisations
                  </span>
                  <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-100 px-1.5 text-xs font-bold text-orange-600">
                    1
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>

            <div className="mb-1 mt-4 px-3 text-xs font-bold uppercase tracking-wider text-slate-400">
              DATA DASHBOARD
            </div>

            <SidebarMenu className="gap-0.5">
              {panelGroups.map((item) => (
                <Collapsible
                  key={item.title}
                  defaultOpen={item.defaultOpen}
                  className="group/collapsible"
                  render={<SidebarMenuItem />}
                >
                  <CollapsibleTrigger
                    render={
                      <SidebarMenuButton className="h-10 px-3 font-medium text-slate-900 hover:bg-slate-100" />
                    }
                  >
                    <item.icon className="size-5 shrink-0 text-blue-500" />
                    <span className="text-sm font-medium text-slate-900">
                      {item.title}
                    </span>
                    <ChevronDown className="ml-auto size-4 text-slate-500 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="flex flex-col py-1 pl-8 pr-2">
                      {item.items.map((subItem) =>
                        subItem.view ? (
                          <NavLink
                            key={subItem.slug}
                            to={`/panels/${subItem.slug}`}
                            className={({ isActive }) =>
                              cn(
                                "flex items-center rounded-md py-1.5 px-2 text-sm transition-colors",
                                isActive
                                  ? "font-semibold text-slate-900"
                                  : "font-normal text-slate-600 hover:text-slate-900 hover:bg-slate-50",
                              )
                            }
                          >
                            <span>{subItem.title}</span>
                          </NavLink>
                        ) : (
                          <span
                            key={subItem.slug}
                            aria-disabled="true"
                            className="flex cursor-not-allowed items-center rounded-md py-1.5 px-2 text-sm font-normal text-slate-300"
                          >
                            <span>{subItem.title}</span>
                          </span>
                        ),
                      )}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="bg-slate-950 p-4 text-white">
            <Collapsible defaultOpen={false} className="group/footer">
              <div className="flex items-center justify-between rounded-md p-1 transition-colors hover:bg-slate-900">
                <a href="#profile" className="flex flex-1 items-center gap-2.5">
                  <CircleUser className="size-5 text-white" />
                  <span className="text-sm font-bold text-white">Profile</span>
                </a>

                <CollapsibleTrigger>
                  <button
                    type="button"
                    aria-label="Toggle Footer Navigation"
                    className="-mr-1 flex items-center justify-center rounded-md p-1 transition-colors hover:bg-slate-900"
                  >
                    <ChevronRight className="size-4 text-white transition-transform duration-200 group-data-[state=open]/footer:rotate-90" />
                  </button>
                </CollapsibleTrigger>
              </div>

              <CollapsibleContent>
                <div className="mt-3 flex items-center justify-between px-1">
                  <span className="text-xs font-medium text-slate-400">
                    Language
                  </span>
                  <button
                    type="button"
                    className="flex items-center gap-1.5 rounded-md bg-slate-200 px-2.5 py-1 text-xs font-bold text-slate-900 transition-colors hover:bg-white"
                  >
                    <span>EN-GB</span>
                    <ChevronDown className="size-3.5" />
                  </button>
                </div>

                <div className="mb-1 mt-3 flex flex-col gap-2 px-1 pb-1">
                  {footerLinks.map((link) => (
                    <a
                      key={link.title}
                      href={link.url}
                      className="text-xs font-normal text-slate-400 transition-colors hover:text-white"
                    >
                      {link.title}
                    </a>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </SidebarFooter>
        </>
      )}

      {/* Renders safely outside the conditional blocks */}
      <SidebarRail />
    </Sidebar>
  );
}
