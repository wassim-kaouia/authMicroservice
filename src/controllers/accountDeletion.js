const accountDeletionRequestModel = require('../models/AccountDeletionModel');

// Method to handle account deletion requests
const accountDeletionRequest = async (userId, deletionReason) => {
  try {
 
    const deletionRequest = new accountDeletionRequestModel({
      userId,
      deletionReason,
    });

    // Save the deletion request to the database
    await deletionRequest.save();

    return {
      code: 200,
      success: true,
      message: 'Account deletion request successfully recorded.',
    };
  } catch (error) {
    console.error('Error handling account deletion request:', error);
    return {
      code: 500,
      success: false,
      error: error.message,
    };
  }
};

  
const checkExistingRequest = async (userId) => {
    try {
      // Check if there is an existing deletion request for the given userId
      const existingRequest = await accountDeletionRequestModel.findOne({ userId });
  
      return !!existingRequest; // Return true if a request exists, false otherwise
    } catch (error) {
      console.error('Error checking existing deletion request:', error);
      return false; // Return false in case of any error
    }
  };
  

const markRequestAsTreated = async (requestId) => {
    try {
      // Find the account deletion request by requestId
      const request = await accountDeletionRequestModel.findById(requestId);
  
      // Check if the request exists
      if (!request) {
        return { code: 404, success: false, message: 'Account deletion request not found.' };
      }
  
      // Update the treated field to true and set treatedAt to current date and time
      request.treated = true;
      request.treatedAt = new Date();
  
      // Save the updated request
      await request.save();
  
      return { code: 200, success: true, message: 'Account deletion request marked as treated.' };
    } catch (error) {
      return { code: 500, success: false, error: error.message };
    }
  };

  const cancelDeletionRequest = async (userId) => {
    try {
      // Find and delete the deletion request for the given userId
      await accountDeletionRequestModel.deleteOne({ userId });
      return { code: 200, success: true, message: 'Account deletion request canceled.' };
    } catch (error) {
      console.error('Error canceling account deletion request:', error);
      return { code: 500, success: false, error: error.message };
    }
  };
  
  const getAllRequests = async () => {
    try {
        return await accountDeletionRequestModel.find();
    } catch (error) {
        console.error('Error fetching deletion requests:', error);
        throw error; // Throw error for handling in the caller function
    }
}
module.exports = { accountDeletionRequest, markRequestAsTreated,checkExistingRequest,cancelDeletionRequest,getAllRequests };
