import { createClient, ApiKeyStrategy } from "@wix/sdk";
import { collections, items } from "@wix/data";
import { contacts } from "@wix/crm";
import { wixEventsV2 } from "@wix/events";
import { forms, submissions } from "@wix/forms";

const wixClient = createClient({
  auth: ApiKeyStrategy({
    apiKey: process.env.WIX_API_KEY || "",
    siteId: process.env.WIX_SITE_ID || "",
    // accountId: process.env.WIX_ACCOUNT_ID || "",
  }),
  modules: { collections, items, wixEventsV2, contacts, forms, submissions },
});

export default wixClient;
