import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getOrdersByUser } from "@/lib/actions/order.actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, DollarSign, Download, QrCode } from "lucide-react";
import Link from "next/link";

const MyTicketsPage = async () => {
  const { sessionClaims } = await auth();
  const userId = sessionClaims?.userId as string;

  if (!userId) {
    redirect("/sign-in");
  }

  const orders = await getOrdersByUser({ userId, page: 1 });

  return (
    <div className="wrapper my-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Tickets</h1>
          <p className="text-muted-foreground">
            Manage and view all your event tickets
          </p>
        </div>

        {orders?.data && orders.data.length > 0 ? (
          <div className="space-y-6">
            {orders.data.map((order) => (
              <Card key={order._id} className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">{order.event?.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Order #{order._id.slice(-8).toUpperCase()}
                      </p>
                    </div>
                    <Badge 
                      variant={order.status === "completed" ? "default" : "secondary"}
                      className={order.status === "completed" ? "bg-green-600" : ""}
                    >
                      {order.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Event Details */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={order.event?.imageUrl || "/placeholder.svg"} 
                          alt={order.event?.title} 
                          className="w-20 h-20 object-cover rounded-lg" 
                        />
                        <div>
                          <h3 className="font-semibold">{order.event?.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {order.event?.category?.name}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span>
                            {new Date(order.event?.startDateTime || "").toLocaleDateString()} at{" "}
                            {new Date(order.event?.startDateTime || "").toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span>{order.event?.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-muted-foreground" />
                          <span>
                            {order.event?.isFree ? "Free" : `$${order.event?.price}`} × {order.quantity}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Ticket Actions */}
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">Ticket Details</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Quantity:</span>
                            <span className="font-medium">{order.quantity}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Total:</span>
                            <span className="font-medium">
                              ${order.totalAmount}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Purchased:</span>
                            <span className="font-medium">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button asChild className="flex-1">
                          <Link href={`/events/${order.event?._id}`}>
                            View Event
                          </Link>
                        </Button>
                        <Button variant="outline" size="icon">
                          <QrCode className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="icon">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-6xl mb-4">🎫</div>
              <h3 className="text-xl font-semibold mb-2">No tickets yet</h3>
              <p className="text-muted-foreground mb-4">
                You haven't purchased any event tickets yet. Start exploring events!
              </p>
              <Button asChild>
                <Link href="/">Browse Events</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MyTicketsPage;
