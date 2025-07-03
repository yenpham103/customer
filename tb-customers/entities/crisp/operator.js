const mongoose = require('mongoose');
const mongooseLeanGetters = require('mongoose-lean-getters');

const Schema = mongoose.Schema;

const CrispOperatorSchema = new Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        default: 'active',
    },
    type: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        required: false,
    },
}, { timestamps: true, versionKey: false, toObject: { getters: true }, toJSON: { getters: true } });

CrispOperatorSchema.plugin(mongooseLeanGetters);
CrispOperatorSchema.index({ unique: true });

module.exports = mongoose.model('CrispOperator', CrispOperatorSchema);
