"use server";

import { auth, currentUser } from "@clerk/nextjs";
import { stripe } from "@/lib/stripe";
import { absoluteURL } from "@/lib/utils";
import { getUserSubscription } from "@/database/queries";

const returnURL = absoluteURL("/shop");

export const createStripeURL = async () => {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    throw new Error("Unauthorized");
  }

  const userSubscription = await getUserSubscription();

  // if we aleady have a user subscription, or we have a stripe customerid
  // that means, instead of returning a checkout url -> we return a checkout portal url
  if (userSubscription && userSubscription.stripeCustomerID) {
    const stripeSession = await stripe.billingPortal.sessions.create({
      customer: userSubscription.stripeCustomerID,
      return_url: returnURL,
    });

    return { data: stripeSession.url };
  }

  const stripeSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    customer_email: user.emailAddresses[0].emailAddress,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "INR",
          product_data: {
            name: "LangLingo Pro",
            description: "Unlimited Hearts",
          },
          unit_amount: 2000,
          recurring: {
            interval: "month",
          },
        },
      },
    ],
    metadata: {
      userId,
    },
    success_url: returnURL,
    cancel_url: returnURL,
  });

  return { data: stripeSession.url };
};
