/* eslint-disable  @typescript-eslint/no-explicit-any */

export type Conversation = {
    _id: string;
    nickname: string;
    sessionId: string;
    sessionEmail: string;
    assignedOperator: string;
    hasShopData: boolean;
}

export type Conversations = {
    loading: boolean;
    data: Array<Conversation>;
    total: number;
    totalPages: number;
    error: any;
}