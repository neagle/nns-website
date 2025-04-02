import { createClient, ApiKeyStrategy } from "@wix/sdk";
import { collections, items } from "@wix/data";
import { contacts } from "@wix/crm";
import { wixEventsV2 } from "@wix/events";
import { forms, submissions } from "@wix/forms";
import { plans } from "@wix/pricing-plans";
import { redirects } from "@wix/redirects";

const wixClient = createClient({
  auth: ApiKeyStrategy({
    apiKey: process.env.WIX_API_KEY || "",
    siteId: process.env.WIX_SITE_ID || "",
  }),
  modules: {
    collections,
    items,
    wixEventsV2,
    contacts,
    forms,
    submissions,
    plans,
    redirects,
  },
});

export default wixClient;
