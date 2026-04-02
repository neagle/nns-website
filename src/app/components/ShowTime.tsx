"use client";

import React, { useEffect, useRef, useState, MouseEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Event } from "@wix/auto_sdk_events_wix-events-v-2";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);
import classnames from "classnames";
import wixClient from "@/lib/wixClient";
import type { Ticket } from "@/app/types";
import { X, Plus, Minus, DollarSign } from "lucide-react";
import Link from "next/link";

type Props = {
  event: Event;
  /** Server-fetched ticket definitions. Seeds initial state and enables immediate badge display. */
  ticketDefinitions?: Ticket[];
  className?: string;
  animationDuration?: number;
};

const isValidUserPrice = (price: string) => {
  const regex = /^\d+(\.\d{2})?$/;
  return regex.test(price);
};

const formatPrice = (amount: number) => amount.toFixed(2);

const ShowTime = ({
  event,
  ticketDefinitions,
  className = "",
  animationDuration = 0.2,
}: Props) => {
  const isSoldOut = event.registration?.tickets?.soldOut;

  const [ticketInfo, setTicketInfo] = useState<Ticket | null>(
    ticketDefinitions?.[0] ?? null,
  );
  const [numTickets, setNumTickets] = useState(1);
  const [redirecting, setRedirecting] = useState(false);
  const [showTicketInfo, setShowTicketInfo] = useState(false);
  const [userPrice, setUserPrice] = useState<string>("");
  const [debouncedUserPrice, setDebouncedUserPrice] = useState<string>("");
  const [hasEditedPrice, setHasEditedPrice] = useState(false);

  // Prevents concurrent in-flight fetches (e.g. rapid hover in/out).
  const isFetchingRef = useRef(false);

  // "DONATION" is Wix's pricingType for Pay What You Can events.
  const isPayWhatYouCan = ticketInfo?.pricing?.pricingType === "DONATION";
  const minimumPrice = Number(ticketInfo?.pricing?.minPrice?.value || "0");
  const minimumPriceDisplay = formatPrice(minimumPrice);

  useEffect(() => {
    if (!isPayWhatYouCan) {
      setDebouncedUserPrice("");
      return;
    }

    const timeout = setTimeout(() => {
      setDebouncedUserPrice(userPrice);
    }, 500);

    return () => clearTimeout(timeout);
  }, [isPayWhatYouCan, userPrice]);

  const parsedUserPrice = Number(userPrice);
  const debouncedParsedUserPrice = Number(debouncedUserPrice);
  const hasTypedPrice = hasEditedPrice && userPrice.trim().length > 0;
  const hasDebouncedValidPrice = isValidUserPrice(debouncedUserPrice);
  const hasPriceFormatError =
    isPayWhatYouCan &&
    hasTypedPrice &&
    debouncedUserPrice.trim().length > 0 &&
    !hasDebouncedValidPrice;
  const hasMinimumPriceError =
    isPayWhatYouCan &&
    hasTypedPrice &&
    debouncedUserPrice.trim().length > 0 &&
    hasDebouncedValidPrice &&
    !Number.isNaN(debouncedParsedUserPrice) &&
    debouncedParsedUserPrice < minimumPrice;
  const canSubmitPayWhatYouCan =
    isPayWhatYouCan &&
    userPrice.trim().length > 0 &&
    isValidUserPrice(userPrice) &&
    !Number.isNaN(parsedUserPrice) &&
    parsedUserPrice >= minimumPrice;

  const priceErrorMessage = hasPriceFormatError
    ? "Enter a valid amount like 15 or 15.00."
    : hasMinimumPriceError
      ? `Minimum is $${minimumPriceDisplay} per ticket.`
      : null;

  const fetchTicketsAvailability = async (event: Event) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    try {
      const tickets = await wixClient.orders.queryAvailableTickets({
        filter: { eventId: event._id },
        limit: 100,
      });

      const definitions = tickets.definitions || [];
      const ticket = definitions[0] as unknown as Ticket;
      setTicketInfo(ticket);
    } finally {
      isFetchingRef.current = false;
    }
  };

  const createRedirect = async (
    event: Event,
    ticket: Ticket,
    quantity: number,
    userPrice: string,
  ) => {
    setRedirecting(true);

    const options = {
      tickets: [
        {
          ticketDefinitionId: ticket._id,
          quantity,
          ...(typeof userPrice === "string" && isValidUserPrice(userPrice)
            ? {
                ticketInfo: {
                  guestPrice: parseFloat(userPrice).toFixed(2),
                },
              }
            : {}),
        },
      ],
    };

    const reservation =
      await wixClient.ticketReservations.createTicketReservation(options);

    if (reservation._id) {
      const redirect = await wixClient.redirects.createRedirectSession({
        eventsCheckout: {
          eventSlug: event.slug,
          reservationId: reservation._id,
        },
        callbacks: { postFlowUrl: window.location.href },
      });

      if (!redirect.redirectSession) {
        console.error("No redirect session found");
        setRedirecting(false);
        return;
      }

      if (typeof redirect.redirectSession.fullUrl !== "string") {
        throw new Error("Redirect URL is not a string");
      } else {
        window.location.href = redirect.redirectSession.fullUrl;
      }
    } else {
      setRedirecting(false);
    }
  };

  if (!event.dateAndTimeSettings) {
    setRedirecting(false);
    return;
  }

  const startDate = dayjs(event.dateAndTimeSettings.startDate).tz(
    "America/New_York",
  );
  // Set showType based on whether the startDate is before or after 5 PM
  const showType = startDate.hour() < 17 ? "Matinee" : "Night";

  const handleClick = async (e: MouseEvent) => {
    e.preventDefault();
    if (isSoldOut) {
      return;
    }

    if (!event._id) {
      console.error("Event ID is missing");
      setRedirecting(false);
      return;
    }

    setShowTicketInfo(true);
    fetchTicketsAvailability(event);
  };

  // Pre-fetch ticket info on hover so the panel opens instantly.
  // Always re-fetches to keep availability counts fresh.
  const handleHover = () => {
    fetchTicketsAvailability(event);
  };

  return (
    <div
      onMouseEnter={handleHover}
      className={classnames(
        className,
        {
          "cursor-pointer": !showTicketInfo && !isSoldOut,
          "cursor-default": showTicketInfo,
          "hover:scale-105": !showTicketInfo && !isSoldOut,
          "focus:scale-105": !showTicketInfo && !isSoldOut,
        },
        {
          "bg-info/25": event.status !== "CANCELED" && !isSoldOut,
          "bg-info/10": isSoldOut,
          "hover:bg-info/40": event.status !== "CANCELED" && !isSoldOut,
          "bg-error/25": event.status === "CANCELED",
          "hover:bg-error/25": event.status === "CANCELED",
          "scale-105": showTicketInfo,
          "opacity-50": redirecting,
        },
        [
          "rounded-lg",
          "transition-transform",
          "transition-colors",
          "py-2",
          "px-3",
        ],
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
              ["text-[1.875em]", "leading-[1.2em]", "text-center", "font-bold"],
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
              ],
            )}
          >
            {startDate.format("MMM YYYY")}
          </div>
        </div>
        <div className="grow-1 items-start flex flex-col">
          {isSoldOut && (
            <div
              className={classnames([
                "badge",
                "badge-xs",
                "mb-2",
                "badge-error",
              ])}
            >
              Sold out!
            </div>
          )}
          {isPayWhatYouCan && !isSoldOut && (
            <div
              className={classnames([
                "badge",
                "badge-xs",
                "badge-outline",
                "mb-2",
                "badge-accent",
              ])}
            >
              Pay What You Can!
            </div>
          )}
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
              ["leading-[1em]", "text-left"],
            )}
          >
            {startDate.format("h:mm")} <span>{startDate.format("A")}</span>
          </div>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {showTicketInfo && !ticketInfo && (
          <motion.div
            className={classnames([
              "flex",
              "justify-center",
              "items-center",
              "absolute",
              "bg-base-100/70",
              "top-0",
              "right-0",
              "bottom-0",
              "left-0",
            ])}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="loading loading-bars text-primary" />
          </motion.div>
        )}
        {showTicketInfo && ticketInfo && (
          <motion.div
            key="ticket-info"
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{
              opacity: 1,
              height: "auto",
              marginTop: "0.5rem",
              transition: {
                duration: animationDuration,
                opacity: { delay: animationDuration / 2 },
              },
            }}
            exit={{
              opacity: 0,
              height: 0,
              marginTop: 0,
              transition: {
                duration: animationDuration,
                height: { delay: animationDuration / 2 },
              },
            }}
            className={classnames([
              "text-sm",
              "flex",
              "w-full",
              "relative",
              "flex-col",
            ])}
          >
            {ticketInfo.limitPerCheckout < 10 ? (
              <div className="text-right mr-6 mb-1 text-xs">
                {ticketInfo.limitPerCheckout} ticket
                {ticketInfo.limitPerCheckout === 1 ? "" : "s"} left
              </div>
            ) : null}
            {isPayWhatYouCan && (
              <div className="mb-2">
                <label
                  className={classnames([
                    "input",
                    "input-xs",
                    "validator",
                    "border-0",
                    "mt-1",
                    "w-full",
                    "has-focus:outline-accent",
                    "has-focus:outline-2",
                    "has-focus:-outline-offset-2",
                  ])}
                >
                  <DollarSign />
                  <input
                    type="text"
                    pattern="^\d+(\.\d{2})?$"
                    placeholder={`${isPayWhatYouCan && minimumPrice > 0 ? `Your Price (min: $${minimumPriceDisplay})` : "Your Price Per Ticket"}`}
                    value={userPrice}
                    onChange={(e) => {
                      setHasEditedPrice(true);
                      setUserPrice(e.target.value);
                    }}
                  />
                </label>
                <motion.div
                  initial={false}
                  animate={{
                    height: priceErrorMessage ? "auto" : 0,
                    opacity: priceErrorMessage ? 1 : 0,
                  }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                >
                  <div
                    className={classnames([
                      "alert",
                      "alert-error",
                      "text-xxs",
                      "rounded-sm",
                      "leading-tight",
                      "p-1",
                      "mt-1",
                    ])}
                  >
                    {priceErrorMessage || "\u00A0"}
                  </div>
                </motion.div>
              </div>
            )}
            <div className="flex">
              <button
                className={classnames({ "-mt-1": isPayWhatYouCan }, [
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
                      ],
                    )}
                    onClick={() => setNumTickets(Math.max(numTickets - 1, 1))}
                  />
                </button>
                <button
                  className={classnames([
                    "btn",
                    "btn-xs",
                    "btn-primary",
                    "transition-all",
                    "opacity-100",
                    "cursor-pointer",
                  ])}
                  onClick={() =>
                    createRedirect(event, ticketInfo, numTickets, userPrice)
                  }
                  disabled={isPayWhatYouCan ? !canSubmitPayWhatYouCan : false}
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
                        "opacity-50":
                          numTickets === ticketInfo.limitPerCheckout,
                      },
                      [
                        "transition-all",
                        "scale-80",
                        "hover:scale-110",
                        "focus:scale-110",
                      ],
                    )}
                    onClick={() =>
                      setNumTickets(
                        Math.min(numTickets + 1, ticketInfo.limitPerCheckout),
                      )
                    }
                  />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ShowTime;
