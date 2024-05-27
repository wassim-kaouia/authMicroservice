const express = require('express');
const router = express.Router();
const { accountDeletionRequest,markRequestAsTreated,checkExistingRequest,cancelDeletionRequest,getAllRequests } = require('../controllers/accountDeletion');

/**
 * @swagger
 * /api/public/account-deletion/request:
 *   post:
 *     summary: Request account deletion
 *     description: Request deletion of a user account.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               deletionReason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Account deletion request successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Bad request. userId and deletionReason are required.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *     tags:
 *       - Public
 */
router.post('/request', async (req, res) => {
    try {
      
      const { userId, deletionReason } = req.body;
  
      // Check if userId and deletionReason are provided
      if (!userId || !deletionReason) {
        return res.status(400).json({ message: 'userId and deletionReason are required fields.' });
      }
  
      // Handle account deletion request
      const result = await accountDeletionRequest(userId, deletionReason);
  
      // Check if the deletion request was successful
      if (result.success) {
        return res.status(200).json({ message: result.message });
      } else {
        return res.status(500).json({ message: result.error });
      }
    } catch (error) {
      console.error('Error handling account deletion request:', error);
      return res.status(500).json({ message: 'Internal server error.' });
    }
  });
  
/**
 * @swagger
 * /api/public/account-deletion/mark-as-treated/{requestId}:
 *   put:
 *     summary: Mark account deletion request as treated
 *     description: Mark a specific account deletion request as treated.
 *     parameters:
 *       - name: requestId
 *         in: path
 *         description: ID of the deletion request to mark as treated
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Request marked as treated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Deletion request not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *     tags:
 *       - Public
 */
router.put('/mark-as-treated/:requestId', async (req, res) => {
  try {
    const { requestId } = req.params;

    // Check if requestId is provided
    if (!requestId) {
      return res.status(400).json({ message: 'Request ID is required.' });
    }

    // Mark the request as treated
    const result = await markRequestAsTreated(requestId);

    // Check if the request was successfully marked as treated
    if (result.success) {
      return res.status(200).json({ message: result.message });
    } else {
      return res.status(404).json({ message: result.message });
    }
  } catch (error) {
    console.error('Error marking account deletion request as treated:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});

/**
 * @swagger
 * /api/public/account-deletion/check-deletion-request/{userId}:
 *   get:
 *     summary: Check deletion request for user
 *     description: Check if there is an existing deletion request for a user.
 *     parameters:
 *       - name: userId
 *         in: path
 *         description: ID of the user to check for deletion request
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Success.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 exists:
 *                   type: boolean
 *                   description: Indicates if there is an existing deletion request for the user
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *     tags:
 *       - Public
 */
router.get('/check-deletion-request/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const existingRequest = await checkExistingRequest(userId);
  
      res.status(200).json({ exists: existingRequest });
    } catch (error) {
      console.error('Error checking existing deletion request:', error);
      res.status(500).json({ error: 'An error occurred while checking deletion request.' });
    }
  });

/**
 * @swagger
 * /api/public/account-deletion/cancel-request:
 *   post:
 *     summary: Cancel account deletion request
 *     description: Cancel an existing account deletion request for a user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Account deletion request canceled successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the cancellation was successful
 *                 message:
 *                   type: string
 *       400:
 *         description: Bad request. User ID is required.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the cancellation was successful
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the cancellation was successful
 *                 error:
 *                   type: string
 *     tags:
 *       - Public
 */
  router.post('/cancel-request', async (req, res) => {
    try {
      const { userId } = req.body;
      // Check if userId is provided
      if (!userId) {
        return res.status(400).json({ success: false, message: 'User ID is required.' });
      }
      // Cancel the account deletion request
      const result = await cancelDeletionRequest(userId);
      return res.status(result.code).json(result);
    } catch (error) {
      console.error('Error canceling account deletion request:', error);
      return res.status(500).json({ success: false, error: 'Internal server error.' });
    }
  });

  /**
 * @swagger
 * /api/public/account-deletion/deletion-requests:
 *   get:
 *     summary: Get all account deletion requests
 *     description: Get a list of all existing account deletion requests.
 *     responses:
 *       200:
 *         description: Success.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   // Define properties of each deletion request object here
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *     tags:
 *       - Public
 */
  router.get('/deletion-requests', async (req, res) => {
    try {
        const deletionRequests = await getAllRequests();
        res.json(deletionRequests);
    } catch (error) {
        console.error('Error fetching deletion requests:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
module.exports = router;
