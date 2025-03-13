/**
 * Filter Data Service
 * 
 * This service provides functions to filter and transform record history data
 * based on sensor status and other criteria.
 */

/**
 * Applies sensor status rules to record history data:
 * - If left sensor status is 2, set left speed and distance to null
 * - If right sensor status is 2, set right speed and distance to null
 * - If either sensor is 2, set angle to null
 * 
 * @param recordHistory - Record history data to filter
 * @returns Filtered record history with nullified values based on sensor status
 */
export const applySensorStatusRules = <T extends Record<string, any>>(recordHistory: T): T => {
    // Create a copy of the record history to modify
    const modifiedHistory = { ...recordHistory };

    // Get the actual data, handling both direct objects and Sequelize models
    const data = modifiedHistory.dataValues || modifiedHistory;

    // If left sensor status is 2, set left speed and distance to null
    if (data.leftStatus === 2) {
        data.leftSpeed = null;
        data.leftDistance = null;
    }

    // If right sensor status is 2, set right speed and distance to null
    if (data.rightStatus === 2) {
        data.rightSpeed = null;
        data.rightDistance = null;
    }

    // If either sensor status is 2, set angle to null
    if (data.leftStatus === 2 || data.rightStatus === 2) {
        data.angle = null;
    }

    return data;
};

/**
 * Apply sensor status rules to an array of record histories
 * 
 * @param recordHistories - Array of record history data
 * @returns Array of filtered record histories
 */
export const filterRecordHistories = <T extends Record<string, any>>(recordHistories: T[]): T[] => {
    if (!recordHistories || !Array.isArray(recordHistories)) {
        return [];
    }

    return recordHistories.map(recordHistory => applySensorStatusRules(recordHistory));
};
