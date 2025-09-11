import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getAllEvents, getPendingEvents, updateEventStatus } from "@/lib/actions/event.actions";
import { getAllUsers } from "@/lib/actions/user.actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Eye, 
  Edit, 
  Trash2,
  BarChart3,
  Settings,
  UserCheck,
} from "lucide-react";
import Link from "next/link";
import { headers } from "next/headers";
import { BadgeCheck } from "lucide-react";

const AdminPage = async () => {
  const { sessionClaims } = await auth();
  const userId = sessionClaims?.userId as string;

  if (!userId) {
    redirect("/sign-in");
  }

  // Restrict to single admin via env ADMIN_EMAIL or ADMIN_USER_ID
  const cu = await currentUser();
  const adminEmail = cu?.emailAddresses?.[0]?.emailAddress as string | undefined;
  const allowedEmail = process.env.ADMIN_EMAIL;
  const allowedUserId = process.env.ADMIN_USER_ID;
  if ((allowedEmail && adminEmail !== allowedEmail) || (allowedUserId && userId !== allowedUserId)) {
    redirect("/");
  }
  const events = await getAllEvents({ 
    query: "", 
    category: "", 
    page: 1, 
    limit: 10 
  });
  const headerList = await headers();
  const url = new URL(headerList.get('referer') || 'http://localhost');
  const showSuccess = url.searchParams.get('success') === 'event-created';
  
  const users = await getAllUsers({ 
    query: "", 
    page: 1, 
    limit: 10 
  });

  const pending = await getPendingEvents();

  // Mock stats - in a real app, these would come from your database
  const stats = {
    totalEvents: events?.data?.length || 0,
    totalUsers: users?.data?.length || 0,
    totalRevenue: 12500,
    activeEvents: events?.data?.filter((event: any) => new Date(event.startDateTime) > new Date()).length || 0
  };

  return (
    <div className="wrapper my-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your EventHub platform
          </p>
        </div>

        {showSuccess && (
          <div className="mb-6">
            <div className="flex items-center gap-2 rounded-md border border-green-200 bg-green-50 p-3 text-green-700">
              <BadgeCheck className="w-5 h-5" />
              <span>Event created successfully!</span>
            </div>
          </div>
        )}

        {/* Pending Approvals */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Pending Event Approvals</CardTitle>
            </CardHeader>
            <CardContent>
              {pending && pending.length > 0 ? (
                <div className="space-y-4">
                  {pending.map((p: any) => (
                    <div key={p._id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3 min-w-0">
                        <img src={p.imageUrl} alt={p.title} className="w-12 h-12 rounded object-cover" />
                        <div className="min-w-0">
                          <p className="font-medium truncate">{p.title}</p>
                          <p className="text-sm text-muted-foreground truncate">By {p.organizer?.firstName} {p.organizer?.lastName}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <form action={async () => { 'use server'; await updateEventStatus({ eventId: p._id, status: 'approved' }) }}> 
                          <Button type="submit" size="sm" className="bg-green-600 hover:bg-green-700">Approve</Button>
                        </form>
                        <form action={async () => { 'use server'; await updateEventStatus({ eventId: p._id, status: 'rejected' }) }}>
                          <Button type="submit" size="sm" variant="destructive">Reject</Button>
                        </form>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No pending events.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Events</p>
                  <p className="text-2xl font-bold">{stats.totalEvents}</p>
                </div>
                <Calendar className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold">{stats.totalUsers}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Events</p>
                  <p className="text-2xl font-bold">{stats.activeEvents}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
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
            <Link href="/admin/events" className="flex flex-col items-center gap-2">
              <BarChart3 className="w-6 h-6" />
              <span>Event Analytics</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-20">
            <Link href="/admin/settings" className="flex flex-col items-center gap-2">
              <Settings className="w-6 h-6" />
              <span>Platform Settings</span>
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Events */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Recent Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              {events?.data && events.data.length > 0 ? (
                <div className="space-y-4">
                  {events.data.slice(0, 5).map((event: {
                    _id: string;
                    imageUrl?: string;
                    title: string;
                    startDateTime: string;
                  }) => (
                    <div key={event._id} className="flex items-center gap-4 p-3 border rounded-lg">
                      <img 
                        src={event.imageUrl || "/placeholder.svg"} 
                        alt={event.title} 
                        className="w-12 h-12 object-cover rounded" 
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{event.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(event.startDateTime).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/events/${event._id}`}>
                            <Eye className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/events/${event._id}/update`}>
                            <Edit className="w-4 h-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No events found</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Users */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="w-5 h-5" />
                Recent Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              {users?.data && users.data.length > 0 ? (
                <div className="space-y-4">
                  {users.data.slice(0, 5).map((user: {
                    _id: string;
                    firstName?: string;
                    lastName?: string;
                    email?: string;
                    createdAt: string;
                    role?: string;
                  }) => (
                    <div key={user._id} className="flex items-center gap-4 p-3 border rounded-lg">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 font-semibold">
                          {user.firstName?.charAt(0) || user.email?.charAt(0) || "U"}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium">
                          {user.firstName && user.lastName 
                            ? `${user.firstName} ${user.lastName}` 
                            : user.email
                          }
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Joined {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant="secondary">
                        {user.role || "User"}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No users found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
