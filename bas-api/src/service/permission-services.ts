import { mapApiPermissionsToRoles } from './permission-mapping';
import { roleMatrix } from '@bas/constant/role-matrix';
import { SystemPermission } from '@bas/constant/system-permission';

export function getSystemPermissionsFromRoles(roles: string[]): string[] {
  const systemPermissionsSet: Set<string> = new Set();

  roles.forEach((role) => {
    const permissions = roleMatrix[role];
    if (permissions) {
      permissions.forEach((perm) => systemPermissionsSet.add(perm));
    }
  });

  return Array.from(systemPermissionsSet);
}

export function getUserPermissions(apiPermissions: string[]) {
  const roles = mapApiPermissionsToRoles(apiPermissions);
  const systemPermissions = getSystemPermissionsFromRoles(roles);

  return {
    roles,
    systemPermissions,
  };
}
