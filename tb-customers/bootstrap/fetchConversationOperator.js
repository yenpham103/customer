const { ConversationService, CrispService, OperatorsService } = require("../services");

async function fetchConversationOperator() {
    let operators = [];
    let ghostOperator = null;
    do {
        try {
            const foundOperators = await OperatorsService.findOperators();
            operators = foundOperators.map(operator => ({
                _id: operator._id.toString(),
                userId: operator.userId.toString(),
            }));
            ghostOperator = foundOperators.find(item => item.name === "Ghost Operator");
        } catch (error) {
            console.error("Error fetching ignore nicknames:", error);
        }

        try {
            const Conversations = await ConversationService.find({
                $or: [
                    { sessionOperatorId: null },
                    { sessionOperatorId: ghostOperator?.userId || null },
                ]
            }, {
                sessionId: 1,
            }, 1, 1000);
            for (const conversation of Conversations) {
                const { sessionId } = conversation;
                // Fetch conversation details and update its operator
                try {
                    const response = await CrispService.getConversation(sessionId);
                    const data = await response.json();
                    let sessionUserId = data?.data?.assigned?.user_id;
                    console.log("Updating conversation operator for session:", sessionId);
                    if (!sessionUserId) continue;
                    const foundOperator = operators.find(operator => operator.userId === sessionUserId);
                    if (foundOperator) {
                        await ConversationService.upsert({
                            sessionId,
                            sessionOperatorId: sessionUserId,
                        });
                    } else {
                        await ConversationService.upsert({
                            sessionId,
                            sessionOperatorId: ghostOperator?.userId || null,
                        });
                    }

                } catch (error) {
                    console.error("Error updating conversation operator:", error);
                }
            }
            await new Promise(r => setTimeout(r, 1000 * 60 * 60));
        } catch (error) {
            console.error("Error fetching visitors:", error);
            await new Promise(r => setTimeout(r, 1000 * 60));
        }
    } while (true);
}

module.exports = fetchConversationOperator;