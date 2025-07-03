const mongoose = require('mongoose');
const mongooseLeanGetters = require('mongoose-lean-getters');

const Schema = mongoose.Schema;

const CrispConvoSchema = new Schema({
    nickname: {
        type: String,
        required: true,
    },
    sessionId: {
        type: String,
        required: true,
        unique: true,
    },
    sessionEmail: {
        type: String,
        required: false,
    },
    sessionOperatorId: {
        type: String,
        required: false,
    },
}, { timestamps: true, versionKey: false, toObject: { getters: true }, toJSON: { getters: true } });

CrispConvoSchema.plugin(mongooseLeanGetters);
CrispConvoSchema.index({ nickname: 1, sessionId: 1 });

module.exports = mongoose.model('CrispConvo', CrispConvoSchema);
