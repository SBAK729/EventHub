"use server";

import Stripe from "stripe";
import { ObjectId } from "mongodb";
import { redirect } from "next/navigation";
import Order from "@/lib/database/models/order.model";
import Event from "@/lib/database/models/event.model";
import User from "@/lib/database/models/user.model";
import { connectToDatabase } from "@/lib/database";
import { NotificationService } from "@/lib/services/notification.service";

// ---------------------------
// Types
// ---------------------------
export interface CheckoutOrderParams {
  eventTitle: string;
  eventId: string;
  price: number;
  isFree: boolean;
  buyerId: string;
}

export interface GetOrdersByUserParams {
  userId: string;
  limit?: number;
  page?: number;
}

export interface CreateOrderWebhookParams {
  stripeId: string;
  eventId: string;
  buyerId: string;
  totalAmount: string | number;
  createdAt?: Date;
}

// ---------------------------
// Checkout order
// ---------------------------
export const checkoutOrder = async (order: CheckoutOrderParams) => {
  console.log("CheckoutOrder called with:", order);
  
  const numericPrice = order.isFree ? 0 : Number(order.price ?? 0);
  const isFreeTicket = Boolean(order.isFree || numericPrice === 0);

  console.log("Price analysis:", { numericPrice, isFreeTicket, originalPrice: order.price });

  if (!isFreeTicket && (isNaN(numericPrice) || numericPrice < 0)) {
    throw new Error("Invalid price for paid event");
  }

  try {
    await connectToDatabase();
    console.log("Database connected");

    const buyer = await User.findOne({ clerkId: order.buyerId });
    if (!buyer) {
      console.error("Buyer not found for clerkId:", order.buyerId);
      throw new Error("Buyer not found");
    }
    console.log("Buyer found:", buyer._id);

    const eventObjectId = new ObjectId(order.eventId);
    console.log("Event ObjectId:", eventObjectId);

    // If user already has a ticket for this event, short-circuit
    const existing = await Order.findOne({ event: eventObjectId, buyer: buyer._id });
    if (existing) {
      console.log("Existing order found, returning status");
      return { success: true, alreadyExists: true, message: "You already have a ticket for this event" };
    }

    // Handle free tickets
    if (isFreeTicket) {
      console.log("Processing free ticket...");
      
      // Ensure indexes are in sync with the latest schema (drops old unique index on stripeId if needed)
      try {
        await Order.syncIndexes();
        console.log("Indexes synced successfully");
      } catch (error) {
        console.log("Index sync warning:", error);
      }

      // Create the free order immediately
      console.log("Creating free order with data:", {
        event: eventObjectId,
        buyer: buyer._id,
        totalAmount: 0,
        isFree: true
      });
      
      const freeOrder = await Order.create({
        event: eventObjectId,
        buyer: buyer._id,
        totalAmount: 0,
        isFree: true,
      });
      
      console.log("Free order created successfully:", freeOrder._id);
      
      // Send RSVP notification
      try {
        const event = await Event.findById(eventObjectId);
        if (event) {
          await NotificationService.sendRSVPNotification(
            {
              firstName: buyer.firstName,
              lastName: buyer.lastName,
              email: buyer.email
            },
            {
              title: event.title,
              startDateTime: event.startDateTime,
              location: event.location
            }
          );
        }
      } catch (notificationError) {
        console.error("Failed to send RSVP notification:", notificationError);
        // Don't fail the checkout if notification fails
      }
      
      return { success: true, alreadyExists: false, message: "Free ticket claimed successfully" };
    }

    // Handle paid tickets
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("Missing STRIPE_SECRET_KEY env var");
    }
    
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: numericPrice * 100,
            product_data: { name: order.eventTitle },
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      metadata: { eventId: order.eventId, buyerId: order.buyerId },
      success_url: `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/profile`,
      cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/`,
    });

    // Paid flow: redirect to Stripe; order will be created by webhook upon payment success
    redirect(session.url!);
    
  } catch (error) {
    console.error("Error in checkoutOrder:", error);
    throw error;
  }
};

// ---------------------------
// Get orders by user
// ---------------------------
export const getOrdersByUser = async ({
  userId,
  limit = 10,
  page = 1,
}: GetOrdersByUserParams) => {
  await connectToDatabase();

  const skipAmount = (page - 1) * limit;
  const buyer = await User.findOne({ clerkId: userId });
  if (!buyer) throw new Error("User not found");

  const orders = await Order.find({ buyer: buyer._id })
    .sort({ createdAt: "desc" })
    .skip(skipAmount)
    .limit(limit)
    .populate({
      path: "event",
      model: Event,
      select: "_id title price isFree startDateTime",
    });

  return orders.map((order) => ({
    _id: order._id.toString(),
    totalAmount: order.totalAmount,
    createdAt: order.createdAt,
    isFree: order.isFree,
    event: order.event
      ? {
          _id: (order.event as any)._id.toString(),
          title: (order.event as any).title,
          price: (order.event as any).price,
          isFree: (order.event as any).isFree,
          startDateTime: (order.event as any).startDateTime,
        }
      : undefined,
  }));
};

// ---------------------------
// Create order (Stripe webhook)
// ---------------------------
export const createOrder = async ({
  stripeId,
  eventId,
  buyerId,
  totalAmount,
  createdAt,
}: CreateOrderWebhookParams) => {
  await connectToDatabase();

  const buyer = await User.findOne({ clerkId: buyerId });
  if (!buyer) throw new Error("Buyer not found");

  const eventObjectId = new ObjectId(eventId);

  // Guard against duplicates (unique index also enforces this)
  const existing = await Order.findOne({ stripeId });
  if (existing) return existing;

  const numericTotal = typeof totalAmount === 'string' ? Number(totalAmount) : totalAmount;

  const order = await Order.create({
    event: eventObjectId,
    buyer: buyer._id,
    totalAmount: isNaN(numericTotal) ? 0 : numericTotal,
    isFree: false,
    stripeId,
    ...(createdAt ? { createdAt } : {}),
  });

  return order;
};


