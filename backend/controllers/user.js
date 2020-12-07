const Users = require('../models/user');

const userHelp = require('../helpers/user');
const queryHelper = require('../helpers/query');

const jwt = require('jsonwebtoken');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);
const qpm = require('query-params-mongo');
const mongodb = require('mongodb');
const ObjectId = require('mongoose').Types.ObjectId;

const processQuery = qpm({
    autoDetect: [{ fieldPattern: /_id$/, dataType: 'objectId' }],
    converters: { objectId: mongodb.ObjectID },
});

exports.find = async (req, res) => {
    if (!req.body) {
        return res.sendStatus(400);
    }

    let query;

    try {
        query = processQuery(
            req.query,
            {
                email: { dataType: 'string', required: false },
                name: { dataType: 'string', required: false },
            },
            true
        );

        query = queryHelper.setQueryInfos(query);
    } catch (errors) {
        return res.status(500).send({
            errors: errors,
        });
    }

    Users.countDocuments(query.filter)
        .limit(parseInt(process.env.MAX_LIMIT))
        .exec((error, total) => {
            if (error) {
                res.status(500).send({
                    error: error,
                });
            } else {
                Users.find(query.filter)
                    .sort(query.sort)
                    .skip(query.skip)
                    .limit(query.limit)
                    .lean()
                    .exec((error, docs) => {
                        if (error) {
                            res.status(500).send({
                                error: error,
                            });
                        } else {
                            res.send({
                                infos: queryHelper.getInfos(total, query),
                                fields: docs,
                            });
                        }
                    });
            }
        });
};

exports.findOne = (req, res) => {
    if (!req.body) {
        return res.sendStatus(400);
    }

    if (req.params.id === undefined) {
        return res.status(404).send({
            success: false,
            error: 'User ID param not found.',
        });
    }

    if (!ObjectId.isValid(req.params.id)) {
        return res.status(403).send({
            success: false,
            error: 'User ID param is not a valid User.',
        });
    }

    if (!req.user.isAdmin && req.user.id !== req.params.id) {
        return res.status(403).send({
            success: false,
            error: 'Access to the requested resource is forbidden',
        });
    }

    Users.findById(req.user.id).exec(async (error, user) => {
        if (error) {
            res.status(500).send({
                success: false,
                error: error,
            });
        } else {
            res.status(200).send({
                success: true,
                user: user,
            });
        }
    });
};

exports.save = (req, res) => {
    if (!req.body) {
        return res.sendStatus(400);
    }

    const schemaUser = Joi.object().keys({
        user: Joi.object().keys({
            name: Joi.string().required(),
            email: Joi.string().required(),
            password: Joi.string().required(),
            passwordConfirmed: Joi.string()
                .valid(Joi.ref('password'))
                .required(),
        }),
    });

    const checkBody = schemaUser.validate(req.body);

    if (checkBody.error) {
        // hide password
        checkBody.error.message = checkBody.error.message.replace(
            req.body.password || '',
            '******'
        );

        checkBody.error.message = checkBody.error.message.replace(
            req.body.passwordConfirmed || '',
            '******'
        );

        return res.status(500).send({
            error: checkBody.error.message,
        });
    }

    userHelp
        .checkExistingUser(req.body.user.email)
        .then((resCEU) => {
            if (resCEU) {
                res.status(409).send({
                    success: false,
                    error: 'User already exists',
                });
            } else {
                const user = new Users(req.body.user);

                user.save()
                    .then((resUS) => {
                        delete resUS._doc.password;

                        res.status(201).send({
                            success: true,
                            user: resUS,
                        });
                    })
                    .catch((error) => {
                        console.log(error);
                        res.status(500).send({
                            success: false,
                            error: error,
                        });
                    });
            }
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send({
                success: false,
                error: error,
            });
        });
};

exports.login = (req, res) => {
    if (!req.body) {
        return res.sendStatus(400);
    }

    const schemaUser = Joi.object().keys({
        user: Joi.object().keys({
            email: Joi.string().required(),
            password: Joi.string().required(),
        }),
    });

    const checkBody = schemaUser.validate(req.body);

    if (checkBody.error) {
        // hide password
        checkBody.error.message = checkBody.error.message.replace(
            req.body.password || '',
            '******'
        );

        return res.status(500).send({
            error: checkBody.error.message,
        });
    }

    Users.findOne({ email: req.body.user.email, status: 1 }).exec(
        async (error, user) => {
            if (error) {
                res.status(500).send({
                    success: false,
                    error: error,
                });
            } else {
                if (user) {
                    const isValidPassword = user.isValidPassword(
                        req.body.user.password
                    );

                    if (isValidPassword) {
                        user.lastLoginAt = new Date();
                        user.save();

                        const buffUserAgent = Buffer.from(
                            JSON.stringify(req.useragent)
                        );
                        const useragent = buffUserAgent.toString('base64');

                        const buffIPInfo = Buffer.from(
                            JSON.stringify(req.ipInfo)
                        );
                        const ipinfo = buffIPInfo.toString('base64');

                        const token = jwt.sign(
                            {
                                id: user._id,
                                session: user.session,
                                isAdmin: user.isAdmin,
                                useragent: useragent,
                                ipinfo: ipinfo,
                            },
                            process.env.JWT_SECRET,
                            {
                                expiresIn: '12h',
                            }
                        );

                        res.send({
                            success: true,
                            user: {
                                name: user.name,
                                email: user.email,
                                token: token,
                            },
                        });
                    } else {
                        res.status(401).send({
                            success: false,
                            error: 'Ops! E-mail and/or password mismatch.',
                        });
                    }
                } else {
                    res.status(404).send({
                        success: false,
                        error: 'User not found.',
                    });
                }
            }
        }
    );
};

exports.logout = (req, res) => {
    if (!req.body) {
        return res.sendStatus(400);
    }

    // only for logs purposes

    res.status(200).send();
};

exports.checkToken = (req, res) => {
    if (!req.body) {
        return res.sendStatus(400);
    }

    res.status(200).send();
};
