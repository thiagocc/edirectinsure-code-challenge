const Project = require('../models/project');

const queryHelper = require('../helpers/query');

const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);
const qpm = require('query-params-mongo');
const mongodb = require('mongodb');
const ObjectId = require('mongoose').Types.ObjectId;

const processQuery = qpm({
    autoDetect: [{ projectPattern: /_id$/, dataType: 'objectId' }],
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
            { name: { dataType: 'string', required: false } },
            true
        );

        query = queryHelper.setQueryInfos(query);
    } catch (errors) {
        return res.status(500).send({
            errors: errors,
        });
    }

    if (!req.user.isAdmin) {
        query.filter.createdBy = req.user.id;
    }

    Project.countDocuments(query.filter)
        .limit(parseInt(process.env.MAX_LIMIT))
        .exec((error, total) => {
            if (error) {
                res.status(500).send({
                    error: error,
                });
            } else {
                Project.find(query.filter)
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
                                projects: docs,
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
            error: 'Project ID param not found.',
        });
    }

    if (!ObjectId.isValid(req.params.id)) {
        return res.status(403).send({
            success: false,
            error: 'Project ID param is not a valid Project.',
        });
    }

    const query = { _id: req.params.id };

    if (!req.user.isAdmin) {
        query.createdBy = req.user.id;
    }

    Project.findOne(query)
        .lean()
        .exec((error, doc) => {
            if (error) {
                res.status(500).send({
                    error: error,
                });
            } else {
                res.send({
                    project: doc,
                });
            }
        });
};

exports.updateOne = async (req, res) => {
    if (!req.body) {
        return res.sendStatus(400);
    }

    if (req.params.id === undefined) {
        return res.status(404).send({
            success: false,
            error: 'Project ID param not found.',
        });
    }

    if (!ObjectId.isValid(req.params.id)) {
        return res.status(403).send({
            success: false,
            error: 'Project ID param is not a valid Project.',
        });
    }

    const schema = Joi.object({
        project: Joi.object({
            name: Joi.string(),
            description: Joi.string().allow('', null),
        }),
    });

    const checkBody = schema.validate(req.body);

    if (checkBody.error) {
        return res.status(500).send({
            error: checkBody.error.message,
        });
    }

    const query = { _id: req.params.id };

    if (!req.user.isAdmin) {
        query.createdBy = req.user.id;
    }

    const update = Object.assign(
        {
            lastUpdatedAt: new Date(),
        },
        req.body.project
    );

    const options = {
        new: true,
        setDefaultsOnInsert: true,
    };

    Project.findOneAndUpdate(query, update, options).exec((error, doc) => {
        if (error) {
            res.status(500).send({
                error: error,
            });
        } else {
            res.status(200).send({
                project: doc,
            });
        }
    });
};

exports.deleteOne = async (req, res) => {
    if (!req.body) {
        return res.sendStatus(400);
    }

    if (req.params.id === undefined) {
        return res.status(404).send({
            error: 'Project ID param not found.',
        });
    }

    if (!ObjectId.isValid(req.params.id)) {
        return res.status(403).send({
            success: false,
            error: 'Project ID param is not a valid Project.',
        });
    }

    const query = { _id: req.params.id };

    if (!req.user.isAdmin) {
        query.createdBy = req.user.id;
    }

    Project.deleteOne(query).exec((error, doc) => {
        if (error) {
            res.status(500).send({
                error: error,
            });
        } else {
            doc.id = req.params.id;

            res.send({
                project: doc,
            });
        }
    });
};

exports.save = async (req, res) => {
    if (!req.body) {
        return res.sendStatus(400);
    }

    const schema = Joi.object({
        project: Joi.object({
            name: Joi.string(),
            description: Joi.string().allow('', null),
        }),
    });

    const checkBody = schema.validate(req.body);

    if (checkBody.error) {
        return res.status(500).send({
            error: checkBody.error.message,
        });
    }

    const project = new Project(req.body.project);
    project.createdBy = req.user.id;

    const resC = project.save();

    resC.then((doc) => {
        res.status(201).send({
            project: doc,
        });
    }).catch((err) => {
        res.status(500).send({
            error: err.message,
        });
    });
};
