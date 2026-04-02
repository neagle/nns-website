"use server";

import { wixApiClient } from "@/lib/wixClient";
import { contacts } from "@wix/crm";

export async function subscribeToMailingList(
  formData: FormData
): Promise<{ success: boolean; message: string }> {
  const email = formData.get("email");
  if (!email || typeof email !== "string" || !email.trim()) {
    return { success: false, message: "Please enter a valid email address." };
  }

  try {
    // ContactEmail marks subscriptionStatus as @readonly in the SDK types,
    // but the Wix REST API accepts it as an initial opt-in value on creation.
    type SubscribableEmail = contacts.ContactEmail & {
      subscriptionStatus?: contacts.SubscriptionStatus;
    };
    await wixApiClient.contacts.createContact({
      emails: {
        items: [
          {
            tag: contacts.EmailTag.MAIN,
            email: email.trim(),
            subscriptionStatus: contacts.SubscriptionStatus.SUBSCRIBED,
          } satisfies SubscribableEmail,
        ] as unknown as contacts.ContactEmail[],
      },
    });

    return { success: true, message: "You're on the list! We'll be in touch." };
  } catch (error) {
    const isDuplicate =
      error != null &&
      typeof error === "object" &&
      "response" in error &&
      (error as { response: Response }).response.status === 409;
    if (isDuplicate) {
      return {
        success: true,
        message: "You're already on our list!",
      };
    }

    console.error("Error subscribing to mailing list:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}
