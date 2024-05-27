const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     AccountDeletionRequest:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *         deletionReason:
 *           type: string
 *         treated:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         treatedAt:
 *           type: string
 *           format: date-time
 */


const accountDeletionRequestSchema = new mongoose.Schema({
  userId:{
    type: String,
    required: true,
    unique:true
  },
  deletionReason: {
    type: String,
    required: true
  },
  treated: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  treatedAt: {
    type: Date,
    default: null
  }
});

const accountDeletionRequestModel = mongoose.model('accountDeletionRequest', accountDeletionRequestSchema);

module.exports = accountDeletionRequestModel;
