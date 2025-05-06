

/**
 * @openapi
 * components:
 *   schemas:
 *     CurrentUser:
 *       type: object
 *       required:
 *         - first_name
 *         - last_name
 *         - email
 *         - password
 *         - status
 *         - role_id
 *       properties:
 *         first_name:
 *           type: string
 *           default: John
 *         last_name:
 *           type: string
 *           default: Doe
 *         email:
 *           type: string
 *           default: johndoe@gmail.com
 *         password:
 *           type: string
 *           default: test1234
 *         status:
 *           type: string
 *           default: ACTIVE
 *         role_id:
 *           type: number
 *           default: 1
 */