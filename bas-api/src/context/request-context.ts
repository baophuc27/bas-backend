export default class RequestContext {
  orgId: number;
  userId: string;
  roleId: number;
  permissions: string[];
  fullName: string;

  constructor(
    orgId: number,
    userId: string,
    roleId: number,
    permissions: string[],
    fullName: string
  ) {
    this.orgId = orgId;
    this.userId = userId;
    this.roleId = roleId;
    this.permissions = permissions;
    this.fullName = fullName;
  }
}
