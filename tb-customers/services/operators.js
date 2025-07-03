const CrispOperators = require("../entities/crisp/operator");

class OperatorsService {
    static findOperators = function (filter = {}, projection = {}) {
        return CrispOperators.find(filter, projection).lean().exec();
    }

    static createMany = function (data) {
        return CrispOperators.insertMany(data);
    }

    static purge = function (filter = {}) {
        return CrispOperators.deleteMany(filter);
    }
}

module.exports = OperatorsService