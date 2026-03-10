"use client";
import React from "react";
import { useLocalStorage } from "usehooks-ts";
import type { GroupedGuests } from "@/app/types";
import classnames from "classnames";
import { motion } from "motion/react";
import { Ticket, TicketCheck } from "lucide-react";
import { search } from "fast-fuzzy";
import { toggleTicketCheckIn } from "./actions";

interface Props {
  data: GroupedGuests[];
  eventId: string;
}

const Guests = ({ data, eventId }: Props) => {
  const [sortBy, setSortBy, _removeSortBy] = useLocalStorage(
    "houseAttendeeSort",
    "lastName",
    {
      initializeWithValue: false,
    },
  );
  const [guestGroups, setGuestGroups] = React.useState<GroupedGuests[]>(data);
  const [pendingTicketNumber, setPendingTicketNumber] = React.useState<
    string | null
  >(null);
  const [filter, setFilter] = React.useState("");

  React.useEffect(() => {
    setGuestGroups(data);
  }, [data]);

  const { orderedGuests, matchedGuests, hasActiveFilter } =
    React.useMemo(() => {
      const baseSortedGuests = [...guestGroups].sort((a, b) => {
        if (sortBy === "firstName") {
          return (
            a.buyer?.guestDetails?.firstName?.localeCompare(
              b.buyer?.guestDetails?.firstName || "",
            ) || 0
          );
        }

        return (
          a.buyer?.guestDetails?.lastName?.localeCompare(
            b.buyer?.guestDetails?.lastName || "",
          ) || 0
        );
      });

      const filterTerm = filter.trim();
      if (!filterTerm) {
        return {
          orderedGuests: baseSortedGuests,
          matchedGuests: new Set(baseSortedGuests),
          hasActiveFilter: false,
        };
      }

      const matches = search(filterTerm, baseSortedGuests, {
        threshold: 0.65,
        returnMatchData: true,
        keySelector: (group) => {
          const firstName = (group.buyer?.guestDetails?.firstName || "").trim();
          const lastName = (group.buyer?.guestDetails?.lastName || "").trim();
          const fullName = `${firstName} ${lastName}`.trim();

          return [
            fullName,
            `${lastName} ${firstName}`.trim(),
            firstName,
            lastName,
          ];
        },
      });

      const matchedSet = new Set(matches.map((match) => match.item));
      const matched: GroupedGuests[] = [];
      const unmatched: GroupedGuests[] = [];

      for (const group of baseSortedGuests) {
        if (matchedSet.has(group)) {
          matched.push(group);
        } else {
          unmatched.push(group);
        }
      }

      return {
        orderedGuests: [...matched, ...unmatched],
        matchedGuests: matchedSet,
        hasActiveFilter: true,
      };
    }, [guestGroups, sortBy, filter]);

  const notCheckedIn = guestGroups.reduce((sum, item) => {
    return (
      sum +
      item.tickets.reduce((individualSum, ticket) => {
        return ticket.guestDetails?.checkedIn
          ? individualSum
          : individualSum + 1;
      }, 0)
    );
  }, 0);

  const checkedIn = guestGroups.reduce((sum, item) => {
    return (
      sum +
      item.tickets.reduce((individualSum, ticket) => {
        return ticket.guestDetails?.checkedIn
          ? individualSum + 1
          : individualSum;
      }, 0)
    );
  }, 0);

  if (!orderedGuests.length) {
    return <p className="mt-2 opacity-70">No attendees found.</p>;
  }

  const toggleChecked = async (
    ticketNumber: string,
    nextCheckedIn: boolean,
  ) => {
    if (!ticketNumber || !eventId) {
      return;
    }

    const previousGroups = guestGroups;

    setGuestGroups((current) =>
      current.map((group) => ({
        ...group,
        tickets: group.tickets.map((ticket) => {
          if (ticket.ticketNumber !== ticketNumber) {
            return ticket;
          }

          return {
            ...ticket,
            guestDetails: {
              ...ticket.guestDetails,
              checkedIn: nextCheckedIn,
            },
          };
        }),
      })),
    );

    setPendingTicketNumber(ticketNumber);

    try {
      await toggleTicketCheckIn({
        eventId,
        ticketNumber,
        checkedIn: nextCheckedIn,
      });
    } catch {
      setGuestGroups(previousGroups);
    } finally {
      setPendingTicketNumber((current) =>
        current === ticketNumber ? null : current,
      );
    }
  };

  return (
    <div>
      <div
        className={classnames([
          "flex",
          "sticky",
          "top-5",
          "items-center",
          "text-xs",
          "bg-accent-content/80",
          "rounded",
          "px-2",
          "z-1",
          "my-2",
        ])}
      >
        <div className="opacity-80">Not Checked In:</div>
        <div className="font-bold p-1">{notCheckedIn}</div>
        <div className="opacity-80">Checked In:</div>
        <div className="font-bold p-1 text-success">{checkedIn}</div>
      </div>
      <div>
        <input
          className="input input-sm w-full mb-2"
          placeholder="Filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>
      <div className="flex items-center">
        <div className="text-xs join-item pr-2">Sort by:</div>
        <div className="join">
          <button
            onClick={() => {
              setSortBy("firstName");
            }}
            className={classnames(
              { "btn-info": sortBy === "firstName" },
              "btn",
              "btn-xs",
              "join-item",
            )}
          >
            First Name
          </button>
          <button
            onClick={() => {
              setSortBy("lastName");
            }}
            className={classnames(
              { "btn-info": sortBy === "lastName" },
              "btn",
              "btn-xs",
              "join-item",
            )}
          >
            Last Name
          </button>
        </div>
      </div>
      <motion.ul layout className="mt-2">
        {orderedGuests.map((group, index) => (
          <motion.li
            layout
            transition={{ type: "spring", stiffness: 450, damping: 35 }}
            key={group.buyer?._id || `group-${index}`}
            className={classnames({
              "opacity-40": hasActiveFilter && !matchedGuests.has(group),
            })}
          >
            <div
              className={classnames(
                {
                  "text-success": group.tickets.every(
                    (ticket) => ticket.guestDetails?.checkedIn,
                  ),
                },
                ["px-2"],
              )}
            >
              {(group.buyer?.guestDetails?.firstName || "").trim()}{" "}
              {(group.buyer?.guestDetails?.lastName || "").trim() ||
                "(No buyer name)"}
            </div>
            {/* - {group.tickets.length} ticket holder
            {group.tickets.length === 1 ? "" : "s"} */}
            <div className="flex mb-2 join">
              {group.tickets.map((ticket) => {
                // console.log("ticket", ticket);
                const checkedIn = ticket.guestDetails?.checkedIn;
                const ticketNumber = ticket.ticketNumber || "";
                const isPending = pendingTicketNumber === ticketNumber;

                return (
                  <button
                    key={ticket._id || ticket.ticketNumber}
                    type="button"
                    onClick={(e) => {
                      void toggleChecked(ticketNumber, !checkedIn);
                    }}
                    disabled={!ticketNumber}
                    className={classnames(
                      {
                        "btn-success": checkedIn,
                        // "btn-disabled": !ticketNumber || isPending,
                        // "scale-75": isPending,
                      },
                      [
                        "btn",
                        "btn-xs",
                        "join-item",
                        // "btn-ghost",
                        "active:scale-75",
                        "transition-all",
                      ],
                    )}
                  >
                    {checkedIn ? (
                      <TicketCheck size={36} />
                    ) : (
                      <Ticket size={36} />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
};

export default Guests;
