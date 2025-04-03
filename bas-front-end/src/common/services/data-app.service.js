import { authAxiosClient } from "setup/axios/auth.axios";

const ROOT_PATH = "/data-app";

export const DataAppService = {
  /**
   * Get all data apps with filtering
   * @param {Object} params - Query parameters for filtering
   * @returns {Promise} API response
   */
  getAll(params) {
    return authAxiosClient.get(ROOT_PATH, {
      params,
    });
  },

  /**
   * Get a data app by its code
   * @param {string} code - Data app code
   * @returns {Promise} API response
   */
  getOne(code) {
    return authAxiosClient.get(`${ROOT_PATH}/${code}`);
  },

  /**
   * Get available data app code
   * @returns {Promise} API response
   */
  getAvailableCode() {
    return authAxiosClient.get(`${ROOT_PATH}/available-code`);
  },

  /**
   * Get active data apps
   * @returns {Promise} API response
   */
  getActive() {
    return authAxiosClient.get(`${ROOT_PATH}/status/active`);
  },

  /**
   * Create a new data app
   * @param {Object} body - Data app creation payload
   * @returns {Promise} API response
   */
  create(body) {
    return authAxiosClient.post(ROOT_PATH, {
      ...body,
    });
  },

  /**
   * Update a data app
   * @param {string} code - Data app code
   * @param {Object} body - Data app update payload
   * @returns {Promise} API response
   */
  update(code, body) {
    return authAxiosClient.put(`${ROOT_PATH}/${code}`, {
      ...body,
    });
  },

  /**
   * Update data app status
   * @param {string} code - Data app code
   * @param {Object} body - Status update payload
   * @returns {Promise} API response
   */
  updateStatus(code, body) {
    return authAxiosClient.put(`${ROOT_PATH}/${code}/status`, {
      ...body,
    });
  },


  /**
 * Delete a data app
 * @param {string} code - Data app code to delete
 * @returns {Promise} API response
 */
  delete(code) {
    return authAxiosClient.delete(`${ROOT_PATH}/${code}`);
  },
};

