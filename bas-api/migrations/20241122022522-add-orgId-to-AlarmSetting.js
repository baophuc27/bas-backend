'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.addColumn('AlarmSetting', 'orgId', {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1, // Đặt giá trị mặc định nếu cần
      });
      console.log('Column orgId added to AlarmSetting successfully');
    } catch (error) {
      console.error('Failed to add column orgId to AlarmSetting:', error);
      throw error;
    }
  },

  down: async (queryInterface) => {
    try {
      await queryInterface.removeColumn('AlarmSetting', 'orgId');
      console.log('Column orgId removed from AlarmSetting successfully');
    } catch (error) {
      console.error('Failed to remove column orgId from AlarmSetting:', error);
      throw error;
    }
  },
};
