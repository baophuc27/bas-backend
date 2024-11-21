// src/db/hooks/sequelize-hooks.ts
import { AsyncContext } from '@bas/utils/AsyncContext';
import { Sequelize } from 'sequelize';

/**
 * Thêm orgId vào điều kiện where của các truy vấn Sequelize.
 */
export const addOrgIdToQuery = (options: any) => {
  const context = AsyncContext.getContext();
  if (context) {
    if (context.orgId !== undefined) {
      // Chỉ thêm orgId vào query nếu không có quyền truy cập toàn cục
      console.log(`[addOrgIdToQuery] Adding orgId: ${context.orgId}`);
      options.where = {
        ...options.where,
        orgId: context.orgId,
      };
    } else {
      console.log('[addOrgIdToQuery] Global access, no orgId filtering applied');
    }
  } else {
    console.warn('[addOrgIdToQuery] No context found');
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
