// permission-mapping.ts
import { CLOUD_PERMISSION } from '@bas/constant/cloud-permission';

export function mapApiPermissionsToRoles(apiPermissions: string[]): string[] {
  const roles: string[] = [];
  if (
    apiPermissions.includes(CLOUD_PERMISSION.BAS_RECORDING_VIEW) &&
    apiPermissions.includes(CLOUD_PERMISSION.BAS_RECORDING_CREATE) &&
    apiPermissions.includes(CLOUD_PERMISSION.BAS_RECORDING_EDIT) &&
    apiPermissions.includes(CLOUD_PERMISSION.BAS_RECORDING_DELETE)
  ) {
    roles.push('ADMIN');
  } else if (
    apiPermissions.includes(CLOUD_PERMISSION.BAS_RECORDING_VIEW) &&
    apiPermissions.includes(CLOUD_PERMISSION.BAS_RECORDING_CREATE) &&
    apiPermissions.includes(CLOUD_PERMISSION.BAS_RECORDING_EDIT)
  ) {
    roles.push('CONFIGURE');
  } else if (apiPermissions.includes(CLOUD_PERMISSION.BAS_RECORDING_VIEW)) {
    roles.push('VIEW');
  }

  return roles;
}
