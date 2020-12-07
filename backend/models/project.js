const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
    name: String,
    description: String,

    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },

    createdAt: { type: Date, default: Date.now },
    lastUpdatedAt: { type: Date, default: Date.now },
});

ProjectSchema.index({
    name: 1,
});

module.exports = mongoose.model('Project', ProjectSchema);
