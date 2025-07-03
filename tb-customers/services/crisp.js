const BaseUrl = "https://api.crisp.chat";
const Version = "v1";
const WebsiteId = "9f64b5a9-1a02-4190-93b8-8ef56b19f740";
const ApiUrl = `${BaseUrl}/${Version}/website/${WebsiteId}`;
const CrispToken = process.env.CRISP_TOKEN;

const CrispApis = Object.freeze({
    GETVisitors: `${ApiUrl}/visitors/list/`,
    GETOperators: `${ApiUrl}/operators/list/`,
    GETConversation: (sessionId) => {
        return `${ApiUrl}/conversation/${sessionId}/`;
    },
    GETConversationRouting: (sessionId) => {
        return `${ApiUrl}/conversation/${sessionId}/routing`;
    },
});

async function GET(url) {
    return await fetch(`${url}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization:
                `Basic ${CrispToken}`,
            "X-Crisp-Tier": "plugin",
        },
    });
}

class CrispService {
    static async getVisitors() {
        return await GET(CrispApis.GETVisitors)
    }

    static async getOperators() {
        return await GET(CrispApis.GETOperators)
    }

    static async getConversationRouting(sessionId) {
        return await GET(CrispApis.GETConversationRouting(sessionId))
    }

    static async getConversation(sessionId) {
        return await GET(CrispApis.GETConversation(sessionId))
    }
}

module.exports = CrispService