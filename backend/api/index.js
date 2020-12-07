const express = require('express');
const router = express.Router();

const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const useragent = require('express-useragent');
const expressip = require('express-ip');
const rateLimit = require('express-rate-limit');

const whitelist = [
    process.env.URL_APP,

    'http://localhost:5016',
    'https://localhost:5016',
    'http://localhost:8080',
    'https://localhost:8080',
];

const corsOptions = {
    optionsSuccessStatus: 200,
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);

        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS' + origin));
        }
    },
};

router.use(cors(corsOptions));
router.use(helmet());
router.use(useragent.express());
router.use(expressip().getIpInfoMiddleware);
router.use(bodyParser.json({ limit: '1mb' }));
router.use(bodyParser.urlencoded({ limit: '1mb', extended: true }));
router.use(rateLimit({ max: process.env.ENVIRONMENT === 'DEV' ? 500 : 100 }));

router.use('/users', require('../routes/user'));
router.use('/projects', require('../routes/project'));
router.use('/tasks', require('../routes/task'));

module.exports = router;
