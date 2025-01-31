import { DataApp, Berth } from '../models';
import { Op, Transaction, Sequelize } from 'sequelize';
import { DEFAULT_AMOUNT, DEFAULT_PAGE } from '@bas/constant/common';

interface DataAppFilter {
  orgId: number;
  status?: string;
  search?: string;
  page?: number;
  amount?: number;
  order?: string;
  mode?: string;
}

export const getDataAppInfo = async (code: string, orgId: number) => {
  try {
    return await DataApp.findOne({
      where: { code, orgId },
      include: [
        {
          model: Berth,
          as: 'berth',
          attributes: ['id', 'name'],
        },
      ],
    });
  } catch (error) {
    console.error('Error in getDataAppInfo: ', error);
    throw error;
  }
};

export const getAllDataApps = async (filter: DataAppFilter) => {
  return DataApp.findAndCountAll({
    include: [
      {
        model: Berth,
        as: 'berth',
        attributes: ['name'],
      },
    ],
    where: {
      orgId: filter.orgId,
      ...(filter?.status && { status: filter.status }),
      ...(filter?.search && {
        [Op.or]: [
          { code: { [Op.like]: `%${filter.search}%` } },
          { displayName: { [Op.like]: `%${filter.search}%` } },
        ],
      }),
    },
    ...(filter?.page !== undefined &&
      filter?.amount !== undefined && {
        limit: filter.amount || DEFAULT_AMOUNT,
        offset: (filter.page ?? DEFAULT_PAGE) * (filter.amount ?? DEFAULT_AMOUNT),
      }),
    order: [[filter?.order || 'code', filter?.mode?.toUpperCase() || 'DESC']],
  });
};

export const updateDataApp = async (
  code: string,
  orgId: number,
  data: Partial<DataApp>,
  t?: Transaction
) => {
  return DataApp.update(
    {
      ...data,
      lastHeartbeat: data.lastHeartbeat ? new Date(data.lastHeartbeat) : undefined,
      lastDataActive: data.lastDataActive ? new Date(data.lastDataActive) : undefined,
    },
    {
      where: {
        code,
        orgId,
      },
      ...(t && { transaction: t }),
      returning: true,
    }
  );
};

export const deleteDataApp = async (code: string, orgId: number) => {
  return DataApp.destroy({
    where: {
      code,
      orgId,
    },
  });
};

export const createDataApp = async (
  code: string,
  orgId: number,
  data?: Partial<Omit<DataApp, 'code' | 'orgId'>>,
  t?: Transaction
) => {
  return DataApp.create(
    {
      code,
      orgId,
      ...data,
      lastHeartbeat: data?.lastHeartbeat ? new Date(data.lastHeartbeat) : undefined,
      lastDataActive: data?.lastDataActive ? new Date(data.lastDataActive) : undefined,
      status: data?.status || 'INACTIVE',
    },
    {
      ...(t && { transaction: t }),
    }
  );
};

export const getActiveDataApps = async (orgId: number) => {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  
  return DataApp.findAll({
    where: {
      orgId,
      lastHeartbeat: {
        [Op.gte]: fiveMinutesAgo,
      },
    },
    include: [
      {
        model: Berth,
        as: 'berth',
        attributes: ['id', 'name'],
      },
    ],
    attributes: ['code', 'status', 'displayName', 'lastHeartbeat', 'lastDataActive'],
  });
};


export const updateDataAppStatus = async (code: string, orgId: number, status: string) => {
  return DataApp.update(
    {
      status,
      lastDataActive: new Date(),
    },
    {
      where: {
        code,
        orgId,
      },
    }
  );
};

const LETTERS = 'ABCDEFGHIJKLMNPQRSTUVWXYZ';
const ALPHANUMERIC = '123456789ABCDEFGHIJKLMNPQRSTUVWXYZ';

export const generateUniqueDataAppCode = async (orgId: number): Promise<string> => {
  try {
    // Format orgId to 3 digits with leading zeros
    const formattedOrgId = orgId.toString().padStart(3, '0');
    
    let attempts = 0;
    const maxAttempts = 100; // Prevent infinite loop
    
    while (attempts < maxAttempts) {
      // Generate random parts of the code
      const firstChar = LETTERS[Math.floor(Math.random() * LETTERS.length)];
      const lastChar = ALPHANUMERIC[Math.floor(Math.random() * ALPHANUMERIC.length)];
      const nextLastChar = LETTERS[Math.floor(Math.random() * LETTERS.length)];
      // Combine parts to create the code
      const code = `${firstChar}${formattedOrgId}${nextLastChar}${lastChar}`;
      
      // Check if code exists in database
      const existingCode = await DataApp.findOne({
        where: { code },
      });
      
      if (!existingCode) {
        return code;
      }
      
      attempts++;
    }
    
    throw new Error('Unable to generate unique code after maximum attempts');
  } catch (error) {
    console.error('Error in generateUniqueDataAppCode: ', error);
    throw error;
  }
};