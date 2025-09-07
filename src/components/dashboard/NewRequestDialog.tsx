"use client";

import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, PackagePlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppContext } from "@/contexts/AppContext";
import { MOCK_HOSTELS } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";
import type { DeliveryRequest } from "@/types";
import { getSmartNotification } from "@/lib/actions";

const requestSchema = z.object({
  packageDetails: z.string().min(3, "Please describe the package.").max(100),
  location: z.string({ required_error: "Please select a location." }),
  deliveryInstructions: z.string().max(150).optional(),
});

export function NewRequestDialog({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user, addRequest, addNotification } = useAppContext();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof requestSchema>>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      packageDetails: "",
      deliveryInstructions: "",
    },
  });

  async function onSubmit(values: z.infer<typeof requestSchema>) {
    if (!user) return;
    setIsLoading(true);

    const newRequest: DeliveryRequest = {
      id: `req-${Date.now().toString().slice(-5)}`,
      requesterName: user.name,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
      ...values,
    };
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    addRequest(newRequest);

    const notification = await getSmartNotification(newRequest, 'pending');
    addNotification({
        title: notification.notificationTitle,
        body: notification.notificationBody,
    });

    setIsLoading(false);
    setOpen(false);
    form.reset();
    toast({
      title: "Request Submitted!",
      description: "A porter will accept your request soon.",
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PackagePlus /> New Delivery Request
          </DialogTitle>
          <DialogDescription>
            Fill in the details below to request a package delivery.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="packageDetails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Package Details</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Small black backpack" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Delivery Location</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a hostel or building" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {MOCK_HOSTELS.map((hostel) => (
                        <SelectItem key={hostel} value={hostel}>
                          {hostel}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="deliveryInstructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Delivery Instructions (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Leave with my roommate if I'm not there."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Request
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
