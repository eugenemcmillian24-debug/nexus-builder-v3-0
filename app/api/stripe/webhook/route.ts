import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/lib/db";
import { users, creditTx } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const { userId, credits, planId } = session.metadata!;

    await db.transaction(async (tx) => {
      await tx.update(users).set({ 
        credits: sql`\${users.credits} + \${parseInt(credits)}`,
        plan: planId
      }).where(eq(users.id, userId));

      await tx.insert(creditTx).values({
        userId,
        amount: parseInt(credits),
        type: "purchase",
        stripeId: session.id
      });
    });
  }

  return NextResponse.json({ received: true });
}