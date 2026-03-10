import React from "react";
import wixClient, { wixApiClient } from "@/lib/wixClient";
import { notFound } from "next/navigation";
import type { GroupedGuests } from "@/app/types";
import Guests from "./Guests";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

const getShowData = async (slug: string) => {
  const { event } = await wixClient.wixEventsV2.getEventBySlug(slug);

  return event;
};

const getGuests = async (eventId: string): Promise<GroupedGuests[]> => {
  const firstPage = await wixApiClient.guests
    .queryGuests({ fields: ["GUEST_DETAILS"] })
    .eq("eventId", eventId)
    .limit(1000)
    .find();

  const guests = [...firstPage.items];
  let currentPage = firstPage;

  while (currentPage.hasNext()) {
    currentPage = await currentPage.next();
    guests.push(...currentPage.items);
  }

  const groupedByOrder = new Map<string, GroupedGuests>();

  for (let index = 0; index < guests.length; index++) {
    const guest = guests[index];
    const groupKey =
      guest.orderNumber ||
      guest.contactId ||
      guest._id ||
      guest.ticketNumber ||
      `ungrouped-${index}`;

    const existingGroup = groupedByOrder.get(groupKey) || {
      buyer: null,
      tickets: [],
    };

    if (guest.guestType === "BUYER") {
      existingGroup.buyer = guest;
    } else if (guest.guestType === "TICKET_HOLDER") {
      existingGroup.tickets.push(guest);
    }

    groupedByOrder.set(groupKey, existingGroup);
  }

  console.log("groupedByOrder", groupedByOrder);

  return Array.from(groupedByOrder.values());
};

const page = async ({ params }: Props) => {
  const { slug } = await params;
  const showData = await getShowData(slug);

  if (!showData?._id) {
    notFound();
  }

  const groupedGuests = await getGuests(showData._id);

  return (
    <div className="p-4 md:p-6 xl:p-8">
      <h1>{showData.title || slug}</h1>

      <h2 className="mt-6 text-lg font-semibold">Attendees</h2>
      <Guests data={groupedGuests} eventId={showData._id} />
    </div>
  );
};

export default page;
