import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AdminSettings = async () => {
  const { sessionClaims } = await auth();
  const userId = sessionClaims?.userId as string;
  if (!userId) redirect("/sign-in");

  return (
    <div className="wrapper my-8">
      <div className="max-w-5xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Platform Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Settings UI coming soon.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSettings;

 