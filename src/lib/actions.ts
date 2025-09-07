"use server";

import { generateSmartNotification, type SmartNotificationInput } from '@/ai/flows/smart-notifications';
import type { DeliveryRequest, DeliveryStatus } from '@/types';

export async function getSmartNotification(
  request: DeliveryRequest,
  newStatus: DeliveryStatus,
  eta?: string
) {
  try {
    const input: SmartNotificationInput = {
      requestId: request.id,
      status: newStatus,
      requesterName: request.requesterName,
      porterName: request.porterName,
      packageDetails: request.packageDetails,
      eta: eta || request.eta,
      location: request.location,
    };

    const notification = await generateSmartNotification(input);
    return notification;
  } catch (error) {
    console.error("Error generating smart notification:", error);
    // Fallback to a simple notification
    return {
      notificationTitle: `Update for #${request.id}`,
      notificationBody: `Your delivery status is now: ${newStatus}.`,
    };
  }
}
