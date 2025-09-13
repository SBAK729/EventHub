"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { IEvent } from "@/lib/database/models/event.model";
import { checkoutOrder } from "@/lib/actions/order.actions";

interface CheckoutProps {
  event: IEvent;
  userId: string;
}

const Checkout: React.FC<CheckoutProps> = ({ event, userId }) => {
  const [isLoading, setIsLoading] = useState(false);

  const onCheckout = async () => {
    try {
      if (isLoading) return;
      setIsLoading(true);
      
      console.log("Starting checkout for event:", {
        eventId: event._id,
        title: event.title,
        price: event.price,
        isFree: event.isFree,
        userId: userId
      });
      
      const result = await checkoutOrder({
        eventTitle: event.title,
        eventId: event._id,
        price: Number(event.price ?? 0),
        isFree: event.isFree ?? false,
        buyerId: userId,
      });
      
      if (result && result.success) {
        if (result.alreadyExists) {
          alert(result.message);
        } else {
          alert(result.message);
          // Redirect to my-tickets page
          window.location.href = '/my-tickets';
        }
      }
    } catch (err) {
      console.error("Checkout failed:", err);
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      alert(`Checkout failed: ${errorMessage}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Button onClick={onCheckout} size="lg" className="sm:w-fit" disabled={isLoading}>
        {isLoading ? (event.isFree ? "Claiming..." : "Redirecting...") : (event.isFree ? "Get Ticket" : "Buy Ticket")}
      </Button>
    </div>
  );
};

export default Checkout;
