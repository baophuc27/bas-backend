// src/db/hooks/sequelize-hooks.ts

import { AsyncContext } from '@bas/utils/AsyncContext';
import { Sequelize } from 'sequelize';

/**
 * Thêm orgId vào instance trước khi lưu vào DB.
 */
const addOrgIdToInstance = (instance: any) => {
  const context = AsyncContext.getContext();
  if (context && context.orgId !== undefined) {
    instance.dataValues.orgId = context.orgId;
  }
};

/**
 * Thêm orgId vào điều kiện where cho các truy vấn Sequelize.
 */
const addOrgIdToQuery = (options: any) => {
  const context = AsyncContext.getContext();
  if (context && context.orgId !== undefined) {
    options.where = {
      ...options.where,
      orgId: context.orgId,
    };
  }
};

/**
 * Thiết lập các hooks tối giản cho Sequelize.
 * @param sequelize - Instance Sequelize hiện tại.
 */
export function setupSequelizeHooks(sequelize: Sequelize) {
  // Hook cho các truy vấn tìm kiếm (find)
  sequelize.addHook('beforeFind', (options: any) => {});

  // Hook cho các truy vấn thêm mới (create)
  sequelize.addHook('beforeCreate', (instance: any) => {});

  // Hook cho các truy vấn cập nhật (update)
  sequelize.addHook('beforeUpdate', (instance: any) => {});

  // Hook cho upsert (create or update)
  sequelize.addHook('beforeSave', (instance: any) => {});
}
