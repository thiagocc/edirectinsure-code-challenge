const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
    project: { type: Schema.Types.ObjectId, ref: 'Project' },
    name: String,
    description: String,

    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },

    startAt: { type: Date, default: Date.now },
    finishAt: Date,
    isDone: { type: Boolean, default: false },

    createdAt: { type: Date, default: Date.now },
    lastUpdatedAt: { type: Date, default: Date.now },
});

TaskSchema.index({
    project: 1,
});

module.exports = mongoose.model('Task', TaskSchema);
