"use server";

import wixClient from "@/lib/wixClient";
import { redirect } from "next/navigation";

// Set an environment variable to enable reCAPTCHA debugging
const DEBUG_RECAPTCHA = process.env.DEBUG_RECAPTCHA?.toLowerCase() === "true";

const log = (...args: Parameters<typeof console.log>) => {
  if (DEBUG_RECAPTCHA) {
    console.log(...args);
  }
};

async function verifyRecaptcha(token: string): Promise<boolean> {
  try {
    log("⭐ Verifying reCAPTCHA token:", token.substring(0, 15) + "...");

    const secretKey = process.env.RECAPTCHA_SECRET_KEY;

    if (!secretKey) {
      console.error("⛔ Missing RECAPTCHA_SECRET_KEY environment variable");
      return false;
    }

    log("✅ Secret key is set");

    const verifyUrl = "https://www.google.com/recaptcha/api/siteverify";
    log(`📡 Sending verification request to: ${verifyUrl}`);

    const response = await fetch(verifyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        secret: secretKey,
        response: token,
      }),
    });

    log(`📥 Response status:`, response.status, response.statusText);

    const data = await response.json();

    // Log the verification result details for debugging
    log("✅ reCAPTCHA verification complete!");
    log("📊 Success:", data.success);
    log("📊 Score:", data.score);
    log("📊 Action:", data.action);
    log("📊 Hostname:", data.hostname);
    log("📊 Challenge timestamp:", data["challenge_ts"]);

    if (!data.success) {
      log("⛔ Verification failed. Error codes:", data["error-codes"]);
      return false;
    }

    if (data.score < 0.5) {
      log(`⚠️ Score too low: ${data.score} (minimum: 0.5)`);
      return false;
    }

    log("✅ Verification passed successfully!");

    // Return true if the reCAPTCHA score is above a certain threshold (0.5)
    return true;
  } catch (error) {
    console.error("⛔ Error verifying reCAPTCHA:", error);
    return false;
  }
}

export async function submitContactForm(
  formData: FormData,
  recaptchaToken: string
) {
  const isValid = await verifyRecaptcha(recaptchaToken);

  if (!isValid) {
    throw new Error("reCAPTCHA verification failed");
  }

  // Extract data from the FormData object
  const firstName = formData.get("firstName");
  const lastName = formData.get("lastName");
  const email = formData.get("email");
  const phoneNumber = formData.get("phone");
  const address = formData.get("address");
  const subject = formData.get("subject");
  const message = formData.get("message");

  console.log("firstName", firstName);
  console.log("lastName", lastName);
  console.log("email", email);
  console.log("phoneNumber", phoneNumber);
  console.log("address", address);
  console.log("subject", subject);
  console.log("message", message);

  const fields = {
    first_name_fe01: firstName,
    last_name_b4ca: lastName,
    email_fea1: email,
    phone_1247: phoneNumber,
    address_90dd: address,
    subject: subject,
    message: message,
  };

  // Remove empty values
  for (const [key, value] of Object.entries(fields)) {
    if (!value) {
      delete (fields as Record<string, FormDataEntryValue | null>)[key];
    }
  }

  try {
    console.log("Submitting contact form to Wix with fields:", fields);
    await wixClient.submissions.createSubmission({
      formId: "1ff9543e-318e-4617-9535-b4273beac2ea",
      submissions: fields,
    });
  } catch (error) {
    console.error("Error creating submission in Wix:", error);
    throw error;
  }

  redirect("/contact/thanks");
}
