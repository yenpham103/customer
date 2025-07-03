const mongoose = require('mongoose');
const mongooseLeanGetters = require('mongoose-lean-getters');

const Schema = mongoose.Schema;

const IgnoreSchema = new Schema({
    domain: {
        type: String,
        required: true,
        unique: true,
    },
}, { timestamps: true, versionKey: false, toObject: { getters: true }, toJSON: { getters: true } });

IgnoreSchema.plugin(mongooseLeanGetters);

module.exports = mongoose.model('Ignore', IgnoreSchema);
