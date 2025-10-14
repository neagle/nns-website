"use client";

import { useState } from "react";
import classnames from "classnames";
import ReCaptchaForm from "@/app/components/ReCaptchaForm";
import { submitContactForm } from "@/app/actions/contact";
import FloatingLabelInput from "@/app/components/FloatingLabelInput";

export default function ContactForm() {
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData, recaptchaToken: string) => {
    try {
      setError(null);
      await submitContactForm(formData, recaptchaToken);
    } catch (err) {
      console.error("Error submitting form:", err);
      setError("Failed to submit the form. Please try again.");
    }
  };

  return (
    <>
      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}

      <ReCaptchaForm onSubmit={handleSubmit} debug={false}>
        <div className={classnames(["space-y-4", "required-asterisks"])}>
          <div className="md:max-w-1/2 [&_input]:mb-4">
            <div className="md:grid md:grid-cols-2 md:gap-4">
              <FloatingLabelInput label="First Name" id="firstName" required />
              <FloatingLabelInput label="Last Name" id="lastName" required />
              <FloatingLabelInput label="Email" id="email" required />
              <FloatingLabelInput
                label="Phone"
                id="phoneName"
                type="tel"
                mask="(___) ___-____"
                replacement={{ _: /\d/ }}
              />
              <FloatingLabelInput label="Address" id="addressName" />
            </div>

            <div>
              <FloatingLabelInput label="Subject" id="subject" required />
              <FloatingLabelInput
                label="Message"
                id="message"
                type="textarea"
                required
                rows={5}
              />
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                id="recaptcha-inline-badge"
                className={classnames([
                  "place-content-center",
                  "justify-items-center",
                  "md:justify-items-start",
                  // For mobile, put this after the send button
                  "order-1",
                  "md:order-0",
                ])}
              />

              <div className="">
                <button
                  type="submit"
                  className={classnames([
                    "btn",
                    "btn-primary",
                    "w-full",
                    "hover:scale-105",
                    "transition-all",
                  ])}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </ReCaptchaForm>
    </>
  );
}
