const mongoose = require('mongoose');
const mongooseLeanGetters = require('mongoose-lean-getters');

const Schema = mongoose.Schema;

const ShopSchema = new Schema({
    domain: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: false,
    },
    hashLock: {
        type: String,
        required: false,
    },
    hashSolution: {
        type: String,
        required: false,
    },
    hashPortal: {
        type: String,
        required: false,
    },
}, { timestamps: true, versionKey: false, toObject: { getters: true }, toJSON: { getters: true } });

ShopSchema.plugin(mongooseLeanGetters);

module.exports = mongoose.model('Shop', ShopSchema);
