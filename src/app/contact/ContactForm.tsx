"use client";

import { useState } from "react";
import classnames from "classnames";
import ReCaptchaForm from "../components/ReCaptchaForm";
import { submitContactForm } from "../actions/contact";

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
              <div>
                <label htmlFor="firstName" className="block font-medium">
                  First Name
                </label>
                <input
                  className="w-full p-2 border border-gray-300 rounded"
                  type="text"
                  id="firstName"
                  name="firstName"
                  placeholder="Your first name"
                  required
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block font-medium">
                  Last Name
                </label>
                <input
                  className="w-full p-2 border border-gray-300 rounded"
                  type="text"
                  id="lastName"
                  name="lastName"
                  placeholder="Your last name"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block font-medium">
                  Email
                </label>
                <input
                  className="w-full p-2 border border-gray-300 rounded"
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Your email"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block font-medium">
                  Phone
                </label>
                <input
                  className="w-full p-2 border border-gray-300 rounded"
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="Your phone number"
                />
              </div>

              <div>
                <label htmlFor="address" className="block font-medium">
                  Address
                </label>
                <input
                  className="w-full p-2 border border-gray-300 rounded"
                  type="text"
                  id="address"
                  name="address"
                  placeholder="Your address"
                />
              </div>
            </div>

            <div>
              <div>
                <label htmlFor="subject" className="block font-medium">
                  Subject
                </label>
                <input
                  className="w-full p-2 border border-gray-300 rounded"
                  type="text"
                  id="subject"
                  name="subject"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block font-medium">
                  Message
                </label>
                <textarea
                  className="w-full p-2 border border-gray-300 rounded"
                  id="message"
                  name="message"
                  rows={5}
                  required
                />
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full md:btn-wide">
            Send
          </button>
        </div>
      </ReCaptchaForm>
    </>
  );
}
