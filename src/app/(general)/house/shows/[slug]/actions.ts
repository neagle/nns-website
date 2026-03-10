"use server";

import { wixApiClient } from "@/lib/wixClient";

interface ToggleTicketCheckInInput {
  eventId: string;
  ticketNumber: string;
  checkedIn: boolean;
}

export const toggleTicketCheckIn = async ({
  eventId,
  ticketNumber,
  checkedIn,
}: ToggleTicketCheckInInput) => {
  if (!eventId) {
    throw new Error("Missing eventId");
  }

  if (!ticketNumber) {
    throw new Error("Missing ticketNumber");
  }

  if (checkedIn) {
    await wixApiClient.tickets.checkInTickets(eventId, {
      ticketNumber: [ticketNumber],
    });
  } else {
    await wixApiClient.tickets.deleteTicketCheckIns(eventId, {
      ticketNumber: [ticketNumber],
    });
  }

  return { success: true };
};
