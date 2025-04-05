"use client";

import React from "react";
import { plans } from "@wix/pricing-plans";
import wixClient from "@/lib/wixClient";
import classnames from "classnames";
import Nightsky from "@/app/components/Nightsky";

interface PlanProps {
  plan: plans.Plan;
  className?: string;
}

interface PriceProps {
  price: NonNullable<NonNullable<plans.Plan["pricing"]>["price"]>;
}

const Price = ({ price }: PriceProps) => {
  const { currency, value } = price;
  return (
    <div className="flex">
      <span className="text-xl xl:text-3xl text-accent/70 font-bold">
        {currency === "USD" ? "$" : currency}
      </span>
      <span className="text-3xl lg:text-4xl xl:text-5xl text-accent font-bold">
        {value}
      </span>
    </div>
  );
};

const Plan = ({ plan, className = "" }: PlanProps) => {
  // console.log("plan", plan);

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
      className={classnames(
        [
          "card",
          "card-border",
          "bg-base-200",
          "shadow-xl",
          "m-4",
          "drop-shadow-md",
          "group",
          "m-0!",
        ],
        className
      )}
    >
      <figure
        className={classnames([
          "[text-shadow:_0_0_1em_hsla(50,_50%,_0%,_0.9)]",
        ])}
      >
        <Nightsky className="w-full" twinkle={false}>
          <div className="flex gap-4 w-full">
            <h1
              onClick={() => createRedirect(plan)}
              className={classnames([
                "card-title",
                "cursor-pointer",
                "text-xl",
                "xl:text-3xl",
                "font-normal!",
                "leading-tight",
                "grow-1",
              ])}
            >
              {plan.name}
            </h1>
            {plan?.pricing?.price && <Price price={plan.pricing.price} />}
          </div>
        </Nightsky>
      </figure>
      <div className="card-body p-4">
        <div className="grow-1">
          {plan.description && <p>{plan.description}</p>}
          {perks?.values && (
            <ul className="pl-4">
              {perks.map((perk, i) => (
                <li key={i} className="list-disc">
                  {perk}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="card-actions justify-end">
          <button
            onClick={() => createRedirect(plan)}
            className="btn btn-primary btn-sm hover:scale-110 transition-all"
          >
            Purchase
          </button>
        </div>
      </div>
    </div>
  );
};

export default Plan;
