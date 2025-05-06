import { Express, Request, Response } from 'express';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
        title: 'Express API for Form Application',
        version: '1.0.0',
        description: 'Simple CRUD API application made with Express and documented with Swagger',
        contact: {
            name: 'Exform: Form Application',
            url: 'localhost:3000',
            email: 'umarhadimukti@gmail.com',
        },
        servers: [
            {
                url: 'http://localhost:3002',
                description: 'Development server',
            },
        ],
    },
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                description: 'JWT Authorization header using the Bearer scheme. Example: "Authorization: Bearer {token}"',
            },
        },
    },
    security: [
        {
            bearerAuth: [],
        },
    ],
    tags: [
        {
            name: 'auth',
            description: 'Authentication routes',
        },
        {
            name: 'form',
            description: 'Form routes',
        },
        {
            name: 'question',
            description: 'Question routes',
        },
        {
            name: 'option',
            description: 'Option routes',
        },
        {
            name: 'user',
            description: 'User routes',
        },
        {
            name: 'seed',
            description: 'Seed routes',
        },
    ],
    paths: {},
  },
  apis: ['./src/routes/*.ts', './src/models/*.ts'],
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);

const swaggerDocs = (app: Express, port: number) => {

    // swagger page
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    // docs in json format
    app.get('/api-docs.json', (req: Request, res: Response) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });

};

export default swaggerDocs;