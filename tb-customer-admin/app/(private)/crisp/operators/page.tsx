import { auth } from "@/auth"
import PageOperators from "@/components/crisp/operators/page"

export default async function Operators() {

    const session = await auth();

    if (!session) {
        return <></>
    }

    return (
        <PageOperators session={session} />
    )
}
