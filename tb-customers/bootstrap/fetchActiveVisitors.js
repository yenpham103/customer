const { ConversationService, CrispService, IgnoreNicknameService } = require("../services");

async function fetchActiveVisitors() {
    const now = new Date();
    const hours = now.getHours();
    const results = [];
    let IgnoreNicknames = [];
    do {
        try {
            const ignoreNicknames = await IgnoreNicknameService.find();
            IgnoreNicknames = ignoreNicknames.map(item => item.domain);
        } catch (error) {
            console.error("Error fetching ignore nicknames:", error);
        }

        try {
            const VisitorResponse = await CrispService.getVisitors();
            const Visitors = await VisitorResponse.json();
            // Save the visitors to the database
            for (const visitor of Visitors.data) {
                const { nickname, session_id, email } = visitor;
                if (nickname && !IgnoreNicknames.includes(nickname) && !nickname.startsWith("visitor") && !!email) {
                    try {
                        await ConversationService.upsert({
                            nickname,
                            sessionId: session_id,
                            sessionEmail: email,
                        });
                    } catch (error) {
                        console.error("Error upserting visitor:", visitor, error);
                    }
                }
            }
            await new Promise(r => setTimeout(r, 1000 * 60 * 1));
        } catch (error) {
            console.error("Error fetching visitors:", error);
            await new Promise(r => setTimeout(r, 1000 * 10));
        }
    } while (true);
}

module.exports = fetchActiveVisitors;