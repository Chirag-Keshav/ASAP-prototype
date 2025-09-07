"use client";

import { Bell } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAppContext } from "@/contexts/AppContext";
import { Card, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";

export function NotificationBell() {
  const { notifications, getUnreadNotificationCount, markNotificationsAsRead } = useAppContext();
  const unreadCount = getUnreadNotificationCount();

  return (
    <Popover onOpenChange={(open) => {
        if (open) {
            markNotificationsAsRead();
        }
    }}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-destructive-foreground bg-destructive rounded-full transform translate-x-1/2 -translate-y-1/2">
              {unreadCount}
            </span>
          )}
          <span className="sr-only">Toggle notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <Card>
            <CardHeader>
                <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <ScrollArea className="h-96">
                <div className="p-4 pt-0">
                {notifications.length === 0 ? (
                    <div className="text-center text-sm text-muted-foreground py-10">
                        You have no new notifications.
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                    {notifications.map((notif) => (
                        <div key={notif.id} className="grid items-start gap-2">
                            <p className="font-semibold">{notif.title}</p>
                            <p className="text-sm text-muted-foreground">{notif.body}</p>
                            <p className="text-xs text-muted-foreground">
                                {formatDistanceToNow(notif.createdAt, { addSuffix: true })}
                            </p>
                        </div>
                    ))}
                    </div>
                )}
                </div>
            </ScrollArea>
        </Card>
      </PopoverContent>
    </Popover>
  );
}
