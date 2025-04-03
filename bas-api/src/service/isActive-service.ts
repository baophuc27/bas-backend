import { log } from '@bas/utils';
import { checkActiveStatus } from './data-app-service';
import { setUserActiveStatus } from './user-service';

/**
 * Run a job to check users' active status and update accordingly
 */
const runActiveStatusCheck = async () => {
    try {
        console.log('Running active status check');
        const activeStatusResponse = await checkActiveStatus();
        console.log('activeStatusResponse', activeStatusResponse);
        if (!activeStatusResponse || !activeStatusResponse.data || !Array.isArray(activeStatusResponse.data)) {
            console.log('Failed to fetch active status or invalid response format');
            return;
        }

        // Update each user's active status
        for (const user of activeStatusResponse.data) {
            try {
                if (user && user.name) {
                    await setUserActiveStatus(user.name, false);
                    console.log(`Updated status for user: ${user.name}`);
                }
            } catch (error) {
                console.error(`Failed to update status for user: ${user?.name || 'unknown'}`, error);
            }
        }

    } catch (error) {
        console.error('Error in runActiveStatusCheck:', error);
    }
};

/**
 * Start the active status scheduler
 * Runs every 5 minutes
 */
export const startActiveStatusScheduler = () => {
    // Run once at startup
    runActiveStatusCheck();

    // Then schedule to run every 5 minutes
    const intervalInMs = 5 * 60 * 1000; // 5 minutes
    setInterval(runActiveStatusCheck, intervalInMs);

    console.log(`Active status scheduler started, will run every ${intervalInMs / 1000} seconds`);
};
