"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useMemo } from 'react';
import type { DeliveryRequest, User, UserRole, AppNotification } from '@/types';
import { MOCK_DELIVERY_REQUESTS, MOCK_USER } from '@/lib/mock-data';

interface AppContextType {
  user: User | null;
  role: UserRole;
  requests: DeliveryRequest[];
  notifications: AppNotification[];
  toggleRole: () => void;
  addRequest: (request: DeliveryRequest) => void;
  updateRequest: (requestId: string, updates: Partial<DeliveryRequest>) => void;
  addNotification: (notification: Omit<AppNotification, 'id' | 'createdAt' | 'read'>) => void;
  markNotificationsAsRead: () => void;
  getUnreadNotificationCount: () => number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user] = useState<User | null>(MOCK_USER);
  const [role, setRole] = useState<UserRole>('customer');
  const [requests, setRequests] = useState<DeliveryRequest[]>(MOCK_DELIVERY_REQUESTS);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const toggleRole = () => {
    setRole((prevRole) => (prevRole === 'customer' ? 'porter' : 'customer'));
  };

  const addRequest = (request: DeliveryRequest) => {
    setRequests((prev) => [request, ...prev]);
  };
  
  const updateRequest = (requestId: string, updates: Partial<DeliveryRequest>) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === requestId ? { ...req, ...updates, updatedAt: new Date() } : req
      )
    );
  };

  const addNotification = (notification: Omit<AppNotification, 'id' | 'createdAt' | 'read'>) => {
    const newNotification: AppNotification = {
      ...notification,
      id: `notif-${Date.now()}`,
      createdAt: new Date(),
      read: false,
    };
    setNotifications((prev) => [newNotification, ...prev]);
  };

  const markNotificationsAsRead = () => {
    setNotifications((prev) => prev.map(n => ({ ...n, read: true })));
  };

  const getUnreadNotificationCount = () => {
    return notifications.filter(n => !n.read).length;
  };

  const contextValue = useMemo(
    () => ({
      user,
      role,
      requests,
      notifications,
      toggleRole,
      addRequest,
      updateRequest,
      addNotification,
      markNotificationsAsRead,
      getUnreadNotificationCount,
    }),
    [user, role, requests, notifications]
  );

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
