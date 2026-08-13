"use client";

import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { togglePermission } from "@/lib/actions/admin";

interface RolePermissionsProps {
  roleId: string;
  permissions: { key: string; name: string; granted: boolean }[];
}

/** Permission matrix editor for a single role. */
export function RolePermissions({ roleId, permissions }: RolePermissionsProps) {
  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {permissions.map((permission) => (
        <label
          key={permission.key}
          className="flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm transition-colors hover:bg-accent"
        >
          <Checkbox
            defaultChecked={permission.granted}
            onCheckedChange={async (checked) => {
              const result = await togglePermission({
                roleId,
                permissionKey: permission.key,
                grant: checked === true,
              });
              if (!result.ok) toast.error(result.error);
            }}
          />
          <div>
            <p className="font-mono text-xs">{permission.key}</p>
            <p className="text-xs text-muted-foreground">{permission.name}</p>
          </div>
        </label>
      ))}
    </div>
  );
}
