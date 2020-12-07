const Task = require('../models/task');

const queryHelper = require('../helpers/query');

const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);
const qpm = require('query-params-mongo');
const mongodb = require('mongodb');
const ObjectId = require('mongoose').Types.ObjectId;

const processQuery = qpm({
    autoDetect: [{ taskPattern: /_id$/, dataType: 'objectId' }],
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
            { project: { dataType: 'objectId', required: false } },
            true
        );

        query = queryHelper.setQueryInfos(query);
    } catch (errors) {
        return res.status(500).send({
            errors: errors,
        });
    }

    Task.countDocuments(query.filter)
        .limit(parseInt(process.env.MAX_LIMIT))
        .exec((error, total) => {
            if (error) {
                res.status(500).send({
                    error: error,
                });
            } else {
                Task.find(query.filter)
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
                                tasks: docs,
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
        res.status(404).send({
            error: 'ID param not found.',
        });
    }

    if (!ObjectId.isValid(req.params.id)) {
        return res.status(403).send({
            success: false,
            error: 'Task ID param is not a valid Task.',
        });
    }

    Task.findOne({ _id: req.params.id })
        .populate('project')
        .lean()
        .exec((error, doc) => {
            if (error) {
                res.status(500).send({
                    error: error,
                });
            } else {
                res.send({
                    task: doc,
                });
            }
        });
};

exports.done = async (req, res) => {
    if (!req.body) {
        return res.sendStatus(400);
    }

    if (req.params.id === undefined) {
        return res.status(404).send({
            error: 'ID param not found.',
        });
    }

    if (!ObjectId.isValid(req.params.id)) {
        return res.status(403).send({
            success: false,
            error: 'Task ID param is not a valid Task.',
        });
    }

    const query = { _id: req.params.id, isDone: false };

    if (!req.user.isAdmin) {
        query.createdBy = req.params.id;
    }

    const update = Object.assign(
        {
            lastUpdatedAt: new Date(),
            isDone: true,
        },
        req.body.task
    );

    const options = {
        new: true,
        setDefaultsOnInsert: true,
    };

    Task.findOneAndUpdate(query, update, options).exec((error, doc) => {
        if (error) {
            res.status(500).send({
                error: error,
            });
        } else {
            res.status(200).send({
                task: doc,
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
            error: 'ID param not found.',
        });
    }

    if (!ObjectId.isValid(req.params.id)) {
        return res.status(403).send({
            success: false,
            error: 'Task ID param is not a valid Task.',
        });
    }

    const schema = Joi.object({
        task: Joi.object({
            name: Joi.string(),
            description: Joi.string().allow('', null),

            startAt: Joi.date(),
            finishAt: Joi.date(),
        }),
    });

    const checkBody = schema.validate(req.body);

    if (checkBody.error) {
        return res.status(500).send({
            error: checkBody.error.message,
        });
    }

    const query = { _id: req.params.id, isDone: false };

    if (!req.user.isAdmin) {
        query.createdBy = req.params.id;
    }

    const update = Object.assign(
        {
            lastUpdatedAt: new Date(),
        },
        req.body.task
    );

    const options = {
        new: true,
        setDefaultsOnInsert: true,
    };

    Task.findOneAndUpdate(query, update, options).exec((error, doc) => {
        if (error) {
            res.status(500).send({
                error: error,
            });
        } else {
            res.status(200).send({
                task: doc,
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
            error: 'ID param not found.',
        });
    }

    if (!ObjectId.isValid(req.params.id)) {
        return res.status(403).send({
            success: false,
            error: 'Task ID param is not a valid Task.',
        });
    }

    const query = { _id: req.params.id };

    if (!req.user.isAdmin) {
        query.createdBy = req.params.id;
    }

    Task.deleteOne(query).exec((error, doc) => {
        if (error) {
            res.status(500).send({
                error: error,
            });
        } else {
            doc.id = req.params.id;

            res.send({
                task: doc,
            });
        }
    });
};

exports.save = async (req, res) => {
    if (!req.body) {
        return res.sendStatus(400);
    }

    const schema = Joi.object({
        task: Joi.object({
            name: Joi.string(),
            description: Joi.string().allow('', null),
            project: Joi.objectId(),

            startAt: Joi.date(),
            finishAt: Joi.date(),
        }),
    });

    const checkBody = schema.validate(req.body);

    if (checkBody.error) {
        return res.status(500).send({
            error: checkBody.error.message,
        });
    }

    const task = new Task(req.body.task);
    task.createdBy = req.user.id;

    const resC = task.save();

    resC.then((doc) => {
        res.status(201).send({
            task: doc,
        });
    }).catch((err) => {
        res.status(500).send({
            error: err.message,
        });
    });
};
