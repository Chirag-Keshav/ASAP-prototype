"use client";

import { formatDistanceToNow } from 'date-fns';
import { Package, User, MapPin, Clock, Truck, CheckCircle2, XCircle, Hourglass } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { DeliveryRequest, DeliveryStatus } from '@/types';
import { useAppContext } from '@/contexts/AppContext';
import { Progress } from '../ui/progress';
import { RequestDetailsDialog } from './RequestDetailsDialog';
import { Button } from '../ui/button';

interface RequestCardProps {
  request: DeliveryRequest;
}

const statusConfig: Record<DeliveryStatus, { icon: React.ElementType; label: string; color: string; progress: number }> = {
  pending: { icon: Hourglass, label: 'Pending', color: 'bg-yellow-500', progress: 10 },
  accepted: { icon: Package, label: 'Accepted', color: 'bg-blue-500', progress: 33 },
  in_transit: { icon: Truck, label: 'In Transit', color: 'bg-indigo-500', progress: 66 },
  delivered: { icon: CheckCircle2, label: 'Delivered', color: 'bg-green-500', progress: 100 },
  cancelled: { icon: XCircle, label: 'Cancelled', color: 'bg-red-500', progress: 0 },
};

export function RequestCard({ request }: RequestCardProps) {
  const { role } = useAppContext();
  const config = statusConfig[request.status];

  const getProgressValue = () => {
    if (request.status === 'delivered') return 100;
    if (request.status === 'cancelled') return 0;
    const progressWithEta = request.eta ? config.progress + Math.min(10, (15 - parseInt(request.eta, 10)) / 15 * 10) : config.progress;
    return progressWithEta;
  }

  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-bold font-headline leading-tight">
                {role === 'customer' ? `Delivery to ${request.location}` : `Request from ${request.requesterName}`}
            </CardTitle>
            <Badge variant="outline" className="shrink-0 ml-2">
                <config.icon className="mr-1 h-3 w-3" />
                {config.label}
            </Badge>
        </div>
        <CardDescription>
            ID: {request.id}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-3 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Package className="h-4 w-4" /> <span>{request.packageDetails}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          {role === 'customer' ? <User className="h-4 w-4"/> : <MapPin className="h-4 w-4"/>}
          <span>{role === 'customer' ? `By: ${request.porterName || 'Unassigned'}` : `To: ${request.location}`}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="h-4 w-4" /> 
          <span>{formatDistanceToNow(request.createdAt, { addSuffix: true })}</span>
        </div>
        {request.status === 'in_transit' && request.eta && (
            <div className="flex items-center gap-2 text-primary font-semibold">
                <Truck className="h-4 w-4 animate-pulse" /> 
                <span>ETA: {request.eta} minutes</span>
            </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-2">
         {request.status !== 'cancelled' && (
             <>
                <Progress value={getProgressValue()} className="h-2 w-full" />
                <span className="text-xs text-muted-foreground w-full text-center">{config.label}</span>
             </>
         )}
        {role === 'porter' && request.status === 'pending' && (
          <RequestDetailsDialog request={request}>
            <Button className="w-full mt-2">View Details</Button>
          </RequestDetailsDialog>
        )}
        {role === 'porter' && (request.status === 'accepted' || request.status === 'in_transit') && (
            <RequestDetailsDialog request={request}>
              <Button variant="outline" className="w-full mt-2">Update Status</Button>
            </RequestDetailsDialog>
        )}
      </CardFooter>
    </Card>
  );
}
