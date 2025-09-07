"use client";

import { useAppContext } from "@/contexts/AppContext";
import { RequestCard } from "./RequestCard";
import { NewRequestDialog } from "./NewRequestDialog";
import { FloatingActionButton } from "./FloatingActionButton";

export function CustomerDashboard() {
  const { requests, user } = useAppContext();

  if (!user) return null;

  const myRequests = requests.filter(r => r.requesterName === user.name);
  const activeRequests = myRequests.filter(r => r.status === 'accepted' || r.status === 'in_transit');
  const pastRequests = myRequests.filter(r => r.status === 'delivered' || r.status === 'cancelled');

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-headline font-bold tracking-tight mb-4">Active Deliveries</h2>
        {activeRequests.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {activeRequests.map((request) => (
              <RequestCard key={request.id} request={request} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">You have no active deliveries.</p>
          </div>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-headline font-bold tracking-tight mb-4">Delivery History</h2>
        {pastRequests.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {pastRequests.map((request) => (
                <RequestCard key={request.id} request={request} />
                ))}
            </div>
        ) : (
            <div className="text-center py-10 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">Your delivery history is empty.</p>
            </div>
        )}
      </section>
      
      <NewRequestDialog>
        <FloatingActionButton />
      </NewRequestDialog>
    </div>
  );
}
