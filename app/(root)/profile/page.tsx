import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert-dialog";
import { BadgeCheck } from "lucide-react";
import { headers } from "next/headers";
import { getUserById } from "@/lib/actions/user.actions";
import { getEventsByUser } from "@/lib/actions/event.actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, DollarSign, Edit, Trash2 } from "lucide-react";
// import { checkUser } from "@/lib/checkUser";

const ProfilePage = async () => {
  const user = await currentUser();
  
  const userId = user?.id as string;

  if (!userId) {
    redirect("/sign-in");
  }

  const existes = await getUserById(userId);
  const headerList = await headers();
  const url = new URL(headerList.get('referer') || 'http://localhost');
  const showSuccess = url.searchParams.get('success') === 'event-created';
  const userEvents = await getEventsByUser({ userId, page: 1 });

  return (
    <div className="wrapper my-8">
      <div className="max-w-4xl mx-auto">
        {showSuccess && (
          <div className="mb-6">
            <div className="flex items-center gap-2 rounded-md border border-green-200 bg-green-50 p-3 text-green-700">
              <BadgeCheck className="w-5 h-5" />
              <span>Event created successfully!</span>
            </div>
          </div>
        )}
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg p-8 text-white mb-8">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-3xl font-bold">
                {user?.firstName?.charAt(0) || user?.email?.charAt(0) || "U"}
              </span>
            </div>
            <div>
              <h1 className="text-3xl font-bold">
                {user?.firstName && user?.lastName 
                  ? `${user.firstName} ${user.lastName}` 
                  : user?.email || "User"
                }
              </h1>
              <p className="text-purple-100 mt-2">
                {user?.email}
              </p>
              <div className="flex gap-4 mt-4">
                <Badge variant="secondary" className="bg-white/20 text-white">
                  {userEvents?.data?.length || 0} Events Created
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white">
                  Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Button asChild className="h-20 bg-purple-600 hover:bg-purple-700">
            <Link href="/events/create" className="flex flex-col items-center gap-2">
              <span className="text-2xl">➕</span>
              <span>Create Event</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-20">
            <Link href="/my-tickets" className="flex flex-col items-center gap-2">
              <span className="text-2xl">🎫</span>
              <span>My Tickets</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-20">
            <Link href="/admin" className="flex flex-col items-center gap-2">
              <span className="text-2xl">⚙️</span>
              <span>Admin Panel</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-20">
            <Link href="/profile/update" className="flex flex-col items-center gap-2">
              <span className="text-2xl">📝</span>
              <span>Update Profile</span>
            </Link>
          </Button>
        </div>

        {/* My Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>My Events</span>
              <Badge variant="secondary">{userEvents?.data?.length || 0}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {userEvents?.data && userEvents.data.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userEvents.data.map((event: {
                  _id: string;
                  imageUrl?: string;
                  title: string;
                  startDateTime: string;
                  location: string;
                  isFree: boolean;
                  price?: number;
                  category?: { name?: string };
                }) => (
                  <Card key={event._id} className="overflow-hidden">
                    <div className="relative">
                      <img 
                        src={event.imageUrl || "/placeholder.svg"} 
                        alt={event.title} 
                        className="w-full h-48 object-cover" 
                      />
                      <Badge className="absolute top-3 left-3 bg-purple-600 text-white">
                        {event.category?.name || "Event"}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2 text-balance">{event.title}</h3>
                      
                      <div className="space-y-2 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(event.startDateTime).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          <span>{event.isFree ? "Free" : `$${event.price}`}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button asChild size="sm" className="flex-1">
                          <Link href={`/events/${event._id}`}>
                            View
                          </Link>
                        </Button>
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/events/${event._id}/update`}>
                            <Edit className="w-4 h-4" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📅</div>
                <h3 className="text-xl font-semibold mb-2">No events yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start creating amazing events for your community!
                </p>
                <Button asChild>
                  <Link href="/events/create">Create Your First Event</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
