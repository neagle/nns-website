"use client";

import { useRef, useState, FormEvent, useEffect } from "react";
import Script from "next/script";

interface ReCaptchaFormProps {
  onSubmit: (formData: FormData, recaptchaToken: string) => Promise<void>;
  children: React.ReactNode;
  debug?: boolean;
}

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (
        siteKey: string,
        options: { action: string }
      ) => Promise<string>;
    };
  }
}

export default function ReCaptchaForm({
  onSubmit,
  children,
  debug = false,
}: ReCaptchaFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRecaptchaLoaded, setIsRecaptchaLoaded] = useState(false);
  const [recaptchaState, setRecaptchaState] = useState<{
    token?: string;
    triggered: boolean;
    error?: string;
  }>({ triggered: false });

  const formRef = useRef<HTMLFormElement>(null);
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";

  useEffect(() => {
    // Check if grecaptcha is already loaded
    if (window.grecaptcha && window.grecaptcha.ready) {
      window.grecaptcha.ready(() => {
        setIsRecaptchaLoaded(true);
        if (debug) console.log("reCAPTCHA is ready");
      });
    }
  }, [debug]);

  const executeRecaptcha = async (
    action: string = "submit"
  ): Promise<string> => {
    if (!window.grecaptcha) {
      throw new Error("reCAPTCHA not loaded");
    }

    return window.grecaptcha.execute(siteKey, { action });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formRef.current) return;

    setIsSubmitting(true);
    setRecaptchaState((prev) => ({
      ...prev,
      triggered: true,
      error: undefined,
    }));

    try {
      if (!isRecaptchaLoaded) {
        const error = "reCAPTCHA not loaded yet. Please try again.";
        setRecaptchaState((prev) => ({ ...prev, error }));
        throw new Error(error);
      }

      // Execute reCAPTCHA v3
      const token = await executeRecaptcha("contact_form");

      if (!token) {
        const error = "Failed to execute reCAPTCHA";
        setRecaptchaState((prev) => ({ ...prev, error }));
        throw new Error(error);
      }

      // Set the token in state for debug display
      setRecaptchaState((prev) => ({
        ...prev,
        token: token?.substring(0, 20) + "...",
      }));

      // Submit the form with the token
      const formData = new FormData(formRef.current);
      await onSubmit(formData, token);
    } catch (error) {
      console.error("ReCAPTCHA error:", error);
      let errorMessage =
        "There was an error submitting the form. Please try again.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      setRecaptchaState((prev) => ({ ...prev, error: errorMessage }));
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Script
        src={`https://www.google.com/recaptcha/api.js?render=${siteKey}&badge=inline`}
        onLoad={() => {
          window.grecaptcha?.ready(() => {
            setIsRecaptchaLoaded(true);

            const badge = document.querySelector(".grecaptcha-badge");
            const badgeContainer = document.getElementById(
              "recaptcha-inline-badge"
            );

            // Move the badge to the badgeContainer
            if (badge && badgeContainer) {
              badgeContainer.appendChild(badge);
            }

            if (debug) {
              console.log("reCAPTCHA script loaded");
            }
          });
        }}
        onError={() => {
          console.error("Error loading reCAPTCHA script");
          setRecaptchaState((prev) => ({
            ...prev,
            error:
              "Failed to load reCAPTCHA. Please check your internet connection and try again.",
          }));
        }}
      />

      <form ref={formRef} onSubmit={handleSubmit} className="relative">
        {children}

        {isSubmitting && (
          <div className="fixed inset-0 bg-base-100/80 flex items-center justify-center z-50">
            <div className="loading loading-spinner loading-xl text-primary"></div>
          </div>
        )}

        {/* Debug information */}
        {debug && (
          <div className="my-4 p-4 border border-gray-300 rounded bg-gray-100">
            <h3 className="font-bold">reCAPTCHA v3 Debug Info:</h3>
            <ul className="list-disc pl-5 mt-2">
              <li>reCAPTCHA Version: V3</li>
              <li>Site Key: {siteKey ? "✅ Set" : "❌ Missing"}</li>
              <li>Script Loaded: {isRecaptchaLoaded ? "✅ Yes" : "❌ No"}</li>
              <li>
                Triggered: {recaptchaState.triggered ? "✅ Yes" : "❌ No"}
              </li>
              <li>Token: {recaptchaState.token || "None yet"}</li>
              {recaptchaState.error && (
                <li className="text-red-500">Error: {recaptchaState.error}</li>
              )}
            </ul>
          </div>
        )}
      </form>
    </>
  );
}
