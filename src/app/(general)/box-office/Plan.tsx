"use client";

import React from "react";
import { plans } from "@wix/pricing-plans";
import wixClient from "@/lib/wixClient";
import classnames from "classnames";
import Nightsky from "@/app/components/Nightsky";

interface PlanProps {
  plan: plans.Plan;
}

interface PriceProps {
  price: NonNullable<NonNullable<plans.Plan["pricing"]>["price"]>;
}

const Price = ({ price }: PriceProps) => {
  const { currency, value } = price;
  return (
    <div className="flex">
      <span className="text-2xl text-accent/70 font-bold">
        {currency === "USD" ? "$" : currency}
      </span>
      <span className="text-5xl text-accent font-bold">{value}</span>
    </div>
  );
};

const Plan = ({ plan }: PlanProps) => {
  console.log("plan", plan);

  // console.log("perks", perks);
  const perks = plan.perks?.values;
  const createRedirect = async (plan: plans.Plan) => {
    const redirect = await wixClient.redirects.createRedirectSession({
      paidPlansCheckout: { planId: plan._id },
      callbacks: { postFlowUrl: window.location.href },
    });
    console.log("redirect", redirect);

    // window.location = redirect.redirectSession.fullUrl;
  };

  return (
    <div
      className={classnames([
        "card",
        "bg-base-200",
        "shadow-xl",
        "max-w-1/3",
        "m-4",
        "drop-shadow-md",
      ])}
    >
      <figure
        className={classnames([
          "[text-shadow:_0_0_0.9em_hsla(50,_50%,_20%,_0.5)]",
        ])}
      >
        <Nightsky className="w-full">
          {plan?.pricing?.price && <Price price={plan.pricing.price} />}
        </Nightsky>
      </figure>
      <div className="card-body">
        <h1
          onClick={() => createRedirect(plan)}
          className={classnames(["card-title", "cursor-pointer"])}
        >
          {plan.name}
        </h1>
        <p>{plan.description}</p>
        {perks?.values && (
          <ul className="pl-4">
            {perks.map((perk, i) => (
              <li key={i} className="list-disc">
                {perk}
              </li>
            ))}
          </ul>
        )}
        <div className="card-actions">
          <button className="btn btn-primary">Subscribe</button>
        </div>
      </div>
    </div>
  );
};

export default Plan;
