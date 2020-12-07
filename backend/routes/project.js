const express = require('express');
const controller = require('../controllers/project');
const verifyAdmin = require('../middlewares/verifyAdmin').verifyAdmin;
const verifyJWT = require('../middlewares/verifyJWT').verifyJWT;
const router = express.Router();

/**
 * @swagger
 * /api/projects:
 *  post:
 *    security:
 *      - jwt: []
 *    tags:
 *      - Project
 *    summary: Create a Project
 *    description: Create a Project
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - project
 *            properties:
 *              project:
 *                type: object
 *                required:
 *                 - name
 *                 - description
 *                 - tasks
 *                properties:
 *                  name:
 *                    type: string
 *                  description:
 *                    type: string
 *    responses:
 *      201:
 *        description: Create a Project
 */
router.route('').post(verifyJWT, controller.save);

/**
 * @swagger
 * /api/projects:
 *  get:
 *    security:
 *      - jwt: []
 *    summary: Get All Projects*
 *    description: Get All Projects (If you are an administrator you will be able to see all projects, otherwise you will only see yours.)
 *    tags:
 *      - Project
 *    responses:
 *      200:
 *        description: Retrieve All Projects
 */
router.route('').get(verifyJWT, verifyAdmin, controller.find);

/**
 * @swagger
 * /api/projects/{id}:
 *  get:
 *    security:
 *      - jwt: []
 *    summary: Get Project By ID
 *    description: Get Project By ID (Only projects created by User)
 *    tags:
 *      - Project
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *    responses:
 *      200:
 *        description: Retrieve a Project
 */
router.route('/:id').get(verifyJWT, controller.findOne);

/**
 * @swagger
 * /api/projects/{id}:
 *  put:
 *    security:
 *      - jwt: []
 *    summary: Edit Project By ID
 *    description: Edit Project By ID (Only projects created by User)
 *    tags:
 *      - Project
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - project
 *            properties:
 *              project:
 *                type: object
 *                required:
 *                 - name
 *                 - description
 *                 - tasks
 *                properties:
 *                  name:
 *                    type: string
 *                  description:
 *                    type: string
 *                  tasks:
 *                    type: array
 *                    items:
 *                      type: string
 *    responses:
 *      200:
 *        description: Retrieve a Project
 */
router.route('/:id').put(verifyJWT, controller.updateOne);

/**
 * @swagger
 * /api/projects/{id}:
 *  delete:
 *    security:
 *      - jwt: []
 *    summary: Remove Project By ID
 *    description: Remove Project By ID (Only projects created by User)
 *    tags:
 *      - Project
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *    responses:
 *      200:
 *        description: Retrieve a Project
 */
router.route('/:id').delete(verifyJWT, controller.deleteOne);

module.exports = router;
