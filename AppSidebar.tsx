
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home,
  LayoutDashboard,
  Calendar,
  ClipboardList,
  Wrench,
  Settings,
  Bell,
  HelpCircle,
  Clock,
  LogOut,
  FileInput,
  Brain,
  Book,
} from 'lucide-react';
import Image from 'next/image';
import { signOut } from 'firebase/auth';
import { useAuth } from '@/firebase/provider';

import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarSeparator,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './ui/collapsible';

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const auth = useAuth();

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
      router.push('/login');
    }
  };

  const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/calendar', label: 'Calendar', icon: Calendar },
    { href: '/schedule', label: 'Timetable', icon: Book },
    { href: '/tasks', label: 'Tasks & Activities', icon: ClipboardList },
    { href: '/tasks/exams', label: 'Thinkathon', icon: Brain },
    {
      id: 'tools',
      label: 'Tools',
      icon: Wrench,
      href: '/tools',
      subMenu: [
        { href: '/tools/timer', label: 'Focus Timer', icon: Clock },
        {
          href: '/tools/notifications',
          label: 'Notifications',
          icon: Bell,
        },
        {
          href: '/tools/data',
          label: 'Data Import/Export',
          icon: FileInput,
        },
        { href: '/tools/settings', label: 'Settings', icon: Settings },
        { href: '/tools/help', label: 'Help Center', icon: HelpCircle },
      ],
    },
  ];

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          
          <span className="text-lg font-semibold">Planify</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {menuItems.map((item) =>
            item.subMenu ? (
              <Collapsible
                key={item.id}
                className="w-full"
                defaultOpen={pathname.startsWith(item.href!)}
              >
                <CollapsibleTrigger asChild>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname.startsWith(item.href || '/tools')}
                      className="w-full justify-start"
                    >
                      <Link href={item.href || '#'}>
                        <item.icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.subMenu.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.href}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={pathname === subItem.href}
                        >
                          <Link href={subItem.href}>
                            <subItem.icon />
                            <span>{subItem.label}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>
            ) : (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={pathname.startsWith(item.href!)}>
                  <Link href={item.href!}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          )}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarSeparator />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout}>
              <LogOut />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
