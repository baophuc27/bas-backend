// src/db/hooks/sequelize-hooks.ts
import { AsyncContext } from '@bas/utils/AsyncContext';
import { Sequelize } from 'sequelize';

/**
 * Thêm orgId vào instance trước khi lưu vào DB.
 */
const addOrgIdToInstance = (instance: any) => {
  const context = AsyncContext.getContext();
  if (context && context.orgId !== undefined) {
    console.log(
      `[addOrgIdToInstance] Adding orgId: ${context.orgId} to ${instance.constructor.name}`
    );
    instance.dataValues.orgId = context.orgId;
  } else {
    console.warn(
      `[addOrgIdToInstance] No orgId found in context for instance ${instance.constructor.name}`
    );
  }
};

/**
 * Thêm orgId vào điều kiện where cho các truy vấn Sequelize.
 */
const addOrgIdToQuery = (options: any) => {
  const context = AsyncContext.getContext();
  if (context && context.orgId !== undefined) {
    console.log(`[addOrgIdToQuery] Adding orgId: ${context.orgId}`);
    options.where = {
      ...options.where,
      orgId: context.orgId,
    };
  } else {
    console.warn('[addOrgIdToQuery] No orgId found in context');
  }
};

/**
 * Thiết lập các hooks cho Sequelize.
 * @param sequelize - Instance Sequelize hiện tại.
 */
export function setupSequelizeHooks(sequelize: Sequelize) {
  // Hook cho các truy vấn tìm kiếm
  sequelize.addHook('beforeFind', (options: any) => {
    addOrgIdToQuery(options);
  });

  // Hook cho các truy vấn thêm mới
  sequelize.addHook('beforeCreate', (instance: any) => {
    addOrgIdToInstance(instance);
  });

  // Hook cho các truy vấn cập nhật
  sequelize.addHook('beforeUpdate', (instance: any) => {
    addOrgIdToInstance(instance);
  });

  // Hook cho upsert
  sequelize.addHook('beforeSave', (instance: any) => {
    addOrgIdToInstance(instance);
  });

  // Xử lý các truy vấn riêng cho từng model
  sequelize.addHook('beforeFind', (options: any) => {
    if (options.model?.name === 'Record') {
      addOrgIdToQuery(options);
    }
  });

  sequelize.addHook('beforeCreate', (instance: any) => {
    if (instance.constructor.name === 'Record') {
      addOrgIdToInstance(instance);
    }
  });

  sequelize.addHook('beforeUpdate', (instance: any) => {
    if (instance.constructor.name === 'Record') {
      addOrgIdToInstance(instance);
    }
  });

  sequelize.addHook('beforeSave', (instance: any) => {
    if (instance.constructor.name === 'Record') {
      addOrgIdToInstance(instance);
    }
  });
}
