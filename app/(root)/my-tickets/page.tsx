import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getOrdersByUser } from "@/lib/actions/order.actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Server-side component (no "use client")
export default async function MyTicketsPage() {
  // -----------------------
  // 1️⃣ Clerk authentication
  // -----------------------
  const session = await auth(); // ✅ await the promise
  const userId = session.userId;

  if (!userId) {
    redirect("/sign-in"); // redirect if not authenticated
  }

  // -----------------------
  // 2️⃣ Fetch orders for user
  // -----------------------
  const orders = await getOrdersByUser({ userId, limit: 10, page: 1 });

  if (!orders || orders.length === 0) {
    return <p className="text-center mt-10">You have no tickets yet.</p>;
  }

  // -----------------------
  // 3️⃣ Render tickets
  // -----------------------
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {orders.map((order) => (
        <Card key={order._id}>
          <CardHeader>
            <CardTitle>{order.event?.title ?? "Untitled Event"}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Amount Paid: ${Number(order.totalAmount ?? 0).toFixed(2)}</p>
            <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
            <Badge className="mt-2">
              {order.isFree ? "Free Ticket" : "Paid Ticket"}
            </Badge>
          </CardContent>
          <div className="p-4">
            <Button asChild>
              <Link href={order.event?._id ? `/events/${order.event._id}` : "/my-tickets"}>
                View Ticket
              </Link>
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
