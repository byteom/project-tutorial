
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { UserManagementTable } from "@/components/admin/UserManagementTable";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-bold font-headline">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Manage users, view activity, and configure the platform.
        </p>
      </header>
      
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>
            View all users and perform administrative actions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserManagementTable />
        </CardContent>
      </Card>

    </div>
  );
}
