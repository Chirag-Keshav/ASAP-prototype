"use client";

import { useAppContext } from "@/contexts/AppContext";
import { RequestCard } from "./RequestCard";

export function PorterDashboard() {
  const { requests, user } = useAppContext();

  if (!user) return null;

  // For demo purposes, we'll assign a name to the porter
  const porterName = "Porter Pete";

  const myAcceptedRequests = requests.filter(
    (r) => r.porterName === porterName && (r.status === 'accepted' || r.status === 'in_transit')
  );
  const availableRequests = requests.filter((r) => r.status === 'pending');

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-headline font-bold tracking-tight mb-4">My Active Deliveries</h2>
        {myAcceptedRequests.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {myAcceptedRequests.map((request) => (
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
        <h2 className="text-2xl font-headline font-bold tracking-tight mb-4">Available Requests</h2>
        {availableRequests.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {availableRequests.map((request) => (
              <RequestCard key={request.id} request={request} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">No available requests at the moment.</p>
          </div>
        )}
      </section>
    </div>
  );
}
