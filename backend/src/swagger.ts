import swaggerJsdoc from 'swagger-jsdoc';
import express from 'express';
import {serve, setup} from 'swagger-ui-express';


const swaggerRouter = express.Router();
swaggerRouter.use(serve);
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Chatbot API',
            version: '1.0.0',
        },
    },
    apis: ['./src/methods/*.ts', './src/entity/*.ts'], // files containing annotations as above
};

const openapiSpecification = swaggerJsdoc(options);

swaggerRouter.get('/', setup(openapiSpecification));


export default swaggerRouter;
