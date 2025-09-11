import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AdminEventsAnalytics = async () => {
  const { sessionClaims } = await auth();
  const userId = sessionClaims?.userId as string;
  if (!userId) redirect("/sign-in");
  const cu = await currentUser();
  const adminEmail = cu?.emailAddresses?.[0]?.emailAddress as string | undefined;
  const allowedEmail = process.env.ADMIN_EMAIL;
  const allowedUserId = process.env.ADMIN_USER_ID;
  if ((allowedEmail && adminEmail !== allowedEmail) || (allowedUserId && userId !== allowedUserId)) {
    redirect("/");
  }

  return (
    <div className="wrapper my-8">
      <div className="max-w-5xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Event Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Analytics coming soon.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminEventsAnalytics;

 