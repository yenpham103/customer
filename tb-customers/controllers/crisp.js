const { ConversationService, CrispService, OperatorsService } = require("../services");
const { default: mongoose } = require("mongoose");

module.exports = {
    bulkActionConversations: async (ctx) => {
        const { action, conversationIds } = ctx.request.body;
        if (!action || ["delete"].indexOf(action) === -1 || !conversationIds || !Array.isArray(conversationIds)) {
            ctx.status = 400;
            ctx.body = {
                message: "Invalid request",
                data: null
            };
            return;
        }
        try {
            const objectIds = conversationIds.map(id => new mongoose.Types.ObjectId(id));
            if (action === "delete") {
                await ConversationService.deleteMany({ _id: { $in: objectIds } });
            }
            ctx.body = {
                message: "success",
            };
        } catch (error) {
            console.log(error);
            ctx.status = 500;
            ctx.body = {
                message: "error",
                data: error
            };
        }
    },
    getConversations: async (ctx) => {
        try {
            const { page = 1, limit = 15, operator = "all", q, nickname = "all" } = ctx.query;
            const filter = {};
            if (q) {
                filter['q'] = q;
            }

            filter['operator'] = operator === "all" ? null : operator;
            filter['nickname'] = nickname === "all" ? null : nickname;

            const conversations = await ConversationService.aggregateOperator(filter, page, limit);
            const total = await ConversationService.aggregateOperator(filter, page, limit, true);

            ctx.body = {
                message: "success",
                data: conversations,
                total: total,
                totalPages: Math.ceil(total / limit),
            }
        } catch (error) {
            console.log(error);
            ctx.status = 500;
            ctx.body = {
                message: "error",
                data: error
            }
        }
    },
    deleteConversation: async (ctx) => {
        const { conversationId } = ctx.params;
        try {
            const response = await ConversationService.deleteOne({ _id: conversationId });
            ctx.status = 204; // No Content
            ctx.body = {
                message: "success",
                data: response
            }
        } catch (error) {
            console.log(error);
            ctx.status = 500;
            ctx.body = {
                message: "error",
                data: error
            }
        }
    },
    getOperators: async (ctx) => {
        try {
            const operators = await OperatorsService.findOperators();
            ctx.body = {
                message: "success",
                data: operators
            }
        } catch (error) {
            ctx.status = 500;
            ctx.body = {
                message: "error",
                data: error
            }
        }
    },
    syncOperators: async (ctx) => {
        try {
            const response = await CrispService.getOperators();
            const data = await response.json();
            const operators = data.data.map((operator) => {
                return {
                    userId: operator.details.user_id,
                    name: `${operator.details.first_name} ${operator.details.last_name}`,
                    type: operator.type,
                    email: operator.details.email,
                    avatar: operator.details.avatar
                }
            })
            operators.push({
                userId: `9eded6f9-41cd-4252-aee7-26cedf052d95`,
                name: `Ghost Operator`,
                type: `Ghost`,
                email: `ghost@bsscommerce.com`,
            })
            await OperatorsService.purge();
            await OperatorsService.createMany(operators);
            ctx.body = {
                message: "success",
                data: response
            }
        } catch (error) {
            ctx.status = 500;
            ctx.body = {
                message: "error",
                data: error
            }
        }
    }
}