const express = require('express');
const controller = require('../controllers/user');
const verifyAdmin = require('../middlewares/verifyAdmin').verifyAdmin;
const verifyJWT = require('../middlewares/verifyJWT').verifyJWT;
const router = express.Router();

/**
 * @swagger
 * /api/users:
 *  post:
 *    security:
 *      - jwt: []
 *    tags:
 *      - User
 *    summary: Create/Register a User
 *    description: Create/Register a User
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - user
 *            properties:
 *              user:
 *                type: object
 *                required:
 *                 - name
 *                 - email
 *                 - password
 *                properties:
 *                  name:
 *                    type: string
 *                  email:
 *                    type: string
 *                  password:
 *                    type: string
 *    responses:
 *      200:
 *        description: Create/Register a user
 */
router.route('').post(controller.save);

/**
 * @swagger
 * /api/users:
 *  get:
 *    security:
 *      - jwt: []
 *    summary: Get All Users*
 *    description: Get All Users (Only Administrator)
 *    tags:
 *      - User
 *    responses:
 *      200:
 *        description: Retrieve All Users
 */
router.route('').get(verifyJWT, verifyAdmin, controller.find);

/**
 * @swagger
 * /api/users/checkToken:
 *  get:
 *    security:
 *      - jwt: []
 *    summary: checkToken
 *    tags:
 *      - User
 *    responses:
 *      200:
 *        description: checkToken
 */
router.route('/checkToken').get(verifyJWT, controller.checkToken);

/**
 * @swagger
 * /api/users/login:
 *  post:
 *    tags:
 *      - User
 *    summary: Login
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - user
 *            properties:
 *              user:
 *                type: object
 *                required:
 *                 - email
 *                 - password
 *                properties:
 *                  email:
 *                    type: string
 *                  password:
 *                    type: string
 *    responses:
 *      200:
 *        description: Login
 */
router.route('/login').post(controller.login);

/**
 * @swagger
 * /api/users/logout:
 *  get:
 *    security:
 *      - jwt: []
 *    summary: Logout
 *    tags:
 *      - User
 *    responses:
 *      200:
 *        description: Logout
 */
router.route('/logout').get(verifyJWT, controller.logout);

/**
 * @swagger
 * /api/users/{id}:
 *  get:
 *    security:
 *      - jwt: []
 *    summary: Get User By ID
 *    tags:
 *      - User
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *    responses:
 *      200:
 *        description: Retrieve a User
 */
router.route('/:id').get(verifyJWT, controller.findOne);

module.exports = router;
