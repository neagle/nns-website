import { createClient, ApiKeyStrategy } from "@wix/sdk";
import { collections, items } from "@wix/data";
import { wixEventsV2 } from "@wix/events";

const wixClient = createClient({
  auth: ApiKeyStrategy({
    apiKey: process.env.WIX_API_KEY || "",
    siteId: process.env.WIX_SITE_ID || "",
    // accountId: process.env.WIX_ACCOUNT_ID || "",
  }),
  modules: { collections, items, wixEventsV2 },
});

export default wixClient;
