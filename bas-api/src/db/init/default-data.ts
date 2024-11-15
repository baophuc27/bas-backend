import { harborDefault, SystemRole } from '../master-data';
import { Account, Harbor, Role, Sensor, User } from '../models';
import { deviceDefault } from '../master-data/device-default';

const DEFAULT_PASSWORD = 'bas123456';

// Define specific role IDs, with 8 assigned to ADMIN
const roleMap = {
  [SystemRole.ADMIN]: 8,
  [SystemRole.CONFIGURE]: 2,
  [SystemRole.VIEW]: 3,
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
      orgId: 0,
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
  if ((await Harbor.count()) > 0) return;
  await Harbor.create(harborDefault);
  console.log('Created default harbor');
};

const createDefaultDevice = async () => {
  if ((await Sensor.count()) > 0) return;

  for (const device of deviceDefault) {
    await Sensor.create(device);
  }

  console.log('Created default device');
};

export { createDefaultAuth, createDefaultHarbor, createDefaultDevice };
