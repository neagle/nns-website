import { createClient, ApiKeyStrategy, OAuthStrategy } from "@wix/sdk";
import { collections, items } from "@wix/data";
import { contacts } from "@wix/crm";
import { wixEventsV2, orders, ticketReservations } from "@wix/events";
import { forms, submissions } from "@wix/forms";
import { plans } from "@wix/pricing-plans";
import { redirects } from "@wix/redirects";
import { files } from "@wix/media";

const wixClient = createClient({
  auth: OAuthStrategy({
    clientId: process.env.NEXT_PUBLIC_WIX_CLIENT_ID || "",
  }),
  modules: {
    files,
    collections,
    items,
    wixEventsV2,
    contacts,
    forms,
    submissions,
    plans,
    redirects,
    orders,
    ticketReservations,
  },
});

// Some things, like accessing files from the media manager, require an API key
export const wixApiClient = createClient({
  auth: ApiKeyStrategy({
    apiKey: process.env.WIX_API_KEY || "",
    siteId: process.env.WIX_SITE_ID || "",
    // accountId: process.env.WIX_ACCOUNT_ID || "",
  }),
  modules: {
    files,
    collections,
    items,
    wixEventsV2,
    contacts,
    forms,
    submissions,
    plans,
    redirects,
    orders,
  },
});

export default wixClient;
