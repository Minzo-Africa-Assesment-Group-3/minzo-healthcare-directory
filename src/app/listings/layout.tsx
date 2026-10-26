import Navbar from "@/components/landing/navbar";
import { getCurrentMember } from "@/lib/member-session";
// import Navbar from "../(user-dashboard)/components/navbar"

const ListingLayout = async ({ children }: { children: React.ReactNode }) => {
    const user = await getCurrentMember();
    return (
        <div>
            <Navbar user={user} />
            <div className="flex-1">{children}</div>
        </div>
    )
}

export default ListingLayout