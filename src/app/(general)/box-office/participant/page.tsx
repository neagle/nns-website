import React, { Suspense } from "react";
import wixClient from "@/lib/wixClient";
import Plan from "../Plan";
import Link from "next/link";

const PageContent = async () => {
  const plan = await wixClient.plans.getPlan(
    "2f001f40-9097-4c0c-b43b-7fb65d0f0f3b"
  );

  return <Plan plan={plan} className="h-fit" />;
};

const Page = async () => {
  return (
    <div className="p-4 md:p-6 xl:p-8">
      <h1 className="text-2xl mb-4">Show Participant</h1>
      <div className="md:grid md:grid-cols-2 gap-8">
        <div className="prose">
          <p>
            NOVA Nightsky Theater is committed to keeping costs low to encourage
            actors to participate in theatre. We charge a $25 fee to each cast
            member, which covers the cost of the actors&rsquo; scripts, certain
            costume pieces and props, and show incidentals for the cast. You
            also get one comp ticket for a guest!
          </p>

          <p>
            Not being able to pay this fee will not preclude you from being
            cast, but you must let the production team know in writing that you
            need a scholarship. Send your email to{" "}
            <Link href="mailto:novanightskytheater@gmail.com">
              novanightskytheater@gmail.com
            </Link>
            .
          </p>

          <p>
            You can pay your fee here, or bring $25 cash to your first
            rehearsal.
          </p>
        </div>
        <Suspense
          fallback={
            <div className="loading loading-spinner loading-2xl text-primary"></div>
          }
        >
          <PageContent />
        </Suspense>
      </div>
    </div>
  );
};

export default Page;
