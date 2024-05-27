const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *         fullname:
 *           type: string
 *         roles:
 *           type: array
 *           items:
 *             type: string
 *         email:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         numeroTel:
 *           type: string
 *         adresse:
 *           type: string
 *         codePostal:
 *           type: number
 *         ville:
 *           type: string
 *         pays:
 *           type: string
 *         age:
 *           type: number
 *         niveauEducation:
 *           type: string
 *         profession:
 *           type: string
 *         consentementCookies:
 *           type: boolean
 *         consentementAnalytics:
 *           type: boolean
 *         preferences:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               preferences:
 *                 type: array
 *                 items:
 *                   type: string
 *         gender:
 *           type: string
 *         avatar:
 *           type: string
 */

const userSchema = new mongoose.Schema({
  userId:{
    type: String,
    required: true
  },
  fullname: {
    type: String,
    required: true
  },
  roles:{
    type: [String],
    required: false
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  numeroTel: {
    type: String,
    required: false
  },
  adresse: {
    type: String,
    required: false
  },
  codePostal: {
    type: Number,
    required: false
  },
  ville: {
    type: String,
    required: false
  },
  pays: {
    type: String,
    required: false
  },
  age: {
    type: Number,
    required: false
  },
  niveauEducation: {
    type: String,
    required: false
  },
  profession: {
    type: String,
    required: false
  },
  consentementCookies: {
    type: Boolean,
    required: false
  },
  consentementAnalytics: {
    type: Boolean,
    required: false
  },
  preferences: {
    type: [{
      name: String,
      preferences: [String]
    }],
    required: false
  }
  ,
  gender: {
    type: String,
    required: false
  },
  avatar:{
    type: String,
    required: false
  },
  Duree_de_navigation:{
    type: Number,
    required: false
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
