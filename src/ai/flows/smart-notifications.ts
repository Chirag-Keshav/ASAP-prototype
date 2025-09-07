'use server';

/**
 * @fileOverview Implements a smart notification system for delivery requests.
 *
 * This file defines a Genkit flow that determines the content of push notifications
 * based on the current status of a delivery request, using tool calling to decide
 * whether to include certain details.
 *
 * - `generateSmartNotification` - The main function to generate the notification content.
 * - `SmartNotificationInput` - The input type for the `generateSmartNotification` function.
 * - `SmartNotificationOutput` - The return type for the `generateSmartNotification` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define Zod schemas for input and output types
const SmartNotificationInputSchema = z.object({
  requestId: z.string().describe('The unique identifier for the delivery request.'),
  status: z.enum(['pending', 'accepted', 'in_transit', 'delivered', 'cancelled']).describe('The current status of the delivery request.'),
  requesterName: z.string().describe('The name of the user who made the delivery request.'),
  porterName: z.string().optional().describe('The name of the porter assigned to the delivery request, if any.'),
  packageDetails: z.string().optional().describe('Details about the package being delivered.'),
  eta: z.string().optional().describe('Estimated Time of Arrival, if available.'),
  location: z.string().describe('Delivery Location'),
});
export type SmartNotificationInput = z.infer<typeof SmartNotificationInputSchema>;

const SmartNotificationOutputSchema = z.object({
  notificationTitle: z.string().describe('The title of the push notification.'),
  notificationBody: z.string().describe('The body of the push notification.'),
});
export type SmartNotificationOutput = z.infer<typeof SmartNotificationOutputSchema>;

// Define a tool to decide whether to include package details in the notification
const shouldIncludeDetails = ai.defineTool({
  name: 'shouldIncludeDetails',
  description: 'Determines whether to include package details in the notification based on the status and context of the delivery request.',
  inputSchema: z.object({
    status: z.enum(['pending', 'accepted', 'in_transit', 'delivered', 'cancelled']).describe('The current status of the delivery request.'),
  }),
  outputSchema: z.boolean().describe('A boolean indicating whether to include package details (true) or not (false).'),
}, async (input) => {
  // Implement logic to decide whether to include details based on status
  // For example, don't include details for pending or delivered requests
  return input.status !== 'pending' && input.status !== 'delivered';
});

// Define the prompt for generating the smart notification
const smartNotificationPrompt = ai.definePrompt({
  name: 'smartNotificationPrompt',
  input: {schema: SmartNotificationInputSchema},
  output: {schema: SmartNotificationOutputSchema},
  tools: [shouldIncludeDetails],
  system: `You are a notification specialist. Your job is to create concise and informative push notifications for a delivery service.

  Based on the delivery request status, requester name, and the output of the "shouldIncludeDetails" tool, craft a notification title and body.

  If the tool returns true, include package details in the notification body. Otherwise, keep the notification brief.
  The location should always be included.`,
  prompt: `Delivery Request Update:

  Request ID: {{{requestId}}}
  Status: {{{status}}}
  Requester: {{{requesterName}}}
  Porter: {{{porterName}}}
  Location: {{{location}}}

  Include Details: {{ call shouldIncludeDetails status=status }}

  {% if shouldIncludeDetails == true %}
  Package Details: {{{packageDetails}}}
  {% endif %}

  {% if eta %}
  ETA: {{{eta}}}
  {% endif %}
  `,
});

// Define the Genkit flow
const smartNotificationFlow = ai.defineFlow({
  name: 'smartNotificationFlow',
  inputSchema: SmartNotificationInputSchema,
  outputSchema: SmartNotificationOutputSchema,
}, async (input) => {
  const {output} = await smartNotificationPrompt(input);
  return output!;
});

/**
 * Generates a smart, contextual push notification for delivery requests.
 * @param input - The input parameters for generating the notification.
 * @returns A promise that resolves to the generated notification content.
 */
export async function generateSmartNotification(input: SmartNotificationInput): Promise<SmartNotificationOutput> {
  return smartNotificationFlow(input);
}
