import React from 'react'
import { redirect } from 'next/navigation';
// import Navbar from './components/navbar'
import UserProfileSidebar from './components/user-profile-sidebar'
// import { getCurrentUser } from '@/lib/session';
import { MemberAuthHydrator } from '@/components/member-auth-hydrator';
import { getCurrentMember } from '@/lib/member-session';
import Navbar from '@/components/landing/navbar';

const UserDashboardLayout = async ({ children }: { children: React.ReactNode }) => {
    const user = await getCurrentMember();

    if (!user) {
        redirect('/');
    }

    return (
        <div className="min-h-screen bg-[#F4F4F4] font-(family-name:--font-roboto-slab)">
            <Navbar user={user}/>
            <MemberAuthHydrator member={user} />

            <main className="mx-auto max-w-336 px-4 pb-20 pt-8">
                <h1 className="font-(family-name:--font-roboto-slab) text-4xl font-semibold text-gray-950">
                    My profile
                </h1>
                <p className="mt-1 text-sm text-gray-900">
                    Manage your details, the businesses you follow and the reviews you’ve written.
                </p>

                <div className="mt-8 grid items-start gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
                    <UserProfileSidebar />
                    <div className="flex-1">{children}</div>
                </div>
            </main>
        </div>
    )
}

export default UserDashboardLayout