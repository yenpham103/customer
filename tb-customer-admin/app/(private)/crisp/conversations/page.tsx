import { auth } from "@/auth"
import PageConversations from "@/components/crisp/conversations/page";

export default async function Conversations() {

    const session = await auth();

    if (!session) {
        return <></>
    }

    return (
        <PageConversations/>
    )
}
