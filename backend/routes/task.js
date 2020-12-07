const express = require('express');
const controller = require('../controllers/task');
const verifyAdmin = require('../middlewares/verifyAdmin').verifyAdmin;
const verifyJWT = require('../middlewares/verifyJWT').verifyJWT;
const router = express.Router();

/**
 * @swagger
 * /api/tasks:
 *  post:
 *    security:
 *      - jwt: []
 *    tags:
 *      - Task
 *    summary: Create a Task
 *    description: Create a Task
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - task
 *            properties:
 *              task:
 *                type: object
 *                required:
 *                 - project
 *                 - name
 *                 - description
 *                 - startAt
 *                 - finishAt
 *                properties:
 *                  project:
 *                    type: string
 *                  name:
 *                    type: string
 *                  description:
 *                    type: string
 *                  startAt:
 *                    type: string
 *                  finishAt:
 *                    type: string
 *    responses:
 *      201:
 *        description: Create a Task
 */
router.route('').post(verifyJWT, controller.save);

/**
 * @swagger
 * /api/tasks:
 *  get:
 *    security:
 *      - jwt: []
 *    summary: Get All Tasks*
 *    description: Get All Tasks (If you are an administrator you will be able to see all tasks, otherwise you will only see yours.)
 *    parameters:
 *      - in: path
 *        name: project
 *        schema:
 *          type: string
 *        required: false
 *        description: Filter Tasks By Project ID
 *    tags:
 *      - Task
 *    responses:
 *      200:
 *        description: Retrieve All Tasks
 */
router.route('').get(verifyJWT, verifyAdmin, controller.find);

/**
 * @swagger
 * /api/tasks/{id}:
 *  get:
 *    security:
 *      - jwt: []
 *    summary: Get Task By ID
 *    description: Get Task By ID (Only tasks created by User)
 *    tags:
 *      - Task
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *    responses:
 *      200:
 *        description: Retrieve a Task
 */
router.route('/:id').get(verifyJWT, controller.findOne);

/**
 * @swagger
 * /api/tasks/{id}:
 *  put:
 *    security:
 *      - jwt: []
 *    summary: Edit Task By ID
 *    description: Edit Task By ID (Only tasks created by User)
 *    tags:
 *      - Task
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
 *              - task
 *            properties:
 *              task:
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
 *        description: Retrieve a Task
 */
router.route('/:id').put(verifyJWT, controller.updateOne);

/**
 * @swagger
 * /api/tasks/done/{id}:
 *  put:
 *    security:
 *      - jwt: []
 *    summary: Set Task to Done By ID
 *    description: Set Task to Done By ID (Only tasks created by User)
 *    tags:
 *      - Task
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *    responses:
 *      200:
 *        description: Retrieve a Task
 */
router.route('/done/:id').put(verifyJWT, controller.done);

/**
 * @swagger
 * /api/tasks/{id}:
 *  delete:
 *    security:
 *      - jwt: []
 *    summary: Remove Task By ID
 *    description: Remove Task By ID (Only tasks created by User)
 *    tags:
 *      - Task
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *    responses:
 *      200:
 *        description: Retrieve a Task
 */
router.route('/:id').delete(verifyJWT, controller.deleteOne);

module.exports = router;
