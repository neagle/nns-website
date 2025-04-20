"use client";

import React, { useState, MouseEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { V3Event } from "@wix/auto_sdk_events_wix-events-v-2";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import classnames from "classnames";
import wixClient from "@/lib/wixClient";
import type { Ticket } from "@/app/types";
import { X, Plus, Minus } from "lucide-react";
import Link from "next/link";

type Props = {
  event: V3Event;
  className?: string;
};

const ShowTime = ({ event, className = "" }: Props) => {
  dayjs.extend(utc);
  dayjs.extend(timezone);

  const [ticketInfo, setTicketInfo] = useState<Ticket | null>(null);
  const [numTickets, setNumTickets] = useState(1);
  const [redirecting, setRedirecting] = useState(false);
  const [showTicketInfo, setShowTicketInfo] = useState(false);

  // The first step in the ticket purchase flow is to check if tickets are
  // available
  const fetchTicketsAvailability = async (event: V3Event) => {
    // Wait -- used for debugging
    // await new Promise((resolve) => setTimeout(resolve, 10000));

    const tickets = await wixClient.orders.queryAvailableTickets({
      filter: { eventId: event._id },
      limit: 100,
    });

    const ticket = tickets.definitions[0] as unknown as Ticket;
    setTicketInfo(ticket);
  };

  const createRedirect = async (
    event: V3Event,
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

    window.location.href = redirect.redirectSession.fullUrl;
  };

  if (!event.dateAndTimeSettings) {
    setRedirecting(false);
    return;
  }

  const startDate = dayjs(event.dateAndTimeSettings.startDate).tz(
    "America/New_York"
  );
  // Set showType based on whether the startDate is before or after 5 PM
  const showType = startDate.hour() < 17 ? "Matinee" : "Night";

  const handleClick = async (e: MouseEvent) => {
    e.preventDefault();

    if (!event._id) {
      console.error("Event ID is missing");
      setRedirecting(false);
      return;
    }

    setShowTicketInfo(true);
    fetchTicketsAvailability(event);
  };

  // Try to anticipate clicks a little bit by fetching ticket info on mouse
  // hover
  const handleHover = () => {
    if (!ticketInfo) {
      fetchTicketsAvailability(event);
    }
  };

  return (
    <div
      onMouseEnter={handleHover}
      className={classnames(
        className,
        {
          "cursor-pointer": !showTicketInfo,
          "cursor-default": showTicketInfo,
          "hover:scale-105": !showTicketInfo,
        },
        {
          "bg-info/25": event.status !== "CANCELED",
          "hover:bg-info/40": event.status !== "CANCELED",
          "bg-error/25": event.status === "CANCELED",
          "hover:bg-error/25": event.status === "CANCELED",
          "scale-105": showTicketInfo,
          "opacity-50": redirecting,
        },
        [
          "rounded-lg",
          "transition-all",
          "py-2",
          "px-3",

          "transition-all",
          "hover:scale-105",
          "focus:scale-105",
        ]
      )}
      onClick={handleClick}
    >
      <div
        className={classnames(className, [
          "flex",
          "justify-between",
          "grow-0",
          "items-center",
        ])}
      >
        <div className={classnames(["flex", "flex-col", "mr-3"])}>
          <div
            className={classnames(
              {
                "text-info": event.status !== "CANCELED",
                "text-error": event.status === "CANCELED",
                "opacity-50": event.status === "CANCELED",
              },
              ["text-[1.875em]", "leading-[1.2em]", "text-center", "font-bold"]
            )}
          >
            {startDate.format("D")}
          </div>
          <div
            className={classnames(
              {
                "text-info": event.status !== "CANCELED",
                "text-error": event.status === "CANCELED",
                "opacity-50": event.status === "CANCELED",
              },
              [
                "text-[0.75em]",
                "leading-[0.75em]",
                "whitespace-nowrap",
                "font-bold",
                "mb-1",
              ]
            )}
          >
            {startDate.format("MMM YYYY")}
          </div>
        </div>
        <div className="grow-1">
          <div
            className={classnames({}, [
              "font-bold",
              "leading-[1em]",
              "mb-1",
              "text-primary",
              "text-left",
            ])}
          >
            <span
              className={classnames({
                "opacity-50": event.status === "CANCELED",
              })}
            >
              {startDate.format("dddd")} {showType}
            </span>
            {event.status === "CANCELED" && (
              <span className="text-error"> - CANCELED</span>
            )}
          </div>
          <div
            className={classnames(
              {
                "opacity-50": event.status === "CANCELED",
              },
              ["leading-[1em]", "text-left"]
            )}
          >
            {startDate.format("h:mm")} <span>{startDate.format("A")}</span>
          </div>
        </div>
      </div>
      <AnimatePresence initial={false}>
        {showTicketInfo && !ticketInfo && (
          <motion.div
            key="loading-ticket-info"
            initial={{ opacity: 0, scale: 0, height: 0, marginTop: 0 }}
            animate={{
              opacity: 1,
              scale: 1,
              height: "auto",
              marginTop: "0.5rem",
            }}
            // exit={{ opacity: 0, scale: 0, height: 0, marginTop: 0 }}
            transition={{
              duration: 0.3,
              scale: { type: "spring", visualDuration: 0.2, bounce: 0.2 },
            }}
            className={classnames(["text-center"])}
          >
            <div
              className={classnames([
                "loading",
                "loading-bars",
                "loading-xs",
                "text-primary",
                "text-center",
              ])}
            ></div>
          </motion.div>
        )}
        {showTicketInfo && ticketInfo && (
          <motion.div
            key="ticket-info"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.3,
              scale: { type: "spring", visualDuration: 0.2, bounce: 0.2 },
            }}
            className={classnames([
              "text-sm",
              "flex",
              "w-full",
              "mt-2",
              "relative",
              "flex-wrap",
            ])}
          >
            <button
              className={classnames([
                "text-xs",
                "p-1",
                "absolute",
                "top-0",
                "-translate-y-full",
                "right-0",
                "cursor-pointer",
                "rounded-full",
                "bg-base-100",
                "opacity-50",
                "hover:opacity-100",
                "transition-all",
              ])}
              onClick={(e: MouseEvent) => {
                e.stopPropagation();
                setShowTicketInfo(false);
                setTicketInfo(null);
              }}
            >
              <X size={14} />
            </button>
            <Link
              className="btn btn-xs btn-info"
              href={`/box-office/${event._id}`}
            >
              Info
            </Link>

            <div
              className={classnames([
                "flex",
                "gap-1",
                "items-center",
                "grow-1",
                "justify-end",
              ])}
            >
              <button>
                <Minus
                  className={classnames(
                    {
                      "cursor-pointer text-primary": numTickets > 1,
                      "opacity-50": numTickets === 1,
                    },
                    [
                      "transition-all",
                      "scale-80",
                      "hover:scale-110",
                      "focus:scale-110",
                    ]
                  )}
                  onClick={() => setNumTickets(Math.max(numTickets - 1, 1))}
                />
              </button>
              <button
                className={classnames(["btn", "btn-xs", "btn-primary"])}
                onClick={() => createRedirect(event, ticketInfo, numTickets)}
              >
                {redirecting ? (
                  "Loading..."
                ) : (
                  <span>
                    Buy <b className="font-mono">{numTickets}</b>{" "}
                    {numTickets === 1 ? "Ticket" : "Tickets"}
                  </span>
                )}
              </button>
              <button>
                <Plus
                  className={classnames(
                    {
                      "cursor-pointer text-primary":
                        numTickets < ticketInfo.limitPerCheckout,
                      "opacity-50": numTickets === ticketInfo.limitPerCheckout,
                    },
                    [
                      "transition-all",
                      "scale-80",
                      "hover:scale-110",
                      "focus:scale-110",
                    ]
                  )}
                  onClick={() =>
                    setNumTickets(
                      Math.min(numTickets + 1, ticketInfo.limitPerCheckout)
                    )
                  }
                />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ShowTime;
