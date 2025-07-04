const mongoose = require('mongoose');
const mongooseLeanGetters = require('mongoose-lean-getters');

const Schema = mongoose.Schema;

const PermissionSchema = new Schema({
    role: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: {
            validator: function(value) {
                return value !== 'root';
            },
            message: 'Root role cannot be stored in database'
        }
    },
    dashboardGuest: {
        type: Boolean,
        default: true
    },
    dashboardView: {
        type: Boolean,
        default: false
    },
    dashboardEdit: {
        type: Boolean,
        default: false
    },
    operatorsView: {
        type: Boolean,
        default: false
    },
    operatorsEdit: {
        type: Boolean,
        default: false
    },
    conversationsView: {
        type: Boolean,
        default: false
    },
    conversationsEdit: {
        type: Boolean,
        default: false
    },
    storeDataView: {
        type: Boolean,
        default: false
    },
    storeDataEdit: {
        type: Boolean,
        default: false
    },
    ignoredNicknamesView: {
        type: Boolean,
        default: false
    },
    ignoredNicknamesEdit: {
        type: Boolean,
        default: false
    },
    userAdministrationView: {
        type: Boolean,
        default: false
    },
    userAdministrationEdit: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false,
    toObject: { getters: true },
    toJSON: { getters: true }
});

PermissionSchema.plugin(mongooseLeanGetters);

PermissionSchema.index({ isActive: 1 });

module.exports = mongoose.model('Permission', PermissionSchema);