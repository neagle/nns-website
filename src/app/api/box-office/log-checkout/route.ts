import { NextResponse } from "next/server";

// POST /api/box-office/log-checkout
//
// Fire-and-forget diagnostic logging for the ticket checkout redirect flow.
// The eventsCheckout -> Wix hosted checkout -> postFlowUrl round trip has
// occasionally failed for customers with a Wix "This link is no longer
// valid" error on the way back. That error surfaces on Wix's own domain, so
// we have no client-side visibility into it. Logging the reservation and
// redirect session details here (visible in Vercel function logs) lets us
// correlate a customer report with the exact IDs/URLs Wix issued, which Wix
// support can then look up on their end.
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      eventId,
      eventSlug,
      reservationId,
      redirectSessionId,
      redirectFullUrl,
      postFlowUrl,
      userAgent,
    } = body;

    console.log("[box-office] checkout redirect created", {
      eventId,
      eventSlug,
      reservationId,
      redirectSessionId,
      redirectFullUrl,
      postFlowUrl,
      userAgent,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[box-office] failed to log checkout redirect", err);
    // Never block the checkout flow on a logging failure.
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
