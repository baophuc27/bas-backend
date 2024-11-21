// src/db/hooks/sequelize-hooks.ts
import { AsyncContext } from '@bas/utils/AsyncContext';
import { Sequelize } from 'sequelize';

/**
 * Thêm orgId vào điều kiện where của các truy vấn Sequelize.
 */
const addOrgIdToQuery = (options: any) => {
  const context = AsyncContext.getContext();
  if (context && context.orgId) {
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

  // Hook cho các truy vấn xóa
  sequelize.addHook('beforeDestroy', (options: any) => {
    addOrgIdToQuery(options);
  });

  // Hook cho các truy vấn cập nhật
  sequelize.addHook('beforeUpdate', (options: any) => {
    addOrgIdToQuery(options);
  });
}
