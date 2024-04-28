import { Separator } from "@/components/ui/separator";
import { UserManagement } from "./user-management";

export default function UserManagementPage() {
  return (
    <div className="space-y-2">
      <div>
        <h3 className="text-lg font-medium">User management</h3>
        <p className="text-sm text-muted-foreground">
            Manage your users, personas/access groups, portals and pages.
        </p>
      </div>
      <Separator />
      <UserManagement />
    </div>
  )
}
