
export enum SystemRole {
  ADMIN = 'ADMIN',
  CONFIGURE = 'CONFIGURE',
  VIEW = 'VIEW',
}

export const getSystemRoleMassage = (role: string) => {
  switch (role) {
    case SystemRole.ADMIN:
      return {
        name: 'Quản trị viên',
        nameEn: 'Admin'
      };
    case SystemRole.CONFIGURE:
      return {
        name: 'Cấu hình',
        nameEn: 'Configure'
      };
    case SystemRole.VIEW:
      return {
        name: 'Xem',
        nameEn: 'View'
      };
  }
}