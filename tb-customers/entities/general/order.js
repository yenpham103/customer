const mongoose = require('mongoose');
const mongooseLeanGetters = require('mongoose-lean-getters');

const Schema = mongoose.Schema;

const PaymentTermsSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    paymentTermsName: {
        type: String,
        required: true
    },
    paymentTermsType: {
        type: String,
        required: true
    },
    dueInDays: {
        type: Number,
        default: null
    }
}, { _id: false });

const Order = new Schema({
    domain: {
        type: String,
        required: true,
    },
    orderId: {
        type: String,
        required: true,
        unique: true,
    },
    amount: {
        type: String
    },
    currencyCode: {
        type: String,
        default: ''
    },
    paymentTerms: {
        type: PaymentTermsSchema,
        default: null
    },
    country: {
        type: String
    },
    totalTax: {
        type: String
    },
    taxExempt: {
        type: Boolean
    }

}, { timestamps: true, versionKey: false, toObject: { getters: true }, toJSON: { getters: true } });

Order.plugin(mongooseLeanGetters);

Order.index({ domain: 1 });

module.exports = mongoose.model('Order', Order);
