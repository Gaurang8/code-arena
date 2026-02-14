"use client";

import * as React from "react";
import {
  CodeXml,
  FileQuestion,
  Group,
  Languages,
  LayoutDashboard,
  LifeBuoy,
  ListTodo,
  Send,
  User2,
  UsersIcon,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavProjects } from "./Sidebar-items";
import { NavSecondary } from "./Sidebar-items-secondary";
import { NavUser } from "./Sidebar-user";

const data = {
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
    {
      title: "Tasks",
      url: "/tasks",
      icon: ListTodo,
    },
  ],
  analytics: [
    {
      name: "Dashboard",
      url: "/",
      icon: LayoutDashboard,
    },
  ],
  accounts: [
    {
      name: "Users",
      url: "/users",
      icon: User2,
    },
    {
      name: "Teams",
      url: "#",
      icon: UsersIcon,
    },
  ],
  problems: [
    {
      name: "Problems",
      url: "/problems",
      icon: FileQuestion,
    },
    {
      name: "Categories",
      url: "#",
      icon: Group,
    },
    {
      name: "Languages",
      url: "#",
      icon: Languages,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <CodeXml className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-bold">Code Arena</span>
                  <span className="truncate text-xs">Management plateform</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavProjects title="Analytics" projects={data.analytics} />
        <NavProjects title="Accounts" projects={data.accounts} />
        <NavProjects title="Problems" projects={data.problems} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
