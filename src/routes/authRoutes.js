var router = require('express').Router();
const { requiresAuth } = require('express-openid-connect');



// router.get('/', function (req, res, next) {
//   res.render('index', {
//     title: 'Auth0 Webapp sample Nodejs',
//     isAuthenticated: req.oidc.isAuthenticated()
//   });
// });


/**
 * @swagger
 * /api/private/profile:
 *   get:
 *     summary: Get user profile
 *     description: Retrieve the profile information of the authenticated user.
 *     tags:
 *       - Private
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: Successful response with user profile data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                   description: The username of the authenticated user.
 *                 email:
 *                   type: string
 *                   description: The email address of the authenticated user.
 *       '401':
 *         description: Unauthorized. Name, email, and password are required.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */


router.get('/profile', requiresAuth(), function (req, res, next) {
  res.status(200).json(req.oidc.user);
});



module.exports = router;
