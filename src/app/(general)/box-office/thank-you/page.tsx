"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function ThankYouPage() {
  const [params, setParams] = useState<Record<string, string>>({});

  useEffect(() => {
    try {
      const search =
        typeof window !== "undefined" ? window.location.search : "";
      const sp = new URLSearchParams(search);
      const obj: Record<string, string> = {};
      sp.forEach((v, k) => (obj[k] = v));
      setParams(obj);
    } catch (e) {
      // ignore
    }
  }, []);

  const entries = Object.entries(params);

  return (
    <main className="prose mx-auto my-12 max-w-2xl text-center p-6">
      <h1>Thank you — Your purchase was successful</h1>
      <p className="opacity-80">
        A confirmation was sent if an email was provided during checkout.
      </p>

      <div className="mt-8 flex gap-4 justify-center">
        <Link href="/box-office" className="btn btn-primary">
          Back to Box Office
        </Link>
        <Link href="/" className="btn">
          Home
        </Link>
      </div>
    </main>
  );
}
