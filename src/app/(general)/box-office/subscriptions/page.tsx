import React, { Suspense } from "react";
import wixClient from "@/lib/wixClient";
import Plan from "../Plan";
import Link from "next/link";

const SubscriptionsContent = async () => {
  const planList = await wixClient.plans
    .queryPublicPlans()
    // Explicitly remove the "show participant" plan
    .ne("_id", "2f001f40-9097-4c0c-b43b-7fb65d0f0f3b")
    .find();

  const { items: plans } = planList;

  return plans.map((plan) => (
    <Plan key={plan._id} plan={plan} className="w-full lg:w-1/2" />
  ));
};

const Subscriptions = async () => {
  return (
    <div className="p-4 md:p-6 xl:p-8">
      <h1 className="text-2xl mb-4">Subscriptions</h1>
      <p className="mb-4">
        Do your future self a favor and buy a subscription for a whole season of
        shows!
      </p>
      <div className="flex flex-wrap lg:flex-nowrap gap-4">
        <Suspense
          fallback={
            <div className="loading loading-spinner loading-2xl text-primary"></div>
          }
        >
          <SubscriptionsContent />
        </Suspense>
      </div>
      <p className="mt-8">
        (Looking for individual tickets?{" "}
        <Link href="/box-office">Visit our box office</Link>.)
      </p>
    </div>
  );
};

export default Subscriptions;
