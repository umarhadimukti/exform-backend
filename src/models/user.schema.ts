

/**
 * @swagger
 * components:
 *   schemas:
 *     CurrentUser:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         first_name:
 *           type: string
 *           description: First name of the user
 *         last_name:
 *           type: string
 *           description: Last name of the user
 *         email:
 *           type: string
 *           format: email
 *           description: Email address of the user
 *         role_id:
 *           type: number
 *           description: Role ID of the user
 *         role:
 *           type: object
 *           properties:
 *             id:
 *               type: number
 *               description: Role ID
 *             name:
 *               type: string
 *               description: Role name
 *       example:
 *         first_name: John
 *         last_name: Doe
 *         email: johndoe@gmail.com
 *         role_id: 1
 *         role:
 *           id: 1
 *           name: Super Admin
 *     Users:
 *       type: object
 *       required:
 *         - first_name
 *         - email
 *         - password
 *         - status
 *         - role_id
 *       properties:
 *         first_name:
 *           type: string
 *           description: First name of the user
 *         last_name:
 *           type: string
 *           description: Last name of the user
 *         email:
 *           type: string
 *           format: email
 *           description: Email address of the user
 *         password:
 *           type: string
 *           description: Password of the user
 *         status:
 *           type: string
 *           description: Status of the user
 *           enum: [ACTIVE, INACTIVE]
 *         role_id:
 *           type: number
 *           description: Role ID of the user
 *       example:
 *         first_name: John
 *         last_name: Doe
 *         email: johndoe@gmail.com
 *         password: test1234
 *         status: ACTIVE
 *         role_id: 1
 */