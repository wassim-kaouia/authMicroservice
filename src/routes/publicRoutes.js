const express = require('express');
const router = express.Router();
const { addUser, checkUserExistence, getUser, getUsers, updateUser, updateUserAvatar,deleteUser, addAdmin } = require('../controllers/auth'); 


/**
 * @swagger
 * /api/public:
 *   get:
 *     summary: Returns a public message.
 *     description: Returns a message that does not require authentication.
 *     responses:
 *       200:
 *         description: A successful response with a message.
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
router.get('/', (req, res) => {
  res.json({
    message: 'Hello from a public endpoint! You don\'t need to be authenticated to see this.'
  });
});

/**
 * @swagger
 * /api/public/register:
 *   post:
 *     summary: Register a new user.
 *     description: Register a new user with provided name, email, and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullname:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     fullname:
 *                       type: string
 *                     email:
 *                       type: string
 *       400:
 *         description: Bad request. Name, email, and password are required.
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
router.post('/register', async (req, res) => {
  const userData = req.body;

  // Check if required fields are present in the request body
  if (!userData.fullname || !userData.email) {
    return res.status(400).json({ message: 'Name and email are required' });
  }

  try {
    const newUser = await addUser(userData);
    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


/**
 * @swagger
 * /api/public/checkUser/{userId}:
 *   get:
 *     summary: Check User Existence
 *     description: |
 *       Check the existence of a user based on their ID.
 *       Returns a boolean value indicating whether the user exists or not.
 *     parameters:
 *       - name: userId
 *         in: path
 *         description: ID of the user to check
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: User Existence Checked Successfully
 *         schema:
 *           type: object
 *           properties:
 *             userExists:
 *               type: boolean
 *               description: Indicates if the user exists
 *       400:
 *         description: Bad Request
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               description: Error message
 *       500:
 *         description: Internal Server Error
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 *               description: Error message
 *     tags:
 *       - Public
 */
router.get('/checkUser/:userId/:email', async (req, res) => {
  const {userId,email} = req.params;

  try {
    const userExists = await checkUserExistence(userId,email);
    res.json({ userExists });
  } catch (error) {
    console.error('Error checking user existence:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/public/getUser/{userId}:
 *   get:
 *     summary: Get User by ID
 *     description: Get user details by their ID.
 *     parameters:
 *       - name: userId
 *         in: path
 *         description: ID of the user to retrieve
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   description: User object
 *       400:
 *         description: Bad request. User ID is required.
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
router.get('/getUser/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await getUser(userId);
    res.json({ user });
  } catch (error) {
    console.error('Error checking user existence:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/public/getAll:
 *   get:
 *     summary: Get All Users
 *     description: Get details of all users.
 *     responses:
 *       200:
 *         description: Users details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     description: User object
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *     tags:
 *       - Public
 */
router.get('/getAll', async (req, res) => {

  try {
    const user = await getUsers();
    res.json({ user });
  } catch (error) {
    console.error('Error checking user existence:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


/**
 * @swagger
 * /api/public/updateUser/{userId}:
 *   put:
 *     summary: Update an existing user.
 *     description: Update an existing user with provided fields. Not all fields are required to be specified, just update what is found.
 *     parameters:
 *       - name: userId
 *         in: path
 *         description: ID of the user to update
 *         required: true
 *         type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullname:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     fullname:
 *                       type: string
 *                     email:
 *                       type: string
 *       400:
 *         description: Bad request. User ID is required.
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
router.put('/updateUser/:userId', async (req, res) => {
  const userId = req.params.userId;
  const userData = req.body;

  // Check if user ID is present in the request parameters
  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    const updatedUser = await updateUser(userId, userData);
    res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


/**
 * @swagger
 * /api/public/updateUserAvatar/{userId}:
 *   put:
 *     summary: Update user avatar.
 *     description: Update the avatar of an existing user.
 *     parameters:
 *       - name: userId
 *         in: path
 *         description: ID of the user to update avatar
 *         required: true
 *         type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               avatarPath:
 *                 type: string
 *     responses:
 *       200:
 *         description: Avatar updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     avatar:
 *                       type: string
 *       400:
 *         description: Bad request. User ID and avatar path are required.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: User not found.
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
router.put('/updateUserAvatar/:userId', async (req, res) => {
  const userId = req.params.userId;
  const { avatarPath } = req.body;

  // Check if user ID and avatar path are provided
  if (!userId || !avatarPath) {
    return res.status(400).json({ message: 'User ID and avatar path are required' });
  }

  try {
    const updatedUser = await updateUserAvatar(userId, avatarPath);
    res.status(200).json({ message: 'Avatar updated successfully', user: { avatar: updatedUser.avatar } });
  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(400).json({ message: error.message });
  }
});


/**
 * @swagger
 * /api/public/deleteUser/{userId}:
 *   delete:
 *     summary: Delete User
 *     description: Delete a user and associated data by their ID.
 *     parameters:
 *       - name: userId
 *         in: path
 *         description: ID of the user to delete
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: User and associated data deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error
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
router.delete('/deleteUser/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await deleteUser(userId);
    if (result) {
      res.status(200).json({ message: `User with userId ${userId} and associated data deleted successfully.` });
    } else {
      res.status(404).json({ message: `User with userId ${userId} not found.` });
    }
  } catch (error) {
    console.error('Error deleting user and associated data:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});


/**
 * @swagger
 * /api/public/registerAdmin:
 *   post:
 *     summary: Register a new admin.
 *     description: Register a new admin with provided nickname and email.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nickname:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: Admin registered successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     nickname:
 *                       type: string
 *                     email:
 *                       type: string
 *       400:
 *         description: Bad request. Nickname and email are required.
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
router.post('/registerAdmin', async (req, res) => {
  const adminData = req.body;

  // Check if required fields are present in the request body
  if (!adminData.fullname || !adminData.email) {
    return res.status(400).json({ message: 'Nickname and email are required' });
  }

  try {
    const newAdmin = await addAdmin(adminData);
    res.status(201).json({ message: 'Admin registered successfully', user: newAdmin });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;

