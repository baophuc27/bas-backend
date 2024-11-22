'use strict';

module.exports = {
  up: async (db) => {
    // Thêm cột orgId vào bảng Alarm
    await db.addColumn('Alarm', 'orgId', {
      type: 'integer',
      notNull: true,
      default: 1, // Giá trị mặc định cho các bản ghi hiện tại
    });

    // (Tùy chọn) Cập nhật giá trị mặc định cho các bản ghi hiện có
    await db.runSql(`
      UPDATE "Alarm"
      SET "orgId" = 1
      WHERE "orgId" IS NULL
    `);

    // Xóa giá trị mặc định nếu không cần giữ
    await db.changeColumn('Alarm', 'orgId', {
      type: 'integer',
      notNull: true,
    });
  },

  down: async (db) => {
    // Xóa cột orgId khi rollback migration
    await db.removeColumn('Alarm', 'orgId');
  },
};
