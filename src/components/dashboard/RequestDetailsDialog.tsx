"use client";

import { useState } from "react";
import * as z from 'zod';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Package, User, MapPin, Clock, Truck, CheckCircle, XCircle, MessageSquare } from "lucide-react";
import { format } from 'date-fns';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { DeliveryRequest } from "@/types";
import { useAppContext } from "@/contexts/AppContext";
import { useToast } from "@/hooks/use-toast";
import { getSmartNotification } from "@/lib/actions";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface RequestDetailsDialogProps {
  request: DeliveryRequest;
  children: React.ReactNode;
}

const etaSchema = z.object({
    eta: z.string().min(1, 'Please provide an ETA.'),
});

const updateStatusSchema = z.object({
    status: z.enum(['in_transit', 'delivered', 'cancelled']),
});

export function RequestDetailsDialog({ request, children }: RequestDetailsDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [action, setAction] = useState<'accept' | 'update' | null>(null);

  const { updateRequest, addNotification, user } = useAppContext();
  const { toast } = useToast();

  const etaForm = useForm<z.infer<typeof etaSchema>>({
    resolver: zodResolver(etaSchema),
    defaultValues: {
        eta: '',
    }
  });

  const updateStatusForm = useForm<z.infer<typeof updateStatusSchema>>({
    resolver: zodResolver(updateStatusSchema),
  });

  const handleAccept = async (values: z.infer<typeof etaSchema>) => {
    if (!user) return;
    setIsLoading(true);

    const porterName = "Porter Pete"; // From user context in a real app
    
    updateRequest(request.id, { status: 'accepted', porterName, eta: values.eta });
    const notification = await getSmartNotification({ ...request, porterName, eta: values.eta }, 'accepted', values.eta);
    addNotification({ title: notification.notificationTitle, body: notification.notificationBody });
    
    toast({ title: "Request Accepted!", description: "The customer has been notified." });
    setIsLoading(false);
    setAction(null);
    setOpen(false);
  };
  
  const handleUpdateStatus = async (values: z.infer<typeof updateStatusSchema>) => {
      setIsLoading(true);

      updateRequest(request.id, { status: values.status });
      const notification = await getSmartNotification(request, values.status);
      addNotification({ title: notification.notificationTitle, body: notification.notificationBody });
      
      toast({ title: `Status Updated to ${values.status}`, description: "The customer has been notified." });
      setIsLoading(false);
      setAction(null);
      setOpen(false);
  };

  const handleDecline = async () => {
    setIsLoading(true);
    // In a real app, this would free up the request. Here we just close.
    await new Promise(res => setTimeout(res, 500));
    toast({ variant: 'destructive', title: 'Request Declined' });
    setIsLoading(false);
    setOpen(false);
  };
  
  const renderContent = () => {
    if (action === 'accept') {
        return (
            <Form {...etaForm}>
                <form onSubmit={etaForm.handleSubmit(handleAccept)} className="space-y-4">
                    <DialogHeader>
                        <DialogTitle>Accept Request</DialogTitle>
                        <DialogDescription>Estimate your time of arrival (ETA) to the delivery location.</DialogDescription>
                    </DialogHeader>
                    <FormField control={etaForm.control} name="eta" render={({field}) => (
                        <FormItem>
                            <FormLabel>ETA (in minutes)</FormLabel>
                            <FormControl><Input type="number" placeholder="e.g., 15" {...field} /></FormControl>
                            <FormMessage/>
                        </FormItem>
                    )} />
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setAction(null)}>Back</Button>
                        <Button type="submit" disabled={isLoading}>{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}Confirm Acceptance</Button>
                    </DialogFooter>
                </form>
            </Form>
        );
    }
    if (action === 'update') {
        return (
            <Form {...updateStatusForm}>
                <form onSubmit={updateStatusForm.handleSubmit(handleUpdateStatus)} className="space-y-4">
                    <DialogHeader>
                        <DialogTitle>Update Delivery Status</DialogTitle>
                        <DialogDescription>Change the current status of this delivery.</DialogDescription>
                    </DialogHeader>
                    <FormField control={updateStatusForm.control} name="status" render={({field}) => (
                         <FormItem>
                            <FormLabel>New Status</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Select new status" /></SelectTrigger></FormControl>
                                <SelectContent>
                                    <SelectItem value="in_transit"><Truck className="inline-block mr-2 h-4 w-4"/>In Transit</SelectItem>
                                    <SelectItem value="delivered"><CheckCircle className="inline-block mr-2 h-4 w-4"/>Delivered</SelectItem>
                                    <SelectItem value="cancelled"><XCircle className="inline-block mr-2 h-4 w-4"/>Cancel</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                         </FormItem>
                    )} />
                     <DialogFooter>
                        <Button variant="outline" onClick={() => setAction(null)}>Back</Button>
                        <Button type="submit" disabled={isLoading}>{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}Update Status</Button>
                    </DialogFooter>
                </form>
            </Form>
        )
    }

    // Default view: request details
    return (
        <>
            <DialogHeader>
                <DialogTitle>Delivery Request Details</DialogTitle>
                <DialogDescription>ID: {request.id}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 text-sm">
                <div className="flex items-start gap-3"><User className="h-4 w-4 mt-1 text-muted-foreground"/><p><span className="font-semibold">Requester:</span> {request.requesterName}</p></div>
                <div className="flex items-start gap-3"><MapPin className="h-4 w-4 mt-1 text-muted-foreground"/><p><span className="font-semibold">Location:</span> {request.location}</p></div>
                <div className="flex items-start gap-3"><Package className="h-4 w-4 mt-1 text-muted-foreground"/><p><span className="font-semibold">Package:</span> {request.packageDetails}</p></div>
                <div className="flex items-start gap-3"><MessageSquare className="h-4 w-4 mt-1 text-muted-foreground"/><p><span className="font-semibold">Instructions:</span> {request.deliveryInstructions || "None"}</p></div>
                <div className="flex items-start gap-3"><Clock className="h-4 w-4 mt-1 text-muted-foreground"/><p><span className="font-semibold">Requested At:</span> {format(request.createdAt, "PPP p")}</p></div>
            </div>
            <DialogFooter>
                {request.status === 'pending' && (
                    <>
                        <Button variant="destructive" onClick={handleDecline} disabled={isLoading}>{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}Decline</Button>
                        <Button onClick={() => setAction('accept')} disabled={isLoading}>{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}Accept</Button>
                    </>
                )}
                 { (request.status === 'accepted' || request.status === 'in_transit') && (
                    <Button onClick={() => setAction('update')} disabled={isLoading} className="w-full">{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}Update Status</Button>
                 )}
            </DialogFooter>
        </>
    );

  }


  return (
    <Dialog open={open} onOpenChange={(o) => {setOpen(o); if (!o) setAction(null);}}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}
