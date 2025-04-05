import React from "react";
import wixClient from "@/lib/wixClient";
import Plan from "./Plan";

const Subscriptions = async () => {
  const planList = await wixClient.plans
    .queryPublicPlans()
    // Explicitly remove the "show participant" plan
    .ne("_id", "2f001f40-9097-4c0c-b43b-7fb65d0f0f3b")
    .find();

  console.log(planList);

  const { items: plans } = planList;

  return (
    <div className="mt-8 mb-8">
      <h1 className="text-2xl mb-4">Subscriptions</h1>
      <div className="flex flex-wrap lg:flex-nowrap gap-4">
        {plans.map((plan) => (
          <Plan key={plan._id} plan={plan} className="w-full lg:w-1/2" />
        ))}
      </div>
    </div>
  );
};

export default Subscriptions;
