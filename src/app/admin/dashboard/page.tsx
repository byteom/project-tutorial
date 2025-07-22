
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { UserManagementTable } from "@/components/admin/UserManagementTable";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
            <h1 className="text-4xl font-bold font-headline">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-2">
            Manage users, view activity, and configure the platform.
            </p>
        </div>
        <Button asChild>
            <Link href="/admin/add-question">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Question
            </Link>
        </Button>
      </header>
      
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>
            View all users and perform administrative actions. To bulk upload questions, run `npm run bulk-load` in your terminal.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserManagementTable />
        </CardContent>
      </Card>

    </div>
  );
}
