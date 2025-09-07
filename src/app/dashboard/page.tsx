"use client";

import { CustomerDashboard } from "@/components/dashboard/CustomerDashboard";
import { PorterDashboard } from "@/components/dashboard/PorterDashboard";
import { useAppContext } from "@/contexts/AppContext";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const { role, user } = useAppContext();

  if (!user) {
    // This can be a loading state or a redirect
    return (
       <div className="space-y-4">
        <Skeleton className="h-10 w-1/4" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }

  return (
    <>
      {role === 'customer' ? <CustomerDashboard /> : <PorterDashboard />}
    </>
  );
}
