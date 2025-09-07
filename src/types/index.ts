export type DeliveryStatus = 'pending' | 'accepted' | 'in_transit' | 'delivered' | 'cancelled';
export type UserRole = 'customer' | 'porter';

export interface DeliveryRequest {
  id: string;
  requesterName: string;
  packageDetails: string;
  location: string;
  deliveryInstructions: string;
  status: DeliveryStatus;
  porterName?: string;
  eta?: string; // in minutes
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  name: string;
  email: string;
  phone: string;
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  createdAt: Date;
  read: boolean;
}
