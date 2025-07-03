const IgnoreNicknames = require("../entities/general/ignoreNickname");

class IgnoreNicknameService {
    static find = function (filter = {}, projection = {}) {
        return IgnoreNicknames.find(filter, projection).lean().exec();
    }

    static createMany = function (data) {
        return IgnoreNicknames.insertMany(data);
    }

    static purge = function (filter = {}) {
        return IgnoreNicknames.deleteMany(filter);
    }
}

module.exports = IgnoreNicknameService
