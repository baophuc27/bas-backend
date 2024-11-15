import { DEFAULT_AMOUNT, DEFAULT_PAGE } from '@bas/constant/common';
import { Role } from '@bas/database/models';
import { UserQueryParams } from '@bas/service/typing';
import { Op, Sequelize } from 'sequelize';
import User, { UserInput } from './../models/user-model';

const getAllWithParams = async (params?: UserQueryParams) => {
  try {
    return await User.findAndCountAll({
      where: {
        ...(params?.search && {
          [Op.or]: [
            {
              email: {
                [Op.like]: `%${params.search}%`,
              },
            },
            {
              phone: {
                [Op.like]: `%${params.search}%`,
              },
            },
            {
              fullName: {
                [Op.like]: `%${params.search}%`,
              },
            },
          ],
        }),
        ...(params?.roleId && {
          roleId: params.roleId,
        }),
      },
      include: [
        {
          model: Role,
          as: 'role',
          attributes: ['id', 'code'],
        },
      ],
      limit: params?.amount || DEFAULT_AMOUNT,
      offset: (params?.page || DEFAULT_PAGE) * (params?.amount || DEFAULT_AMOUNT),
      order: [[params?.order || 'createdAt', params?.mode?.toUpperCase() || 'DESC']],
      logging: true,
    });
  } catch (error) {
    throw error;
  }
};

const getOneUserById = async (id: string) => {
  try {
    return await User.findOne({
      where: {
        id,
        deletedAt: {
          [Op.eq]: null,
        },
      },
    });
  } catch (error) {
    throw error;
  }
};

const update = async (payload: UserInput, transaction?: any) => {
  try {
    return await User.update(payload, {
      where: {
        id: payload.id,
        deletedAt: {
          [Op.eq]: null,
        },
      },
      transaction: transaction,
    });
  } catch (error) {
    throw error;
  }
};

const markUserAsDeletedById = async (id: string) => {
  try {
    await User.update(
      {
        email: Sequelize.literal(`concat(email,'-', 'deleted', '-', '${Date.now()}')`), // Mark email as deleted, so we can use it again next time
        phone: Sequelize.literal(`concat(phone,'-', 'deleted', '-', '${Date.now()}')`),
      },
      {
        where: {
          id,
        },
      }
    );
    return await User.destroy({
      where: {
        id,
      },
    });
  } catch (error) {
    throw error;
  }
};
const isDuplicateEmail = async (email: string) => {
  return User.count({ where: { email } }).then((count) => {
    return count > 0;
  });
};
const isDuplicatePhoneWithOther = async (phone: string, id: string) => {
  return User.count({
    where: {
      phone,
      id: {
        [Op.ne]: id,
      },
    },
  }).then((count) => {
    return count > 0;
  });
};
const isDuplicateEmailWithOther = async (email: string, id: string) => {
  return User.count({
    where: {
      email,
      id: {
        [Op.ne]: id,
      },
    },
  }).then((count) => {
    return count > 0;
  });
};

const findUserByRole = async (roleCode: string) => {
  return await User.findOne({
    where: {
      '$role.code$': roleCode,
    },
    include: [
      {
        model: Role,
        as: 'role',
        attributes: ['id', 'code'],
      },
    ],
  });
};
const createUsers = async (payload: UserInput, transaction?: any) => {
  try {
    const user = await User.findOne({
      where: {
        originalId: payload.originalId,
      },
    });

    if (user) {
      await User.update(payload, {
        where: {
          originalId: payload.originalId,
        },
        transaction: transaction,
      });
    } else {
      await User.create(payload, {
        returning: true,
        transaction: transaction,
      });
    }

    return await User.findOne({
      where: {
        originalId: payload.originalId,
      },
    });
  } catch (error) {
    throw error;
  }
};
export { update, getOneUserById, getAllWithParams, findUserByRole, createUsers };
