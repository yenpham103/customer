import { auth } from "@/auth";
import IgnorePage from "@/components/store-data/ignore/page";

export default async function Ignore() {
    const session = await auth();
    if (!session) {
        return <></>
    }
    return (
        <IgnorePage />
    )
}