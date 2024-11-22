import { harborDefault, SystemRole } from '../master-data';
import { Account, Harbor, Role, Sensor, User } from '../models';
import { deviceDefault } from '../master-data/device-default';

const DEFAULT_PASSWORD = 'bas123456';

// Define specific role IDs, with 8 assigned to ADMIN
const roleMap = {
  [SystemRole.ADMIN]: 8,
  [SystemRole.CONFIGURE]: 9,
  [SystemRole.VIEW]: 10,
};

const createDefaultAuth = async () => {
  if ((await Role.count()) > 0) return;

  const defaultRoles = Object.values(SystemRole);
  for (const role of defaultRoles) {
    const roleId = roleMap[role];

    const createdRole = await Role.create({
      id: roleId, // Assign specific role ID, with 8 for ADMIN
      name: role,
      code: role,
      description: '',
    });

    const user = await User.create({
      roleId: createdRole.id, // Assign the correct role ID
      email: `default@${createdRole.code}.com`,
      fullName: `User ${createdRole.code}`,
      username: role.toLowerCase(),
      originalId: 0,
      permission: '',
      orgId: 1,
    });

    await Account.create({
      username: role.toLowerCase(),
      passwordHash: DEFAULT_PASSWORD,
      userId: user.id,
    });

    console.log(`Created default role and user for ${role}`);
  }
};

const createDefaultHarbor = async () => {
  // Lấy danh sách các orgId từ bảng User
  const orgIds = await User.findAll({
    attributes: ['orgId'],
    group: ['orgId'], // Đảm bảo không trùng lặp orgId
  }).then((users) => users.map((user) => user.orgId));

  for (const orgId of orgIds) {
    // Kiểm tra nếu Harbor đã tồn tại cho orgId
    const existingHarbor = await Harbor.findOne({ where: { orgId } });
    if (!existingHarbor) {
      await Harbor.create({
        ...harborDefault, // Thông tin mặc định
        orgId, // Gắn orgId
        name: `Harbor for orgId ${orgId}`, // Tên mặc định theo orgId
      });
      console.log(`Created default harbor for orgId: ${orgId}`);
    }
  }
};

const createDefaultDevice = async () => {
  if ((await Sensor.count()) > 0) return;

  for (const device of deviceDefault) {
    await Sensor.create(device);
  }

  console.log('Created default device');
};

export { createDefaultAuth, createDefaultHarbor, createDefaultDevice };
