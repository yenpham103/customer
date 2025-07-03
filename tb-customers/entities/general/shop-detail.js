const mongoose = require('mongoose');
const mongooseLeanGetters = require('mongoose-lean-getters');

const Schema = mongoose.Schema;

const ShopDetailSchema = new Schema({
    domain: {
        type: String,
        required: true,
    },
    email: {
        type: String,
    },
    customerEmail: {
        type: String,
    },
    shopId: {
        type: String,
    },
    shopCreatedAt: {
        type: Date,
    },
    storeName: {
        type: String,
    },
    planName: {
        type: String,
    },
    planDisplayName: {
        type: String,
    },
    country: {
        type: String,
    },
    productCategories: {
        type: [String],
    }
    
}, { timestamps: true, versionKey: false, toObject: { getters: true }, toJSON: { getters: true } });

ShopDetailSchema.plugin(mongooseLeanGetters);

ShopDetailSchema.index({ domain: 1 }); 
ShopDetailSchema.index({ country: 1 });      
ShopDetailSchema.index({ productCategories: 1 });

module.exports = mongoose.model('ShopDetail', ShopDetailSchema);
