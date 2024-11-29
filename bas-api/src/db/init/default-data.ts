import { harborDefault, SystemRole } from '../master-data';
import { Account, Harbor, Role, Sensor, User } from '../models';
import { deviceDefault } from '../master-data/device-default';
import { getFromCache } from '@bas/utils/cache';

const DEFAULT_PASSWORD = 'bas123456';

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
      id: roleId,
      name: role,
      code: role,
      description: '',
    });

    const user = await User.create({
      roleId: createdRole.id,
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
  const orgIds = await User.findAll({
    attributes: ['orgId'],
    group: ['orgId'],
  }).then((users) => users.map((user) => user.orgId));

  for (const orgId of orgIds) {
    const existingHarbor = await Harbor.findOne({ where: { orgId } });
    const cachedData = await getFromCache(orgId.toString());
    const organization = cachedData.user.organization;
    if (!existingHarbor) {
      await Harbor.create({
        name: organization.nameVi,
        nameEn: organization.name,
        address: organization.address,
        description: organization.description || harborDefault.description,
        orgId,
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
