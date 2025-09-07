"use client";

import Link from "next/link";
import { Users, LogOut, User as UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppContext } from "@/contexts/AppContext";
import { NotificationBell } from "./NotificationBell";

export function Header() {
  const { user, role, toggleRole } = useAppContext();
  const router = useRouter();

  const handleLogout = () => {
    // Simulate logout
    router.push('/');
  };

  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-card px-4 md:px-6 z-50">
      <nav className="flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          href="#"
          className="flex items-center gap-2 text-lg font-semibold md:text-base text-primary"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M5 18a4 4 0 0 1-4-4 4 4 0 0 1 4-4h1c.28 0 .55.03.81.08"/><path d="M19 6a4 4 0 0 1 4 4 4 4 0 0 1-4 4h-1c-.28 0-.55-.03-.81-.08"/><path d="M10.2 20.8a2 2 0 0 0 3.6 0"/><path d="M7 10h10"/><path d="m9 10 1.95-3.46a2.05 2.05 0 0 1 3.61 1.93L13 10l-1.95 3.46a2.05 2.05 0 0 1-3.61-1.93L9 10Z"/></svg>
          <span className="sr-only">ASAP</span>
        </Link>
        <h1 className="text-xl font-headline font-bold text-foreground">
            {role === 'customer' ? 'Customer Dashboard' : 'Porter Dashboard'}
        </h1>
      </nav>
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <div className="ml-auto flex-1 sm:flex-initial">
          {/* spacer */}
        </div>
        <Button variant="ghost" size="icon" onClick={toggleRole} aria-label="Switch Role">
          <Users className="h-5 w-5" />
        </Button>
        <NotificationBell />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <UserIcon className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled>Profile</DropdownMenuItem>
            <DropdownMenuItem disabled>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4"/>
                Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
