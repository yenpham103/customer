const CrispConvo = require("../entities/crisp/conversation");

class ConversationService {
    static find = function (filter = {}, projection = {}, page = 1, limit = 50) {
        return CrispConvo.find(filter, projection, {
            sort: { nickname: 1 },
        }).skip((page - 1) * limit).limit(limit).lean().exec();
    }

    static aggregateOperator = async function (filter = {}, page = 1, limit = 50, count = false) {
        const aggregations = [];
        const match = {
            $match: {}
        };
        if (filter.q) {
            match.$match.$or = [
                { nickname: { $regex: filter.q, $options: 'i' } },
                { sessionEmail: { $regex: filter.q, $options: 'i' } }
            ]
        }
        if (filter.nickname === "valid") {
            match.$match.nickname = { $regex: "^[a-z0-9-]+\\.myshopify\\.com$", $options: "i" }
        } else if (filter.nickname === "invalid") {
            match.$match.nickname = { $not: { $regex: "^[a-z0-9-]+\\.myshopify\\.com$", $options: "i" } };
        }
        aggregations.push(match);
        aggregations.push(
            {
                $lookup: {
                    from: "crispoperators",
                    localField: "sessionOperatorId",
                    foreignField: "userId",
                    as: "operator_info"
                }
            },
            {
                $lookup: {
                    from: "shops",
                    localField: "nickname",
                    foreignField: "domain",
                    as: "shop_info"
                }
            },
            {
                $addFields: {
                    assignedOperator: {
                        $cond: {
                            if: {
                                $gt: [
                                    {
                                        $size: "$operator_info"
                                    },
                                    0
                                ]
                            },
                            then: {
                                $arrayElemAt: [
                                    "$operator_info.name",
                                    0
                                ]
                            },
                            else: "None assigned"
                        }
                    },
                    hasShopData: {
                        $gt: [{ $size: "$shop_info" }, 0]
                    }
                }
            },
            {
                $project: {
                    _id: 1,
                    sessionId: 1,
                    nickname: 1,
                    sessionEmail: 1,
                    assignedOperator: 1,
                    hasShopData: 1
                }
            },
        );
        if (filter.operator) {
            aggregations.push({
                $match: {
                    assignedOperator: filter.operator
                }
            });
        }
        if (count) {
            aggregations.push({ $count: "total" });
        } else {
            aggregations.push(
                {
                    $sort: { nickname: 1 }
                },
                {
                    $skip: (page - 1) * limit
                },
                {
                    $limit: limit
                }
            );
        }
        const result = await CrispConvo.aggregate(aggregations).exec();
        if (count) {
            return result[0] ? result[0].total : 0;
        }
        return result;
    }

    static count = function (filter = {}) {
        return CrispConvo.countDocuments(filter).exec();
    }

    static upsert = function (data) {
        return CrispConvo.findOneAndUpdate({
            sessionId: data.sessionId,
        }, data, {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true,
            runValidators: true,
        });
    }

    static purge = function (filter = {}) {
        return CrispConvo.deleteMany(filter);
    }

    static deleteOne = function (filter = {}) {
        return CrispConvo.deleteOne(filter);
    }

}

module.exports = ConversationService;
