import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const PLANS: Record<string, { amount: number, credits: number }> = {
  starter: { amount: 900, credits: 90 },
  pro: { amount: 2900, credits: 150 },
  enterprise: { amount: 9900, credits: 600 },
};

export async function POST(req: NextRequest) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { planId } = await req.json();
  const plan = PLANS[planId];

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [{
      price_data: {
        currency: "usd",
        product_data: { name: `Nexus \${planId.toUpperCase()} Credits` },
        unit_amount: plan.amount,
      },
      quantity: 1,
    }],
    mode: "payment",
    success_url: `\${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
    cancel_url: `\${process.env.NEXT_PUBLIC_APP_URL}/credits?canceled=true`,
    metadata: { userId: user.id, credits: plan.credits.toString(), planId },
  });

  return NextResponse.json({ url: session.url });
}