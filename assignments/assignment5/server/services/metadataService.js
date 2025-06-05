// services/metadataService.js
const axios = require('axios');

const METADATA_BASE_URL = 'https://cs361.tylerlv.me/metadata';

/**
 * Send metadata to the external microservice
 * @param {number} fileId - The unique file identifier
 * @param {object} metadata - The metadata object to store
 * @returns {Promise<object>} - Response from the microservice
 */
async function addOrUpdateMetadata(fileId, metadata) {
  try {
    const url = `${METADATA_BASE_URL}/${fileId}`;
    const payload = { metadata };
    
    const response = await axios.post(url, payload, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000 // 10 second timeout
    });
    
    return {
      success: true,
      data: response.data,
      status: response.status
    };
  } catch (error) {
    console.error('Error sending metadata to microservice:', error.message);
    
    if (error.response) {
      // HTTP error response
      return {
        success: false,
        error: error.response.data?.error || 'Microservice error',
        status: error.response.status,
        data: error.response.data
      };
    } else if (error.request) {
      // Request made but no response
      return {
        success: false,
        error: 'No response from metadata microservice',
        status: 503
      };
    } else {
      // Something else happened
      return {
        success: false,
        error: 'Failed to connect to metadata microservice',
        status: 500
      };
    }
  }
}

/**
 * Retrieve metadata from the external microservice
 * @param {number} fileId - The unique file identifier
 * @returns {Promise<object>} - Response from the microservice
 */
async function getMetadata(fileId) {
  try {
    const url = `${METADATA_BASE_URL}/${fileId}`;
    
    const response = await axios.get(url, {
      timeout: 10000 // 10 second timeout
    });
    
    return {
      success: true,
      data: response.data,
      status: response.status
    };
  } catch (error) {
    console.error('Error retrieving metadata from microservice:', error.message);
    
    if (error.response) {
      return {
        success: false,
        error: error.response.data?.error || 'Microservice error',
        status: error.response.status,
        data: error.response.data
      };
    } else if (error.request) {
      return {
        success: false,
        error: 'No response from metadata microservice',
        status: 503
      };
    } else {
      return {
        success: false,
        error: 'Failed to connect to metadata microservice',
        status: 500
      };
    }
  }
}

/**
 * Generate a unique file ID (simple timestamp-based for now)
 * In production, you might want to use a more sophisticated ID generation
 * @returns {number} - A unique file identifier
 */
function generateFileId() {
  return Date.now();
}

module.exports = {
  addOrUpdateMetadata,
  getMetadata,
  generateFileId
};
