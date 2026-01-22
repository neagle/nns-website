"use client";
import React, { useEffect, useState } from "react";
import wixClient from "@/lib/wixClient";
import type { Event } from "@wix/auto_sdk_events_wix-events-v-2";
import type { Ticket } from "@/app/types";
import { Plus, Minus } from "lucide-react";
import classnames from "classnames";

// Currently, the Wix service fee is 2.5%
// It makes me nervous to have something like this hard-coded, but it doesn't
// seem to be present anywhere in the ticket info.
// That's not a *huge* deal, as the service fee is calculated and indicated in
// the next step of the purchasing process, but I think it's good to display the
// whole price up front.
const WIX_SERVICE_FEE = 0.025;

interface Props {
  event: Event;
  className?: string;
}

const Tickets = ({ event, className = "" }: Props) => {
  const [ticketInfo, setTicketInfo] = useState<Ticket | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [redirecting, setRedirecting] = useState<boolean>(false);

  const fetchTicketsAvailability = async (event: Event) => {
    // Wait -- used for debugging
    // await new Promise((resolve) => setTimeout(resolve, 10000));

    const tickets = await wixClient.orders.queryAvailableTickets({
      filter: { eventId: event._id },
      limit: 100,
    });

    const definitions = tickets.definitions || [];
    const ticket = definitions[0] as unknown as Ticket;
    setTicketInfo(ticket);
  };

  useEffect(() => {
    fetchTicketsAvailability(event);
  }, [event]);

  const createRedirect = async (
    event: Event,
    ticket: Ticket,
    quantity: number
  ) => {
    setRedirecting(true);
    const reservation = await wixClient.orders.createReservation(
      ticket.eventId,
      {
        ticketQuantities: [
          {
            ticketDefinitionId: ticket._id,
            quantity,
          },
        ],
      }
    );

    const redirect = await wixClient.redirects.createRedirectSession({
      eventsCheckout: { eventSlug: event.slug, reservationId: reservation._id },
      callbacks: { postFlowUrl: window.location.href },
    });

    if (!redirect.redirectSession) {
      console.error("No redirect session found");
      setRedirecting(false);
      return;
    }

    window.location.href = redirect.redirectSession.fullUrl || "/";
  };

  const currencySymbol = ticketInfo?.price.currency === "USD" ? "$" : "";
  const price = ticketInfo ? parseInt(ticketInfo?.price?.value) * quantity : 0;
  const serviceFee = ticketInfo
    ? parseInt(ticketInfo.price.value) * quantity * WIX_SERVICE_FEE
    : 0;
  const total = ticketInfo ? price + serviceFee : 0;

  return ticketInfo ? (
    <div className={classnames(className)}>
      <h3>Tickets</h3>
      <div className="flex gap-4 md:gap-8 flex-wrap">
        <section>
          <p className="uppercase text-sm opacity-70">Type</p>
          <p className="text-lg font-bold leading-tight">{ticketInfo.name}</p>
        </section>
        <section className="grow-1">
          <p className="uppercase text-sm opacity-70">Price</p>
          <div className="text-lg leading-tight">
            <span>{currencySymbol}</span>
            <span>{price.toFixed(2)}</span>
            <span className="text-xs block">
              +{currencySymbol}
              {serviceFee.toFixed(2)} ticket service fee
            </span>
          </div>
        </section>
        <section>
          <p className="uppercase text-sm opacity-70">Quantity</p>
          <div className="flex justify-between">
            <button
              className={classnames(
                {
                  "opacity-50": quantity <= 1,
                  "hover:scale-120": quantity > 1,
                },
                ["cursor-pointer", "p-1", "transform-all"]
              )}
              onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}
            >
              <Minus />
            </button>
            <span className="text-xl text-primary font-bold">{quantity}</span>
            <button
              className={classnames(
                {
                  "opacity-50": quantity >= ticketInfo.limitPerCheckout,
                  "hover:scale-120": quantity < ticketInfo.limitPerCheckout,
                },
                ["cursor-pointer", "p-1", "transform-all"]
              )}
              onClick={() =>
                setQuantity((prev) =>
                  Math.min(prev + 1, ticketInfo.limitPerCheckout)
                )
              }
            >
              <Plus />
            </button>
          </div>
        </section>
      </div>
      <section className="text-right">
        <p>
          <span className="opacity-70 uppercase text-sm">Total:</span>{" "}
          <span className="font-bold">
            {currencySymbol}
            {total.toFixed(2)}
          </span>
        </p>
        <button
          onClick={() => {
            if (!redirecting) {
              createRedirect(event, ticketInfo, quantity);
            }
          }}
          className={classnames({ "opacity-50": redirecting }, [
            "btn",
            "btn-primary",
            "btn-wide",
            "btn-sm",
            "mt-4",
          ])}
        >
          {!redirecting ? (
            "Checkout"
          ) : (
            <>
              Checking out
              <span className="loading loading-dots loading-sm"></span>
            </>
          )}
        </button>
      </section>
    </div>
  ) : null;
};

export default Tickets;
