import React from "react";
import wixClient from "@/lib/wixClient";
import Plan from "./Plan";
// import { Plans } from "@wix/pricing-plans";

const Subscriptions = async () => {
  const plan = await wixClient.plans.getPlan(
    "2f001f40-9097-4c0c-b43b-7fb65d0f0f3b"
  );
  console.log("plan", plan);
  // const planList = await wixClient.plans
  //   .queryPublicPlans()
  //   .eq("slug", "show-participant-1")
  //   .find();

  // console.log(planList);

  // planList.items.forEach((plan) => {
  //   console.log(plan.perks);
  // });

  // const plan = planList.items[0];

  return (
    <div>
      <h1 className="text-2xl mb-4">Show Participant</h1>
      <Plan plan={plan} />
    </div>
  );
};

export default Subscriptions;
