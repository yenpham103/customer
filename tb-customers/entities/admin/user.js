const mongoose = require('mongoose');
const mongooseLeanGetters = require('mongoose-lean-getters');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    avatar: {
        type: String,
        default: null
    },
    role: {
        type: String,
        default: null
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLoginAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    versionKey: false,
    toObject: { getters: true },
    toJSON: { getters: true }
});

UserSchema.plugin(mongooseLeanGetters);

UserSchema.index({ role: 1 });
UserSchema.index({ isActive: 1 });

module.exports = mongoose.model('User', UserSchema);