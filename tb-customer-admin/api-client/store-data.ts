import axiosClient from './axios-client';

const EVENT_APP_TOKEN = process.env.NEXT_PUBLIC_EVENT_APP_TOKEN || '';

export const storeDataApi = {
    syncShopData: (domain: string, app: string, hash: string) => {
        return axiosClient.post(`/store-data/app-event`, {
            event: 'install',
            domain: domain,
            app: app,
            hash: hash,
            detail: 'Mida sync data',
            timestamp: new Date().toISOString()
        },
            {
                headers: {
                    'Authorization': `Bearer ${EVENT_APP_TOKEN}`,
                    'X-Bot-Request': 'mechabee'
                },
            }
        );
    },

    getConversationsByDomain: (domain: string) => {
        return axiosClient.get(`/crisp/conversations?q=${encodeURIComponent(domain)}`);
    },

    deleteConversation: (conversationId: string) => {
        return axiosClient.delete(`/crisp/conversations/${conversationId}`);
    },

    updateShopDetail: (domain: string) => {
        return axiosClient.put(`/store-data/shop`, { domain: domain });
    },
    
};
