const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');
const mongoose = require('mongoose');
const app = express();

global.appRoot = path.resolve(__dirname);

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.3',
        info: {
            version: '0.0.1',
            title: 'ToDo List API',
            description:
                "EdirectInsure's Code Challenge for develeoping a ToDo List",
            contact: {
                name: 'Thiago Costa Cavalcante',
            },
            servers: ['http://localhost:5016'],
        },
        basePath: '/',
        components: {
            securitySchemes: {
                jwt: {
                    type: 'http',
                    scheme: 'bearer',
                    in: 'header',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                jwt: [],
            },
        ],
    },
    apis: ['./routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

const options = {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
};

mongoose
    .connect(process.env.MONGODB_URI, options)
    .then(() => {
        console.log('EdirectInsure > MongoDB > Connected!');

        if (process.env.ENVIRONMENT === 'PROD') {
            app.set('trust proxy', 1);
        }

        app.use('/api', require('./api'));
        app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
        app.use(express.static(path.join(global.appRoot, 'public')));

        app.set('port', process.env.PORT || 3000);

        app.listen(app.get('port'), () => {
            console.log('EdirectInsure > Server > Port ' + app.get('port'));
            require('./setups/user');
        });
    })
    .catch((error) => {
        console.error(error.stack);
    });
